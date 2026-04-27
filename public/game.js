// ── 연결 ────────────────────────────────────────────
const socket = io();

// ── 상태 ────────────────────────────────────────────
const state = {
  employeeId: null,
  nickname: null,
  pw: null,
  alive: true,
  hearts: 1,
  eliminated: false,
  currentChoice: null,
  questionTimeLimit: 15,
  timerInterval: null,
  timerRemaining: 15,
  questionIndex: 0,
  totalQuestions: 22,
};

// ── 화면 전환 ────────────────────────────────────────
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
const $empSelect     = document.getElementById('employee-select');
const $nicknameInput = document.getElementById('nickname-input');
const $pwInput       = document.getElementById('pw-input');
const $joinBtn       = document.getElementById('join-btn');
const $joinError     = document.getElementById('join-error');
const $joinForm      = document.getElementById('join-form');
const $lobbyInfo     = document.getElementById('lobby-info');
const $myNameDisplay = document.getElementById('my-name-display');
const $playerCount   = document.getElementById('player-count-display');
const $myHeartsLobby = document.getElementById('my-hearts');
const $countdownNum  = document.getElementById('countdown-number');
const $qIndex        = document.getElementById('q-index');
const $qTotal        = document.getElementById('q-total');
const $qAlive        = document.getElementById('q-alive');
const $qHeartsQ      = document.getElementById('my-hearts-q');
const $timerText     = document.getElementById('timer-text');
const $timerArc      = document.getElementById('timer-arc');
const $questionText  = document.getElementById('question-text');
const $choicesWrap   = document.getElementById('choices-wrap');
const $answeredOverlay = document.getElementById('answered-overlay');
const $answeredLabel = document.getElementById('answered-label');
const $revealIcon    = document.getElementById('reveal-result-icon');
const $revealText    = document.getElementById('reveal-result-text');
const $revealCorrect = document.getElementById('reveal-correct');
const $revealStats   = document.getElementById('reveal-stats');
const $revealHeartMsg = document.getElementById('reveal-heart-msg');
const $epBar         = document.getElementById('ep-bar');
const $finishWinners = document.getElementById('finish-winners');
const $finishMyResult = document.getElementById('finish-my-result');

// ── 임직원 목록 로드 ─────────────────────────────────
async function loadEmployees() {
  try {
    const res = await fetch('/api/employees');
    const list = await res.json();
    list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    list.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      opt.textContent = e.name;
      $empSelect.appendChild(opt);
    });
  } catch (e) {
    console.error('임직원 목록 로드 실패:', e);
  }
}

loadEmployees();

// ── 자동 재연결 (localStorage) ───────────────────────
function saveCredentials() {
  localStorage.setItem('quiz_cred', JSON.stringify({
    employeeId: state.employeeId,
    nickname: state.nickname,
    pw: state.pw,
  }));
}

function clearCredentials() {
  localStorage.removeItem('quiz_cred');
}

function tryAutoReconnect() {
  try {
    const saved = JSON.parse(localStorage.getItem('quiz_cred') || 'null');
    if (saved && saved.employeeId && saved.nickname && saved.pw) {
      state.employeeId = saved.employeeId;
      state.nickname   = saved.nickname;
      state.pw         = saved.pw;
      socket.emit('player:join', {
        employeeId: saved.employeeId,
        nickname:   saved.nickname,
        password:   saved.pw,
      });
      return true;
    }
  } catch { /* 무시 */ }
  return false;
}

// ── 하트 표시 ────────────────────────────────────────
function heartsStr(n) {
  return (n > 0 ? '❤️'.repeat(n) : '') + (n < 1 ? '🖤' : '');
}
function updateHeartsDisplay() {
  $myHeartsLobby.textContent = heartsStr(state.hearts);
  $qHeartsQ.textContent = heartsStr(state.hearts);
}

// ── 로그인 ───────────────────────────────────────────
$joinBtn.addEventListener('click', joinGame);
$pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') joinGame(); });

