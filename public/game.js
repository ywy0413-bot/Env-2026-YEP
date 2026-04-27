// ── 연결 ────────────────────────────────────────────
const socket = io();

// ── 상태 ────────────────────────────────────────────
const state = {
  nickname: null,
  alive: true,
  hearts: 1,
  eliminated: false,
  currentChoice: null,
  questionTimeLimit: 15,
  timerInterval: null,
  timerRemaining: 15,
  questionIndex: 0,
  totalQuestions: 12,
};

// ── 화면 전환 헬퍼 ──────────────────────────────────
const screens = {
  lobby: document.getElementById('screen-lobby'),
  countdown: document.getElementById('screen-countdown'),
  question: document.getElementById('screen-question'),
  reveal: document.getElementById('screen-reveal'),
  eliminated: document.getElementById('screen-eliminated'),
  finished: document.getElementById('screen-finished'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  if (screens[name]) screens[name].classList.add('active');
}

// ── DOM 참조 ─────────────────────────────────────────
const $nicknameInput = document.getElementById('nickname-input');
const $joinBtn = document.getElementById('join-btn');
const $joinError = document.getElementById('join-error');
const $lobbyInfo = document.getElementById('lobby-info');
const $joinForm = document.querySelector('.join-form');
const $playerCountDisplay = document.getElementById('player-count-display');
const $myHeartsLobby = document.getElementById('my-hearts');

const $countdownNum = document.getElementById('countdown-number');

const $qIndex = document.getElementById('q-index');
const $qTotal = document.getElementById('q-total');
const $qAlive = document.getElementById('q-alive');
const $qHeartsQ = document.getElementById('my-hearts-q');
const $timerText = document.getElementById('timer-text');
const $timerArc = document.getElementById('timer-arc');
const $questionText = document.getElementById('question-text');
const $choicesWrap = document.getElementById('choices-wrap');
const $answeredOverlay = document.getElementById('answered-overlay');
const $answeredLabel = document.getElementById('answered-label');

const $revealIcon = document.getElementById('reveal-result-icon');
const $revealText = document.getElementById('reveal-result-text');
const $revealCorrect = document.getElementById('reveal-correct');
const $revealStats = document.getElementById('reveal-stats');
const $revealHeartMsg = document.getElementById('reveal-heart-msg');

const $epBar = document.getElementById('ep-bar');
const $finishWinners = document.getElementById('finish-winners');
const $finishMyResult = document.getElementById('finish-my-result');

// ── 하트 표시 헬퍼 ─────────────────────────────────
function heartsStr(n) {
  return n > 0 ? '❤️'.repeat(n) : '🖤';
}

function updateHeartsDisplay() {
  $myHeartsLobby.textContent = heartsStr(state.hearts);
  $qHeartsQ.textContent = heartsStr(state.hearts);
}

// ── 로비: 참가 ─────────────────────────────────────
$joinBtn.addEventListener('click', joinGame);
$nicknameInput.addEventListener('keydown', e => { if (e.key === 'Enter') joinGame(); });

function joinGame() {
  const nick = $nicknameInput.value.trim();
  if (!nick) { $joinError.textContent = '닉네임을 입력해주세요.'; return; }
  $joinError.textContent = '';
  socket.emit('player:join', { nickname: nick });
}

socket.on('join:success', ({ nickname, hearts }) => {
  state.nickname = nickname;
  state.hearts = hearts;
  $joinForm.classList.add('hidden');
  $lobbyInfo.classList.remove('hidden');
  updateHeartsDisplay();
});

socket.on('join:error', ({ message }) => {
  $joinError.textContent = message;
});

socket.on('lobby:update', ({ players, stats }) => {
  $playerCountDisplay.textContent = `${stats.total}명 참가 중`;
});

// ── 게임 시작 카운트다운 ────────────────────────────
socket.on('game:start', ({ totalQuestions }) => {
  state.totalQuestions = totalQuestions;
  state.alive = true;
  state.eliminated = false;
  $qTotal.textContent = totalQuestions;
  showScreen('countdown');
});

socket.on('game:countdown', ({ count }) => {
  $countdownNum.textContent = count;
  $countdownNum.style.animation = 'none';
  void $countdownNum.offsetWidth;
  $countdownNum.style.animation = '';
});

// ── 문제 표시 ───────────────────────────────────────
socket.on('game:question', ({ index, total, type, question, choices, timeLimit, aliveCount }) => {
  if (state.eliminated) {
    // 탈락자는 진행 상황 바 업데이트
    const pct = ((index) / total) * 100;
    $epBar.style.width = pct + '%';
    return;
  }

  state.currentChoice = null;
  state.questionTimeLimit = timeLimit;
  state.questionIndex = index;
  state.totalQuestions = total;

  $qIndex.textContent = index + 1;
  $qTotal.textContent = total;
  $qAlive.textContent = aliveCount;
  $questionText.textContent = question;
  updateHeartsDisplay();

  // 선택지 생성
  $choicesWrap.innerHTML = '';
  $answeredOverlay.classList.add('hidden');

  const LABELS = ['A', 'B', 'C', 'D'];
  choices.forEach((text, i) => {
    const btn = document.createElement('button');
    if (type === 'ox') {
      btn.className = `choice-btn choice-ox-${i}`;
      btn.innerHTML = `<span class="choice-text">${text}</span>`;
    } else {
      btn.className = `choice-btn choice-${i}`;
      btn.innerHTML = `<span class="choice-label">${LABELS[i]}</span><span class="choice-text">${text}</span>`;
    }
    btn.addEventListener('click', () => submitAnswer(i, text));
    $choicesWrap.appendChild(btn);
  });

  startTimer(timeLimit);
  showScreen('question');
});

function submitAnswer(index, text) {
  if (state.currentChoice !== null) return;
  state.currentChoice = index;

  socket.emit('player:answer', { choice: index });

  // 선택 표시
  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === index) btn.classList.add('selected');
  });

  // 답변 완료 오버레이
  $answeredLabel.textContent = `선택: ${text}`;
  $answeredOverlay.classList.remove('hidden');
}

