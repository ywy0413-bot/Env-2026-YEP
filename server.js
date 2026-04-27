const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const QRCode = require('qrcode');
const questions = require('./questions');

let employees = [];
try {
  employees = require('./employees.json');
} catch {
  console.warn('⚠️  employees.json 없음 — 인증 없이 실행됩니다.');
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── 임직원 목록 API (비밀번호 제외) ───────────────────────────
app.get('/api/employees', (req, res) => {
  res.json(employees.map(({ id, name, group }) => ({ id, name, group })));
});

// ─── 게임 상태 ───────────────────────────────────────────────
const INITIAL_HEARTS = 1;

let game = {
  status: 'waiting',      // waiting | countdown | question | revealing | finished
  players: {},            // employeeId -> playerData
  socketToEmp: {},        // socketId  -> employeeId
  currentIndex: -1,
  selectedQuestions: [],  // 게임마다 랜덤 선택된 20문제
  questionStartTime: null,
  revealData: null,
  finishedData: null,
  countdownTimer: null,
  questionTimer: null,
};

function createPlayer(nickname, socketId, employeeId) {
  return {
    employeeId,
    socketId,
    nickname,
    alive: true,
    hearts: INITIAL_HEARTS,
    score: 0,
    answered: null,
    answeredAt: null,
    eliminated: false,
  };
}

function getPlayerBySocket(socketId) {
  const empId = game.socketToEmp[socketId];
  return empId != null ? game.players[empId] : null;
}

function getPublicPlayers() {
  return Object.values(game.players).map(p => ({
    id: p.employeeId,
    nickname: p.nickname,
    alive: p.alive,
    hearts: p.hearts,
    score: p.score,
    eliminated: p.eliminated,
  }));
}

function getAlivePlayers() {
  return Object.values(game.players).filter(p => p.alive);
}

function selectRandomQuestions(perDifficulty = 5) {
  const byDiff = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  questions.forEach(q => { if (byDiff[q.difficulty]) byDiff[q.difficulty].push(q); });
  const selected = [];
  for (let d = 1; d <= 5; d++) {
    const pool = [...(byDiff[d] || [])];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    selected.push(...pool.slice(0, Math.min(perDifficulty, pool.length)));
  }
  return selected;
}

function getLobbyStats() {
  const all = Object.values(game.players);
  return {
    total: all.length,
    alive: all.filter(p => p.alive).length,
    eliminated: all.filter(p => p.eliminated).length,
  };
}

function clearTimers() {
  if (game.countdownTimer) { clearInterval(game.countdownTimer); game.countdownTimer = null; }
  if (game.questionTimer)  { clearTimeout(game.questionTimer);  game.questionTimer  = null; }
}

// ─── 플레이어에게 현재 상태 전송 (재연결용) ──────────────────
function pushCurrentState(socket, player) {
  if (game.status === 'waiting') return;

  if (game.status === 'countdown') {
    socket.emit('game:start', { totalQuestions: game.selectedQuestions.length });
    return;
  }

  if (game.status === 'question') {
    const q = game.selectedQuestions[game.currentIndex];
    socket.emit('game:question', {
      index: game.currentIndex,
      total: game.selectedQuestions.length,
      type: q.type,
      question: q.question,
      choices: q.choices,
      timeLimit: q.timeLimit,
      aliveCount: getAlivePlayers().length,
      elapsed: Math.floor((Date.now() - game.questionStartTime) / 1000),
    });
    if (player.answered !== null) {
      socket.emit('answer:confirmed', { choice: player.answered });
    }
    if (!player.alive) socket.emit('player:eliminated');
    return;
  }

  if (game.status === 'revealing') {
    socket.emit('game:reveal', game.revealData);
    if (!player.alive) socket.emit('player:eliminated');
    return;
  }

  if (game.status === 'finished') {
    socket.emit('game:finished', game.finishedData);
  }
}

// ─── 게임 로직 ───────────────────────────────────────────────
function startGame() {
  clearTimers();
  game.status = 'countdown';
  game.currentIndex = -1;
  game.selectedQuestions = selectRandomQuestions(5); // 난이도별 5문제 × 5단계 = 25문제

  Object.values(game.players).forEach(p => {
    p.alive = true;
    p.hearts = INITIAL_HEARTS;
    p.score = 0;
    p.answered = null;
    p.answeredAt = null;
    p.eliminated = false;
  });

  io.emit('game:start', { totalQuestions: game.selectedQuestions.length });

  let count = 3;
  io.emit('game:countdown', { count });
  game.countdownTimer = setInterval(() => {
    count--;
    if (count > 0) {
      io.emit('game:countdown', { count });
    } else {
      clearInterval(game.countdownTimer);
      game.countdownTimer = null;
      nextQuestion();
    }
  }, 1000);
}

function nextQuestion() {
  game.currentIndex++;

  if (game.currentIndex >= game.selectedQuestions.length || getAlivePlayers().length === 0) {
    endGame();
    return;
  }

  const q = game.selectedQuestions[game.currentIndex];
  game.status = 'question';
  game.questionStartTime = Date.now();
  game.revealData = null;

  Object.values(game.players).forEach(p => {
    p.answered = null;
    p.answeredAt = null;
  });

  const payload = {
    index: game.currentIndex,
    total: game.selectedQuestions.length,
    type: q.type,
    question: q.question,
    choices: q.choices,
    timeLimit: q.timeLimit,
    aliveCount: getAlivePlayers().length,
    elapsed: 0,
  };

  io.emit('game:question', payload);

  game.questionTimer = setTimeout(revealAnswer, q.timeLimit * 1000);
}

function revealAnswer() {
  clearTimers();
  game.status = 'revealing';

  const q = game.selectedQuestions[game.currentIndex];
  const correctIndex = q.answer;
  const results = {};
  const eliminated = [];
  const revived = [];

  Object.values(game.players).forEach(p => {
    if (!p.alive) return;

    const correct = p.answered === correctIndex;
    if (correct) {
      const elapsed = p.answeredAt ? (p.answeredAt - game.questionStartTime) : (q.timeLimit * 1000);
      const speedBonus = Math.max(0, Math.floor(500 * (1 - elapsed / (q.timeLimit * 1000))));
      p.score += 1000 + speedBonus;
    } else {
      if (p.hearts > 0) {
        p.hearts--;
        revived.push({ id: p.employeeId, nickname: p.nickname });
      } else {
        p.alive = false;
        p.eliminated = true;
        eliminated.push({ id: p.employeeId, nickname: p.nickname });
      }
    }
    results[p.employeeId] = { correct, answered: p.answered };
  });

  game.revealData = {
    correctIndex,
    correctText: q.choices[correctIndex],
    explanation: q.explanation || '',
    results,
    eliminated,
    revived,
    aliveCount: getAlivePlayers().length,
    players: getPublicPlayers(),
  };

  io.emit('game:reveal', game.revealData);

  // 개인 알림
  eliminated.forEach(({ id }) => {
    const p = game.players[id];
    if (p) io.to(p.socketId).emit('player:eliminated');
  });
  revived.forEach(({ id }) => {
    const p = game.players[id];
    if (p) io.to(p.socketId).emit('player:revived');
  });

  // 자동 진행 제거 — 관리자가 admin:next로 수동 진행
}

function endGame() {
  clearTimers();
  game.status = 'finished';

  const survivors = getAlivePlayers()
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ rank: i + 1, nickname: p.nickname, score: p.score }));

  const allPlayers = Object.values(game.players)
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ rank: i + 1, nickname: p.nickname, score: p.score, alive: p.alive }));

  game.finishedData = { survivors, allPlayers };
  io.emit('game:finished', game.finishedData);
}