function joinGame() {
  const empId   = Number($empSelect.value);
  const nickname = $nicknameInput.value.trim();
  const pw      = $pwInput.value.trim();

  if (!empId)    { $joinError.textContent = '참가자를 선택해주세요.'; return; }
  if (!nickname) { $joinError.textContent = '닉네임을 입력해주세요.'; return; }
  if (pw.length !== 4) { $joinError.textContent = '비밀번호는 4자리 숫자입니다.'; return; }

  $joinError.textContent = '';
  state.employeeId = empId;
  state.nickname   = nickname;
  state.pw         = pw;

  socket.emit('player:join', { employeeId: empId, nickname, password: pw });
}

// ── 참가 성공 ────────────────────────────────────────
socket.on('join:success', ({ nickname, hearts, alive, restored }) => {
  state.nickname = nickname;
  state.hearts   = hearts;
  state.alive    = alive;

  saveCredentials();
  updateHeartsDisplay();
  $myNameDisplay.textContent = `👤 ${nickname}`;

  if (restored) {
    // 재연결: 화면은 서버에서 오는 다음 이벤트가 결정
    return;
  }

  // 신규: 대기 화면
  $joinForm.classList.add('hidden');
  $lobbyInfo.classList.remove('hidden');
  showScreen('lobby');
});

socket.on('join:error', ({ message }) => {
  $joinError.textContent = message;
});

socket.on('lobby:update', ({ players, stats }) => {
  $playerCount.textContent = `${stats.total}명 참가 중`;
});

// ── 게임 시작 ─────────────────────────────────────────
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

// ── 문제 수신 ────────────────────────────────────────
socket.on('game:question', ({ index, total, type, question, choices, timeLimit, aliveCount, elapsed }) => {
  state.totalQuestions = total;
  state.questionIndex  = index;
  state.questionTimeLimit = timeLimit;
  state.currentChoice  = null;

  const isSpectator = state.eliminated;
  document.getElementById('spectator-banner').classList.toggle('hidden', !isSpectator);

  $qIndex.textContent = index + 1;
  $qTotal.textContent = total;
  $qAlive.textContent = aliveCount;
  $questionText.textContent = question;
  updateHeartsDisplay();

  $choicesWrap.innerHTML = '';
  $answeredOverlay.classList.add('hidden');

  const LABELS = ['A', 'B', 'C', 'D'];
  choices.forEach((text, i) => {
    const btn = document.createElement('button');
    if (type === 'ox') {
      btn.className = `choice-btn choice-ox-${i}${isSpectator ? ' disabled' : ''}`;
      btn.innerHTML = `<span class="choice-text">${escHtml(text)}</span>`;
    } else {
      btn.className = `choice-btn choice-${i}${isSpectator ? ' disabled' : ''}`;
      btn.innerHTML = `<span class="choice-label">${LABELS[i]}</span><span class="choice-text">${escHtml(text)}</span>`;
    }
    if (!isSpectator) btn.addEventListener('click', () => submitAnswer(i, text));
    $choicesWrap.appendChild(btn);
  });

  const remaining = Math.max(0, timeLimit - (elapsed || 0));
  startTimer(timeLimit, remaining);
  showScreen('question');
});

function submitAnswer(index, text) {
  if (state.currentChoice !== null) return;
  state.currentChoice = index;
  socket.emit('player:answer', { choice: index });

  document.querySelectorAll('.choice-btn').forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === index) btn.classList.add('selected');
  });

  $answeredLabel.textContent = `선택: ${text}`;
  $answeredOverlay.classList.remove('hidden');
}

// 재연결 후 이미 답변한 경우
socket.on('answer:confirmed', ({ choice }) => {
  if (state.currentChoice !== null) return; // 이미 처리됨
  state.currentChoice = choice;
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === choice) btn.classList.add('selected');
  });
  if (btns[choice]) {
    $answeredLabel.textContent = `선택: ${btns[choice].querySelector('.choice-text')?.textContent || ''}`;
  }
  $answeredOverlay.classList.remove('hidden');
});

// ── 타이머 ───────────────────────────────────────────
const CIRC = 213.6;
function startTimer(total, remaining) {
  clearInterval(state.timerInterval);
  state.timerRemaining = remaining;
  $timerText.textContent = remaining;
  $timerArc.style.strokeDashoffset = CIRC * (1 - remaining / total);
  $timerArc.classList.remove('urgent');

  state.timerInterval = setInterval(() => {
    state.timerRemaining--;
    const pct = state.timerRemaining / total;
    $timerArc.style.strokeDashoffset = CIRC * (1 - pct);
    $timerText.textContent = state.timerRemaining;
    if (state.timerRemaining <= 5) $timerArc.classList.add('urgent');
    if (state.timerRemaining <= 0) clearInterval(state.timerInterval);
  }, 1000);
}

