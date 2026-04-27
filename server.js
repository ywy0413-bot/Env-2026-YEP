const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const questions = require('./questions');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── 게임 상태 ───────────────────────────────────────────────
const INITIAL_HEARTS = 1;

let game = {
  status: 'waiting',      // waiting | countdown | question | revealing | finished
  players: {},            // socketId -> playerData
  currentIndex: -1,
  questionStartTime: null,
  revealData: null,
  countdownTimer: null,
  questionTimer: null,
};

function createPlayer(nickname, socketId) {
  return {
    id: socketId,
    nickname,
    alive: true,
    hearts: INITIAL_HEARTS,
    score: 0,
    answered: null,       // null | choice index
    answeredAt: null,
    eliminated: false,
  };
}

function getPublicPlayers() {
  return Object.values(game.players).map(p => ({
    id: p.id,
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
  if (game.questionTimer) { clearTimeout(game.questionTimer); game.questionTimer = null; }
}

// ─── 게임 로직 ───────────────────────────────────────────────
function startGame() {
  clearTimers();
  game.status = 'countdown';
  game.currentIndex = -1;

  // 모든 플레이어 초기화
  Object.values(game.players).forEach(p => {
    p.alive = true;
    p.hearts = INITIAL_HEARTS;
    p.score = 0;
    p.answered = null;
    p.answeredAt = null;
    p.eliminated = false;
  });

  io.emit('game:start', { totalQuestions: questions.length });

  // 3초 카운트다운 후 첫 문제
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

  if (game.currentIndex >= questions.length) {
    endGame();
    return;
  }

  // 생존자가 없으면 게임 종료
  if (getAlivePlayers().length === 0) {
    endGame();
    return;
  }

  const q = questions[game.currentIndex];
  game.status = 'question';
  game.questionStartTime = Date.now();
  game.revealData = null;

  // 각 플레이어의 답변 초기화
  Object.values(game.players).forEach(p => {
    p.answered = null;
    p.answeredAt = null;
  });

  const questionPayload = {
    index: game.currentIndex,
    total: questions.length,
    type: q.type,
    question: q.question,
    choices: q.choices,
    timeLimit: q.timeLimit,
    aliveCount: getAlivePlayers().length,
  };

  io.emit('game:question', questionPayload);

  // 타이머 종료 후 자동 채점
  game.questionTimer = setTimeout(() => {
    revealAnswer();
  }, q.timeLimit * 1000);
}

function revealAnswer() {
  clearTimers();
  game.status = 'revealing';

  const q = questions[game.currentIndex];
  const correctIndex = q.answer;
  const now = Date.now();

  const results = {};
  const eliminated = [];
  const revived = [];

  Object.values(game.players).forEach(p => {
    if (!p.alive) return;

    const correct = p.answered === correctIndex;

    if (correct) {
      // 빠른 답변 보너스 (최대 500점 + 기본 1000점)
      const elapsed = p.answeredAt ? (p.answeredAt - game.questionStartTime) : (q.timeLimit * 1000);
      const speedBonus = Math.max(0, Math.floor(500 * (1 - elapsed / (q.timeLimit * 1000))));
      p.score += 1000 + speedBonus;
    } else {
      // 오답 처리
      if (p.hearts > 0) {
        p.hearts--;
        revived.push({ id: p.id, nickname: p.nickname });
      } else {
        p.alive = false;
        p.eliminated = true;
        eliminated.push({ id: p.id, nickname: p.nickname });
      }
    }

    results[p.id] = { correct, answered: p.answered };
  });

  const aliveCount = getAlivePlayers().length;

  game.revealData = {
    correctIndex,
    correctText: q.choices[correctIndex],
    results,
    eliminated,
    revived,
    aliveCount,
    isLastQuestion: game.currentIndex === questions.length - 1,
  };

  io.emit('game:reveal', game.revealData);

  // 탈락자에게 개인 알림
  eliminated.forEach(({ id }) => {
    if (io.sockets.sockets.get(id)) {
      io.to(id).emit('player:eliminated');
    }
  });
  revived.forEach(({ id }) => {
    if (io.sockets.sockets.get(id)) {
      io.to(id).emit('player:revived');
    }
  });

  // 5초 후 다음 문제 또는 종료
  setTimeout(() => {
    if (aliveCount === 0 || game.currentIndex === questions.length - 1) {
      endGame();
    } else {
      nextQuestion();
    }
  }, 6000);
}

function endGame() {
  clearTimers();
  game.status = 'finished';

  const survivors = getAlivePlayers()
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ rank: i + 1, nickname: p.nickname, score: p.score, id: p.id }));

  const allPlayers = Object.values(game.players)
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ rank: i + 1, nickname: p.nickname, score: p.score, alive: p.alive }));

  io.emit('game:finished', { survivors, allPlayers });
}

function resetGame() {
  clearTimers();
  game.status = 'waiting';
  game.players = {};
  game.currentIndex = -1;
  game.questionStartTime = null;
  game.revealData = null;
  io.emit('game:reset');
}