function resetGame() {
  clearTimers();
  game.status = 'waiting';
  game.players = {};
  game.socketToEmp = {};
  game.currentIndex = -1;
  game.selectedQuestions = [];
  game.questionStartTime = null;
  game.revealData = null;
  game.finishedData = null;
  io.emit('game:reset');
}

// ─── Socket.io ───────────────────────────────────────────────
io.on('connection', (socket) => {
  // 현재 상태 전송
  socket.emit('game:state', {
    status: game.status,
    currentIndex: game.currentIndex,
    totalQuestions: game.selectedQuestions.length || 20,
    players: getPublicPlayers(),
    stats: getLobbyStats(),
  });

  // ── 참가자 로그인 / 재연결 ──────────────────────────────────
  socket.on('player:join', ({ employeeId, nickname, password }) => {
    // 인증
    const emp = employees.find(e => e.id === employeeId);
    if (employees.length > 0) {
      if (!emp) {
        socket.emit('join:error', { message: '존재하지 않는 사용자입니다.' }); return;
      }
      if (emp.pw !== String(password)) {
        socket.emit('join:error', { message: '비밀번호가 틀렸습니다.' }); return;
      }
    }

    // ── 재연결: 이미 게임에 참여 중인 플레이어 ──
    if (game.players[employeeId]) {
      const p = game.players[employeeId];

      // 이전 소켓 매핑 해제
      delete game.socketToEmp[p.socketId];
      p.socketId = socket.id;
      game.socketToEmp[socket.id] = employeeId;

      socket.emit('join:success', {
        nickname: p.nickname,
        hearts: p.hearts,
        alive: p.alive,
        restored: true,
      });

      // 현재 게임 상태로 복원
      pushCurrentState(socket, p);
      console.log(`[재연결] ${p.nickname}`);
      return;
    }

    // ── 신규 참가 ──
    if (game.status !== 'waiting') {
      socket.emit('join:error', { message: '게임이 이미 시작되었습니다.' }); return;
    }

    const trimmed = (nickname || '').trim().slice(0, 12);
    if (!trimmed) {
      socket.emit('join:error', { message: '닉네임을 입력해주세요.' }); return;
    }
    const dup = Object.values(game.players).find(p => p.nickname === trimmed);
    if (dup) {
      socket.emit('join:error', { message: '이미 사용 중인 닉네임입니다.' }); return;
    }

    game.players[employeeId] = createPlayer(trimmed, socket.id, employeeId);
    game.socketToEmp[socket.id] = employeeId;

    socket.emit('join:success', { nickname: trimmed, hearts: INITIAL_HEARTS, alive: true, restored: false });
    io.emit('lobby:update', { players: getPublicPlayers(), stats: getLobbyStats() });
    console.log(`[참가] ${trimmed} (${emp?.name || employeeId}) — 총 ${Object.keys(game.players).length}명`);
  });

  // ── 답변 제출 ───────────────────────────────────────────────
  socket.on('player:answer', ({ choice }) => {
    const player = getPlayerBySocket(socket.id);
    if (!player || !player.alive || game.status !== 'question') return;
    if (player.answered !== null) return;
    if (typeof choice !== 'number') return;

    player.answered = choice;
    player.answeredAt = Date.now();
    socket.emit('answer:confirmed', { choice });

    const answeredCount = Object.values(game.players).filter(p => p.alive && p.answered !== null).length;
    io.emit('answer:progress', { answered: answeredCount, alive: getAlivePlayers().length });
  });

  // ── 어드민 명령 ─────────────────────────────────────────────
  const ADMIN_PW = process.env.ADMIN_PW || '1fbyep';

  socket.on('admin:start', ({ password }) => {
    if (password !== ADMIN_PW) { socket.emit('admin:error', { message: '비밀번호가 틀렸습니다.' }); return; }
    if (game.status !== 'waiting') { socket.emit('admin:error', { message: '이미 진행 중입니다.' }); return; }
    startGame();
  });

  socket.on('admin:next', ({ password }) => {
    if (password !== ADMIN_PW) return;
    if (game.status === 'question') revealAnswer();
    else if (game.status === 'revealing') {
      clearTimers();
      if (getAlivePlayers().length === 0 || game.currentIndex === game.selectedQuestions.length - 1) endGame();
      else nextQuestion();
    }
  });

  socket.on('admin:reset', ({ password }) => {
    if (password !== ADMIN_PW) return;
    resetGame();
  });

  socket.on('admin:getQuestions', ({ password }) => {
    if (password !== ADMIN_PW) return;
    socket.emit('admin:questions', { questions });
  });

  // ── 직원 관리 ────────────────────────────────────────────────
  socket.on('admin:getEmployees', ({ password }) => {
    if (password !== ADMIN_PW) return;
    socket.emit('admin:employeeList', { employees });
  });

  socket.on('admin:addEmployee', ({ password, employee }) => {
    if (password !== ADMIN_PW) return;
    const name = (employee.name || '').trim();
    const group = (employee.group || '').trim();
    const pw = String(employee.pw || '').trim();
    if (!name) { socket.emit('admin:error', { message: '이름을 입력해주세요.' }); return; }
    if (pw.length !== 4 || !/^\d{4}$/.test(pw)) { socket.emit('admin:error', { message: '비밀번호는 숫자 4자리입니다.' }); return; }
    const id = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    employees.push({ id, name, group, pw });
    socket.emit('admin:employeeList', { employees });
  });

  socket.on('admin:updateEmployee', ({ password, employee }) => {
    if (password !== ADMIN_PW) return;
    const emp = employees.find(e => e.id === employee.id);
    if (!emp) return;
    const pw = String(employee.pw || '').trim();
    if (pw && (pw.length !== 4 || !/^\d{4}$/.test(pw))) { socket.emit('admin:error', { message: '비밀번호는 숫자 4자리입니다.' }); return; }
    emp.name  = (employee.name  || '').trim() || emp.name;
    emp.group = (employee.group || '').trim();
    if (pw) emp.pw = pw;
    socket.emit('admin:employeeList', { employees });
  });

  socket.on('admin:deleteEmployee', ({ password, id }) => {
    if (password !== ADMIN_PW) return;
    const idx = employees.findIndex(e => e.id === id);
    if (idx !== -1) employees.splice(idx, 1);
    socket.emit('admin:employeeList', { employees });
  });

  // ── 연결 해제 ───────────────────────────────────────────────
  socket.on('disconnect', () => {
    const player = getPlayerBySocket(socket.id);
    if (player) {
      if (game.status === 'waiting') {
        delete game.players[player.employeeId];
        io.emit('lobby:update', { players: getPublicPlayers(), stats: getLobbyStats() });
        console.log(`[퇴장] ${player.nickname}`);
      } else {
        console.log(`[임시퇴장] ${player.nickname} — 재연결 대기`);
      }
    }
    delete game.socketToEmp[socket.id];
  });
});