// ── 정답 공개 ────────────────────────────────────────
socket.on('game:reveal', ({ correctIndex, correctText, explanation, results, eliminated, revived, aliveCount }) => {
  clearInterval(state.timerInterval);

  const myResult = results[state.employeeId];
  const isCorrect = myResult?.correct;

  $revealCorrect.textContent = `정답: ${correctText}`;
  $revealStats.textContent = `생존자 ${aliveCount}명`;
  const $revealExp = document.getElementById('reveal-explanation');
  if (explanation) { $revealExp.textContent = explanation; $revealExp.classList.remove('hidden'); }
  else { $revealExp.classList.add('hidden'); }
  $revealHeartMsg.classList.add('hidden');

  if (state.eliminated) {
    $revealIcon.textContent = '👁';
    $revealText.textContent = '관람 중';
    $revealText.className = 'reveal-result-text spectator';
  } else if (isCorrect) {
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
  updateHeartsDisplay();

  // 잠시 탈락 화면을 보여준 뒤 관람 모드(정답 공개 화면)로 전환
  showScreen('eliminated');
  setTimeout(() => {
    $revealIcon.textContent = '👁';
    $revealText.textContent = '관람 중';
    $revealText.className = 'reveal-result-text spectator';
    showScreen('reveal');
  }, 2500);
});

socket.on('player:revived', () => {
  state.hearts = 0;
  updateHeartsDisplay();
  $revealHeartMsg.textContent = '❤️ 생명 하트를 사용했습니다! 계속 도전하세요!';
  $revealHeartMsg.classList.remove('hidden');
});

// ── 최종 결과 ────────────────────────────────────────
socket.on('game:finished', ({ survivors, allPlayers }) => {
  clearInterval(state.timerInterval);

  $finishWinners.innerHTML = '';
  const RANK_EMOJI = ['🥇', '🥈', '🥉'];
  survivors.slice(0, 3).forEach((p, i) => {
    const div = document.createElement('div');
    div.className = `winner-item rank-${i + 1}`;
    div.innerHTML = `
      <span class="winner-rank">${RANK_EMOJI[i] || (i + 1)}</span>
      <span class="winner-nick">${escHtml(p.nickname)}</span>
      <span class="winner-score">${p.score.toLocaleString()}점</span>
    `;
    $finishWinners.appendChild(div);
  });

  if (survivors.length === 0) {
    $finishWinners.innerHTML = '<p style="color:var(--muted)">이번 라운드 생존자가 없습니다</p>';
  }

  const myRecord = allPlayers.find(p => p.nickname === state.nickname);
  if (myRecord) {
    $finishMyResult.textContent = myRecord.alive
      ? `🎉 생존! ${myRecord.score.toLocaleString()}점`
      : `아쉽게도 탈락했습니다. ${myRecord.score.toLocaleString()}점`;
    $finishMyResult.style.color = myRecord.alive ? 'var(--green)' : 'var(--muted)';
  }

  showScreen('finished');
});

// ── 게임 리셋 ────────────────────────────────────────
socket.on('game:reset', () => {
  clearInterval(state.timerInterval);
  Object.assign(state, {
    employeeId: null, nickname: null, pw: null,
    alive: true, hearts: 1, eliminated: false,
    currentChoice: null,
  });
  clearCredentials();

  $joinForm.classList.remove('hidden');
  $lobbyInfo.classList.add('hidden');
  $joinError.textContent = '';
  $pwInput.value = '';
  $nicknameInput.value = '';
  $empSelect.value = '';
  showScreen('lobby');
});

document.getElementById('finish-replay-btn').addEventListener('click', () => {
  clearCredentials();
  showScreen('lobby');
});

// ── 초기 상태 수신 후 자동 재연결 시도 ──────────────
socket.on('game:state', ({ status }) => {
  if (!tryAutoReconnect() && status === 'waiting') {
    showScreen('lobby');
  }
});

// ── XSS 방지 ─────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/[&<>"']/g, m =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])
  );
}