// ─── Socket.io 이벤트 ─────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[연결] ${socket.id}`);

  // 어드민 확인
  const isAdmin = socket.handshake.query.role === 'admin';

  // 현재 상태 전송
  socket.emit('game:state', {
    status: game.status,
    currentIndex: game.currentIndex,
    totalQuestions: questions.length,
    players: getPublicPlayers(),
    stats: getLobbyStats(),
  });

  // ── 참가자: 닉네임 등록 ──
  socket.on('player:join', ({ nickname }) => {
    if (game.status !== 'waiting') {
      socket.emit('join:error', { message: '게임이 이미 시작되었습니다.' });
      return;
    }
    if (!nickname || nickname.trim().length === 0) {
      socket.emit('join:error', { message: '닉네임을 입력해주세요.' });
      return;
    }
    const trimmed = nickname.trim().slice(0, 12);
    const duplicate = Object.values(game.players).find(p => p.nickname === trimmed);
    if (duplicate) {
      socket.emit('join:error', { message: '이미 사용 중인 닉네임입니다.' });
      return;
    }

    game.players[socket.id] = createPlayer(trimmed, socket.id);
    socket.emit('join:success', { nickname: trimmed, hearts: INITIAL_HEARTS });
    io.emit('lobby:update', { players: getPublicPlayers(), stats: getLobbyStats() });
    console.log(`[참가] ${trimmed} (총 ${Object.keys(game.players).length}명)`);
  });

  // ── 참가자: 답변 제출 ──
  socket.on('player:answer', ({ choice }) => {
    const player = game.players[socket.id];
    if (!player || !player.alive || game.status !== 'question') return;
    if (player.answered !== null) return; // 이미 답변함
    if (typeof choice !== 'number') return;

    player.answered = choice;
    player.answeredAt = Date.now();

    // 본인에게만 확인 전송
    socket.emit('answer:confirmed', { choice });

    // 어드민에게 답변 현황 업데이트
    const answeredCount = Object.values(game.players).filter(p => p.alive && p.answered !== null).length;
    const aliveCount = getAlivePlayers().length;
    io.emit('answer:progress', { answered: answeredCount, alive: aliveCount });
  });

  // ── 어드민: 게임 시작 ──
  socket.on('admin:start', ({ password }) => {
    if (password !== 'admin1234') {
      socket.emit('admin:error', { message: '비밀번호가 틀렸습니다.' });
      return;
    }
    if (game.status !== 'waiting') {
      socket.emit('admin:error', { message: '게임이 이미 진행 중입니다.' });
      return;
    }
    if (Object.keys(game.players).length === 0) {
      socket.emit('admin:error', { message: '참가자가 없습니다.' });
      return;
    }
    console.log('[어드민] 게임 시작');
    startGame();
  });

  // ── 어드민: 강제 다음 문제 ──
  socket.on('admin:next', ({ password }) => {
    if (password !== 'admin1234') return;
    if (game.status === 'question') {
      revealAnswer();
    } else if (game.status === 'revealing') {
      clearTimers();
      if (getAlivePlayers().length === 0 || game.currentIndex === questions.length - 1) {
        endGame();
      } else {
        nextQuestion();
      }
    }
  });

  // ── 어드민: 게임 리셋 ──
  socket.on('admin:reset', ({ password }) => {
    if (password !== 'admin1234') return;
    console.log('[어드민] 게임 리셋');
    resetGame();
  });

  // ── 어드민: 문제 목록 요청 ──
  socket.on('admin:getQuestions', ({ password }) => {
    if (password !== 'admin1234') return;
    socket.emit('admin:questions', { questions });
  });

  // ── 연결 해제 ──
  socket.on('disconnect', () => {
    const player = game.players[socket.id];
    if (player && game.status === 'waiting') {
      delete game.players[socket.id];
      io.emit('lobby:update', { players: getPublicPlayers(), stats: getLobbyStats() });
      console.log(`[퇴장] ${player.nickname}`);
    }
    console.log(`[해제] ${socket.id}`);
  });
});

// ─── 헬스체크 ─────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', players: Object.keys(game.players).length }));

// ─── 서버 시작 ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎮 퀴즈 라이브 서버 실행 중`);
  console.log(`   참가자: http://localhost:${PORT}`);
  console.log(`   어드민: http://localhost:${PORT}/admin.html`);
  console.log(`   어드민 비밀번호: admin1234\n`);

  // Render free tier sleep 방지: 14분마다 자기 자신에게 핑
  const selfUrl = process.env.RENDER_EXTERNAL_URL;
  if (selfUrl) {
    setInterval(() => {
      fetch(`${selfUrl}/health`)
        .then(() => console.log('[핑] keep-alive 성공'))
        .catch(e => console.log('[핑] keep-alive 실패:', e.message));
    }, 14 * 60 * 1000);
    console.log(`   Keep-alive 핑 활성화: ${selfUrl}/health`);
  }
});