// ─── 직원 목록 내보내기 (어드민 전용) ────────────────────────
app.get('/api/employees/export', (req, res) => {
  const ADMIN_PW = process.env.ADMIN_PW || '1fbyep';
  if (req.query.key !== ADMIN_PW) { res.status(401).json({ error: 'Unauthorized' }); return; }
  res.setHeader('Content-Disposition', 'attachment; filename="employees.json"');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.json(employees);
});

// ─── 문제 목록 미리보기 (관리자 전용) ────────────────────────
app.get('/questions-preview', (req, res) => {
  const ADMIN_PW = process.env.ADMIN_PW || '1fbyep';
  if (req.query.key !== ADMIN_PW) {
    res.status(401).send('<h2>비밀번호가 필요합니다. ?key=비밀번호 를 URL에 추가하세요.</h2>');
    return;
  }
  const DIFF_LABEL = { 1: '⭐ 난이도 1 — 매우 쉬움', 2: '⭐⭐ 난이도 2 — 쉬움', 3: '⭐⭐⭐ 난이도 3 — 보통', 4: '⭐⭐⭐⭐ 난이도 4 — 어려움', 5: '⭐⭐⭐⭐⭐ 난이도 5 — 매우 어려움' };
  const TYPE_LABEL = { multiple: '4지선다', triple: '3지선다', ox: 'O/X' };
  const LABELS = ['A', 'B', 'C', 'D'];

  let rows = '';
  for (let d = 1; d <= 5; d++) {
    const group = questions.filter(q => q.difficulty === d);
    rows += `<tr><td colspan="6" class="diff-header">${DIFF_LABEL[d]} (${group.length}문제)</td></tr>`;
    group.forEach((q, i) => {
      const choicesHtml = q.choices.map((c, ci) => {
        const label = q.type === 'ox' ? c : `${LABELS[ci]}. ${c}`;
        return `<span class="${ci === q.answer ? 'ans' : ''}">${label}</span>`;
      }).join('&nbsp;&nbsp;');
      rows += `<tr>
        <td class="num">${i + 1}</td>
        <td class="type">${TYPE_LABEL[q.type]}</td>
        <td class="qtext">${q.question}</td>
        <td class="choices">${choicesHtml}</td>
        <td class="exp">${q.explanation || ''}</td>
        <td class="tl">${q.timeLimit}초</td>
      </tr>`;
    });
  }

  res.send(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"/>
<title>문제 목록 (총 ${questions.length}문제)</title>
<style>
  body{font-family:'Apple SD Gothic Neo','Noto Sans KR',sans-serif;background:#0f0e17;color:#f1f5f9;margin:0;padding:20px;}
  h1{font-size:22px;margin-bottom:16px;}
  table{width:100%;border-collapse:collapse;font-size:13px;}
  th{background:#1a1928;padding:10px 12px;text-align:left;color:#94a3b8;font-weight:600;border-bottom:2px solid #2d2b50;}
  td{padding:10px 12px;border-bottom:1px solid #1e1d35;vertical-align:top;}
  tr:hover td{background:#1a1928;}
  .diff-header{background:#2d2b50;font-weight:800;font-size:14px;color:#a855f7;padding:14px 12px;}
  .num{width:36px;color:#64748b;text-align:center;}
  .type{width:72px;color:#94a3b8;}
  .qtext{width:28%;font-weight:600;line-height:1.5;}
  .choices{width:32%;line-height:1.8;}
  .exp{color:#93c5fd;line-height:1.55;}
  .tl{width:44px;text-align:center;color:#94a3b8;}
  .ans{color:#10b981;font-weight:800;}
</style></head><body>
<h1>📋 문제 목록 — 총 ${questions.length}문제 (난이도별 20문제)</h1>
<table>
  <thead><tr><th>#</th><th>유형</th><th>문제</th><th>선택지 (초록=정답)</th><th>해설</th><th>제한</th></tr></thead>
  <tbody>${rows}</tbody>
</table></body></html>`);
});

// ─── QR 코드 생성 ────────────────────────────────────────────
app.get('/api/qrcode', async (req, res) => {
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `${req.protocol}://${req.get('host')}`;
  try {
    const dataUrl = await QRCode.toDataURL(baseUrl, { width: 300, margin: 2 });
    res.json({ dataUrl, url: baseUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 헬스체크 ─────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', players: Object.keys(game.players).length }));

// ─── 서버 시작 ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎮 퀴즈 라이브 서버 실행 중`);
  console.log(`   참가자: http://localhost:${PORT}`);
  console.log(`   어드민: http://localhost:${PORT}/admin.html`);
  console.log(`   임직원: ${employees.length}명 로드됨\n`);

  const selfUrl = process.env.RENDER_EXTERNAL_URL;
  if (selfUrl) {
    setInterval(() => {
      fetch(`${selfUrl}/health`)
        .then(() => console.log('[핑] keep-alive 성공'))
        .catch(e => console.log('[핑] 실패:', e.message));
    }, 14 * 60 * 1000);
  }
});