// ── 타이머 ─────────────────────────────────────────
const CIRC = 213.6; // 2 * π * 34
function startTimer(seconds) {
  clearInterval(state.timerInterval);
  state.timerRemaining = seconds;
  $timerText.textContent = seconds;
  $timerArc.style.strokeDashoffset = 0;
  $timerArc.classList.remove('urgent');

  state.timerInterval = setInterval(() => {
    state.timerRemaining--;
    const pct = state.timerRemaining / seconds;
    $timerArc.style.strokeDashoffset = CIRC * (1 - pct);
    $timerText.textContent = state.timerRemaining;
    if (state.timerRemaining <= 5) $timerArc.classList.add('urgent');
    if (state.timerRemaining <= 0) clearInterval(state.timerInterval);
  }, 1000);
}

// ── 정답 공개 ───────────────────────────────────────
socket.on('game:reveal', ({ correctIndex, correctText, results, eliminated, revived, aliveCount }) => {
  if (state.eliminated) return;

  clearInterval(state.timerInterval);

  const myResult = results[socket.id];
  const isCorrect = myResult?.correct;

  $revealCorrect.textContent = `정답: ${correctText}`;
  $revealStats.textContent = `생존자 ${aliveCount}명`;
  $revealHeartMsg.classList.add('hidden');

  if (isCorrect || myResult === undefined) {
    $revealIcon.textContent = '✅';
    $revealText.textContent = '정답!';
    $revealText.className = 'reveal-result-text correct';
  } else {
    $revealIcon.textContent = '❌';
    $revealText.textContent = '오답!';
    $revealText.className = 'reveal-result-text wrong';
  }

  showScreen('reveal');
});

socket.on('player:eliminated', () => {
  state.alive = false;
  state.eliminated = true;
  state.hearts = 0;

  setTimeout(() => {
    showScreen('eliminated');
    $epBar.style.width = ((state.questionIndex + 1) / state.totalQuestions * 100) + '%';
  }, 2500);
});

socket.on('player:revived', () => {
  state.hearts = 0;
  $revealHeartMsg.textContent = '❤️ 생명 하트를 사용했습니다! 계속 도전하세요!';
  $revealHeartMsg.classList.remove('hidden');
  updateHeartsDisplay();
});

// ── 게임 종료 ───────────────────────────────────────
socket.on('game:finished', ({ survivors, allPlayers }) => {
  clearInterval(state.timerInterval);

  // 순위 목록 렌더링
  $finishWinners.innerHTML = '';
  const rankEmoji = ['🥇', '🥈', '🥉'];
  survivors.slice(0, 3).forEach((p, i) => {
    const div = document.createElement('div');
    div.className = `winner-item rank-${i + 1}`;
    div.innerHTML = `
      <span class="winner-rank">${rankEmoji[i] || (i + 1)}</span>
      <span class="winner-nick">${escHtml(p.nickname)}</span>
      <span class="winner-score">${p.score.toLocaleString()}점</span>
    `;
    $finishWinners.appendChild(div);
  });

  if (survivors.length === 0) {
    $finishWinners.innerHTML = '<p style="color:var(--muted)">이번 라운드 생존자가 없습니다</p>';
  }

  // 내 결과
  const myRecord = allPlayers.find(p => p.nickname === state.nickname);
  if (myRecord) {
    if (myRecord.alive) {
      $finishMyResult.textContent = `🎉 생존! ${myRecord.score.toLocaleString()}점`;
      $finishMyResult.style.color = 'var(--green)';
    } else {
      $finishMyResult.textContent = `아쉽게도 탈락했습니다. ${myRecord.score.toLocaleString()}점`;
    }
  }

  showScreen('finished');
});

// ── 게임 리셋 ───────────────────────────────────────
socket.on('game:reset', () => {
  state.nickname = null;
  state.alive = true;
  state.eliminated = false;
  state.hearts = 1;
  state.currentChoice = null;
  clearInterval(state.timerInterval);

  $joinForm.classList.remove('hidden');
  $lobbyInfo.classList.add('hidden');
  $nicknameInput.value = '';
  $joinError.textContent = '';

  showScreen('lobby');
});

document.getElementById('finish-replay-btn').addEventListener('click', () => {
  showScreen('lobby');
});

// ── 재연결 시 상태 복원 ─────────────────────────────
socket.on('game:state', ({ status }) => {
  if (status === 'waiting' && !state.nickname) {
    showScreen('lobby');
  }
});

// ── XSS 방지 ────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
