// ── 비밀번호 ─────────────────────────────────────
let adminPassword = '';
let questionsList = [];
let currentQuestionData = null;
let adminTimerInterval = null;
let adminTimerRemaining = 0;

const socket = io({ query: { role: 'admin' } });

// ── 로그인 ──────────────────────────────────────
document.getElementById('pw-btn').addEventListener('click', tryLogin);
document.getElementById('pw-input').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

function tryLogin() {
  const pw = document.getElementById('pw-input').value;
  if (!pw) return;
  adminPassword = pw;

  // 서버에 테스트 요청을 보내 비밀번호 확인
  socket.emit('admin:getQuestions', { password: pw });
}

socket.on('admin:questions', ({ questions }) => {
  questionsList = questions;
  document.getElementById('admin-login').classList.add('hidden');
  document.getElementById('admin-main').classList.remove('hidden');
  document.getElementById('join-url').textContent = window.location.origin;
  document.getElementById('pw-error').textContent = '';
});

socket.on('admin:error', ({ message }) => {
  document.getElementById('pw-error').textContent = message;
});

// ── 패널 전환 ────────────────────────────────────
function showPanel(name) {
  document.querySelectorAll('.main-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`main-${name}`);
  if (panel) panel.classList.add('active');
}

// ── 상태 업데이트 ────────────────────────────────
function updateStatusPill(status) {
  const pill = document.getElementById('game-status-pill');
  const labels = { waiting: '대기 중', countdown: '카운트다운', question: '문제 진행 중', revealing: '정답 공개', finished: '게임 종료' };
  pill.textContent = labels[status] || status;
  pill.className = `status-pill ${status}`;
}

function updateStats(stats) {
  document.getElementById('stat-total').textContent = stats.total ?? 0;
  document.getElementById('stat-alive').textContent = stats.alive ?? 0;
  document.getElementById('stat-dead').textContent = stats.eliminated ?? 0;
}

function renderPlayerList(players) {
  const list = document.getElementById('player-list');
  list.innerHTML = '';
  players.sort((a, b) => b.score - a.score).forEach(p => {
    const div = document.createElement('div');
    div.className = `player-item ${p.alive ? '' : 'dead'}`;
    div.innerHTML = `
      <span class="pi-nick">${escHtml(p.nickname)}</span>
      <span class="pi-hearts">${'❤️'.repeat(p.hearts)}${'🖤'.repeat(1 - p.hearts)}</span>
      <span class="pi-score">${p.score > 0 ? p.score.toLocaleString() + 'p' : ''}</span>
    `;
    list.appendChild(div);
  });
}

// ── 컨트롤 버튼 ─────────────────────────────────
document.getElementById('btn-start').addEventListener('click', () => {
  if (!confirm('게임을 시작하시겠습니까?')) return;
  socket.emit('admin:start', { password: adminPassword });
});

document.getElementById('btn-next').addEventListener('click', () => {
  socket.emit('admin:next', { password: adminPassword });
});

document.getElementById('btn-reset').addEventListener('click', () => {
  if (!confirm('게임을 리셋하시겠습니까? 모든 참가자 데이터가 초기화됩니다.')) return;
  socket.emit('admin:reset', { password: adminPassword });
});

// ── 소켓 이벤트 ─────────────────────────────────
socket.on('game:state', ({ status, players, stats, currentIndex, totalQuestions }) => {
  updateStatusPill(status);
  updateStats(stats || { total: players?.length || 0, alive: 0, eliminated: 0 });
  if (players) renderPlayerList(players);
  document.getElementById('waiting-count').textContent = `${(players || []).length}명 대기 중`;

  if (status === 'waiting') {
    showPanel('waiting');
    document.getElementById('btn-start').classList.remove('hidden');
    document.getElementById('btn-next').classList.add('hidden');
  }
});

socket.on('lobby:update', ({ players, stats }) => {
  updateStats(stats);
  renderPlayerList(players);
  document.getElementById('waiting-count').textContent = `${stats.total}명 대기 중`;
  document.getElementById('stat-total').textContent = stats.total;
});

socket.on('game:start', ({ totalQuestions }) => {
  updateStatusPill('countdown');
  document.getElementById('btn-start').classList.add('hidden');
  document.getElementById('btn-next').classList.remove('hidden');
  showPanel('waiting');
});

socket.on('game:countdown', ({ count }) => {
  updateStatusPill('countdown');
});

socket.on('game:question', ({ index, total, type, question, choices, timeLimit, aliveCount }) => {
  updateStatusPill('question');
  currentQuestionData = { index, total, type, question, choices, timeLimit };

  document.getElementById('admin-q-num').textContent = `문제 ${index + 1} / ${total}`;
  document.getElementById('admin-progress-bar').style.width = `${((index + 1) / total) * 100}%`;
  document.getElementById('admin-question-text').textContent = question;

  // 선택지 렌더링
  const LABELS = ['A', 'B', 'C', 'D'];
  const choicesEl = document.getElementById('admin-choices');
  choicesEl.innerHTML = '';

  if (type === 'ox') {
    choicesEl.style.gridTemplateColumns = '1fr 1fr';
    choices.forEach((text, i) => {
      const div = document.createElement('div');
      div.className = `admin-choice ac-ox-${i}`;
      div.textContent = text;
      div.id = `ac-${i}`;
      choicesEl.appendChild(div);
    });
  } else {
    choicesEl.style.gridTemplateColumns = choices.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr';
    choices.forEach((text, i) => {
      const div = document.createElement('div');
      div.className = `admin-choice ac-${i}`;
      div.innerHTML = `<span class="ac-label">${LABELS[i]}</span>${escHtml(text)}`;
      div.id = `ac-${i}`;
      choicesEl.appendChild(div);
    });
  }

  // 답변 진행률 초기화
  document.getElementById('ap-bar').style.width = '0%';
  document.getElementById('ap-count').textContent = `0 / ${aliveCount}명 답변`;
  document.getElementById('stat-answered').textContent = `0/${aliveCount}`;

  // 타이머
  clearInterval(adminTimerInterval);
  adminTimerRemaining = timeLimit;
  document.getElementById('admin-timer-num').textContent = timeLimit;
  adminTimerInterval = setInterval(() => {
    adminTimerRemaining--;
    document.getElementById('admin-timer-num').textContent = adminTimerRemaining;
    if (adminTimerRemaining <= 0) clearInterval(adminTimerInterval);
  }, 1000);

  showPanel('question');
});

socket.on('answer:progress', ({ answered, alive }) => {
  const pct = alive > 0 ? (answered / alive) * 100 : 0;
  document.getElementById('ap-bar').style.width = pct + '%';
  document.getElementById('ap-count').textContent = `${answered} / ${alive}명 답변`;
  document.getElementById('stat-answered').textContent = `${answered}/${alive}`;
});

socket.on('game:reveal', ({ correctIndex, correctText, results, eliminated, revived, aliveCount }) => {
  clearInterval(adminTimerInterval);
  updateStatusPill('revealing');

  if (!currentQuestionData) return;
  const { question, choices, type } = currentQuestionData;

  document.getElementById('reveal-question-echo').textContent = question;
  document.getElementById('reveal-answer-text').textContent = correctText;

  // 선택지에 정답 표시
  const LABELS = ['A', 'B', 'C', 'D'];
  const grid = document.getElementById('reveal-choice-grid');
  grid.innerHTML = '';
  const cols = type === 'ox' ? '1fr 1fr' : (choices.length === 3 ? '1fr 1fr 1fr' : '1fr 1fr');
  grid.style.gridTemplateColumns = cols;

  choices.forEach((text, i) => {
    const div = document.createElement('div');
    const isCorrect = i === correctIndex;
    div.className = `rca ${isCorrect ? 'is-correct' : 'is-wrong'}`;
    div.innerHTML = `<span class="rca-label">${type === 'ox' ? text : LABELS[i]}</span>${escHtml(text)}`;
    grid.appendChild(div);
  });

  document.getElementById('rs-alive').textContent = aliveCount;
  document.getElementById('rs-elim').textContent = eliminated.length;
  document.getElementById('rs-revived').textContent = revived.length;

  // 참가자 목록 갱신 (탈락 처리)
  document.getElementById('stat-alive').textContent = aliveCount;

  showPanel('reveal');
});

socket.on('game:finished', ({ survivors, allPlayers }) => {
  clearInterval(adminTimerInterval);
  updateStatusPill('finished');
  document.getElementById('btn-next').classList.add('hidden');

  const container = document.getElementById('admin-survivors');
  container.innerHTML = '';
  const RANK_EMOJI = ['🥇', '🥈', '🥉'];

  survivors.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = `surv-item rank-${i + 1}`;
    div.innerHTML = `
      <span class="surv-rank">${RANK_EMOJI[i] || (i + 1)}</span>
      <span class="surv-nick">${escHtml(p.nickname)}</span>
      <span class="surv-score">${p.score.toLocaleString()}점</span>
    `;
    container.appendChild(div);
  });

  if (survivors.length === 0) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center">이번 라운드 생존자가 없습니다.</p>';
  }

  showPanel('finished');
});

socket.on('game:reset', () => {
  updateStatusPill('waiting');
  document.getElementById('btn-start').classList.remove('hidden');
  document.getElementById('btn-next').classList.add('hidden');
  document.getElementById('stat-total').textContent = '0';
  document.getElementById('stat-alive').textContent = '0';
  document.getElementById('stat-dead').textContent = '0';
  document.getElementById('stat-answered').textContent = '-';
  document.getElementById('player-list').innerHTML = '';
  document.getElementById('waiting-count').textContent = '0명 대기 중';
  clearInterval(adminTimerInterval);
  showPanel('waiting');
});

// ── XSS 방지 ─────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
