// ── 비밀번호 ─────────────────────────────────────
let adminPassword = '';
let questionsList = [];
let currentQuestionData = null;
let adminTimerInterval = null;
let adminTimerRemaining = 0;
let cachedPlayers = [];      // 가장 최근 플레이어 상태 (reveal 포함)
let pendingRevealData = {};  // reveal 후 공개 대기 중인 통계

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
  document.getElementById('pw-error').textContent = '';
  // QR 코드 로드
  fetch('/api/qrcode')
    .then(r => r.json())
    .then(({ dataUrl, url }) => {
      document.getElementById('qr-img').src = dataUrl;
      document.getElementById('join-url').textContent = url;
    })
    .catch(() => {
      document.getElementById('join-url').textContent = window.location.origin;
    });
  // 직원 목록도 함께 로드
  socket.emit('admin:getEmployees', { password: adminPassword });
});

socket.on('admin:error', ({ message }) => {
  const pwErr = document.getElementById('pw-error');
  const empErr = document.getElementById('emp-form-error');
  const editErr = document.getElementById('edit-error');
  // 어느 에러 박스를 쓸지 현재 상태로 판단
  if (!document.getElementById('admin-login').classList.contains('hidden')) {
    pwErr.textContent = message;
  } else if (!document.getElementById('edit-modal').classList.contains('hidden')) {
    editErr.textContent = message;
  } else {
    empErr.textContent = message;
    setTimeout(() => { empErr.textContent = ''; }, 3000);
  }
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
  if (players) { cachedPlayers = players; renderPlayerList(players); }
  document.getElementById('waiting-count').textContent = `${(players || []).length}명 대기 중`;

  if (status === 'waiting') {
    showPanel('waiting');
    document.getElementById('btn-start').classList.remove('hidden');
    document.getElementById('btn-next').classList.add('hidden');
  }
});

socket.on('lobby:update', ({ players, stats }) => {
  cachedPlayers = players;
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

socket.on('game:reveal', ({ correctIndex, correctText, explanation, results, eliminated, revived, aliveCount, players }) => {
  clearInterval(adminTimerInterval);
  updateStatusPill('revealing');

  // 플레이어 캐시 갱신 (하트/생존 상태 반영) — 사이드바는 버튼 클릭 시 공개
  if (players) cachedPlayers = players;
  pendingRevealData = { aliveCount, eliminated: eliminated.length, revived: revived.length };

  if (!currentQuestionData) return;
  const { question, choices, type } = currentQuestionData;

  document.getElementById('reveal-question-echo').textContent = question;
  document.getElementById('reveal-answer-text').textContent = correctText;

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

  document.getElementById('reveal-explanation').textContent = explanation || '';

  // 생존 현황은 버튼 클릭 시 공개 (사이드바와 분리)
  document.getElementById('reveal-summary').classList.add('hidden');
  document.getElementById('btn-reveal-stats').classList.remove('hidden');

  showPanel('reveal');
});

socket.on('game:finished', ({ survivors, allPlayers }) => {
  clearInterval(adminTimerInterval);
  updateStatusPill('finished');
  document.getElementById('btn-next').classList.add('hidden');

  // 생존자 모달 목록 구성
  const RANK_EMOJI = ['🥇', '🥈', '🥉'];
  const survContainer = document.getElementById('modal-survivors');
  survContainer.innerHTML = '';

  if (survivors.length === 0) {
    survContainer.innerHTML = '<p class="modal-empty">이번 라운드 생존자가 없습니다.</p>';
  } else {
    survivors.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = `modal-player-item rank-${i + 1}`;
      div.innerHTML = `
        <span class="mpi-rank">${RANK_EMOJI[i] || (i + 1)}</span>
        <span class="mpi-nick">${escHtml(p.nickname)}</span>
        <span class="mpi-score">${p.score.toLocaleString()}점</span>
      `;
      survContainer.appendChild(div);
    });
  }

  // 탈락자 목록 구성
  const elimContainer = document.getElementById('modal-eliminated');
  elimContainer.innerHTML = '';
  const eliminated = (allPlayers || []).filter(p => !p.alive);

  if (eliminated.length === 0) {
    elimContainer.innerHTML = '<p class="modal-empty">탈락자가 없습니다.</p>';
  } else {
    eliminated.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'modal-player-item elim';
      div.innerHTML = `
        <span class="mpi-rank">${i + 1}</span>
        <span class="mpi-nick">${escHtml(p.nickname)}</span>
        <span class="mpi-score">${p.score.toLocaleString()}점</span>
      `;
      elimContainer.appendChild(div);
    });
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

// ══════════════════════════════════════════════════
//  탭 전환
// ══════════════════════════════════════════════════
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    if (tab === 'employees') {
      showPanel('employees');
    } else {
      // 게임 탭으로 돌아올 때 현재 게임 패널 복원
      const statusMap = { waiting:'waiting', countdown:'waiting', question:'question', revealing:'reveal', finished:'finished' };
      const pill = document.getElementById('game-status-pill').className.replace('status-pill ','');
      showPanel(statusMap[pill] || 'waiting');
    }
  });
});

// ══════════════════════════════════════════════════
//  직원 관리
// ══════════════════════════════════════════════════
let empList = [];
let empSearchTerm = '';

// 직원 목록 수신
socket.on('admin:employeeList', ({ employees }) => {
  empList = employees;
  renderEmpTable();
  document.getElementById('emp-count-badge').textContent = `${employees.length}명`;
});

// 검색
document.getElementById('emp-search').addEventListener('input', e => {
  empSearchTerm = e.target.value.trim().toLowerCase();
  renderEmpTable();
});

// 테이블 렌더링
function renderEmpTable() {
  const tbody = document.getElementById('emp-tbody');
  tbody.innerHTML = '';

  const filtered = empSearchTerm
    ? empList.filter(e => e.name.toLowerCase().includes(empSearchTerm) || e.group.toLowerCase().includes(empSearchTerm))
    : empList;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px">검색 결과 없음</td></tr>`;
    return;
  }

  filtered.forEach(emp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="emp-id">${emp.id}</td>
      <td>${escHtml(emp.group)}</td>
      <td><strong>${escHtml(emp.name)}</strong></td>
      <td class="pw-cell">${escHtml(emp.pw)}</td>
      <td class="emp-actions">
        <button class="emp-action-btn edit" data-id="${emp.id}">수정</button>
        <button class="emp-action-btn del" data-id="${emp.id}">삭제</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // 이벤트 위임
  tbody.querySelectorAll('.emp-action-btn.edit').forEach(btn => {
    btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
  });
  tbody.querySelectorAll('.emp-action-btn.del').forEach(btn => {
    btn.addEventListener('click', () => deleteEmployee(Number(btn.dataset.id)));
  });
}

// 직원 추가
document.getElementById('btn-add-emp').addEventListener('click', () => {
  const group = document.getElementById('new-group').value.trim();
  const name  = document.getElementById('new-name').value.trim();
  const pw    = document.getElementById('new-pw').value.trim();
  document.getElementById('emp-form-error').textContent = '';
  socket.emit('admin:addEmployee', { password: adminPassword, employee: { name, group, pw } });
  // 성공 시 서버에서 employeeList 이벤트로 갱신됨
  document.getElementById('new-group').value = '';
  document.getElementById('new-name').value = '';
  document.getElementById('new-pw').value = '';
});

// 직원 삭제
function deleteEmployee(id) {
  const emp = empList.find(e => e.id === id);
  if (!emp) return;
  if (!confirm(`"${emp.name}" 직원을 삭제하시겠습니까?`)) return;
  socket.emit('admin:deleteEmployee', { password: adminPassword, id });
}

// 수정 모달
function openEditModal(id) {
  const emp = empList.find(e => e.id === id);
  if (!emp) return;
  document.getElementById('edit-id').value = emp.id;
  document.getElementById('edit-group').value = emp.group;
  document.getElementById('edit-name').value = emp.name;
  document.getElementById('edit-pw').value = '';
  document.getElementById('edit-error').textContent = '';
  document.getElementById('edit-modal').classList.remove('hidden');
}

document.getElementById('edit-cancel').addEventListener('click', () => {
  document.getElementById('edit-modal').classList.add('hidden');
});

document.getElementById('edit-save').addEventListener('click', () => {
  const id    = Number(document.getElementById('edit-id').value);
  const group = document.getElementById('edit-group').value.trim();
  const name  = document.getElementById('edit-name').value.trim();
  const pw    = document.getElementById('edit-pw').value.trim();
  socket.emit('admin:updateEmployee', { password: adminPassword, employee: { id, name, group, pw } });
  document.getElementById('edit-modal').classList.add('hidden');
});

// JSON 내보내기 (다운로드)
document.getElementById('btn-export-json').addEventListener('click', () => {
  const url = `/api/employees/export?key=${encodeURIComponent(adminPassword)}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = 'employees.json';
  a.click();
});

// ── 생존 현황 공개 버튼 ──────────────────────────────────────
document.getElementById('btn-reveal-stats').addEventListener('click', () => {
  document.getElementById('reveal-summary').classList.remove('hidden');
  document.getElementById('btn-reveal-stats').classList.add('hidden');

  // 사이드바 통계 + 참가자 목록 갱신 (하트/생존 상태 반영)
  const alive = cachedPlayers.filter(p => p.alive).length;
  const dead  = cachedPlayers.filter(p => !p.alive).length;
  document.getElementById('stat-alive').textContent = alive;
  document.getElementById('stat-dead').textContent  = dead;
  renderPlayerList(cachedPlayers);

  // reveal-summary 수치도 갱신
  if (pendingRevealData.aliveCount !== undefined) {
    document.getElementById('rs-alive').textContent   = pendingRevealData.aliveCount;
    document.getElementById('rs-elim').textContent    = pendingRevealData.eliminated;
    document.getElementById('rs-revived').textContent = pendingRevealData.revived;
  }
});

// ── 생존자 / 탈락자 카드 클릭 → 목록 모달 ──────────────────
document.querySelector('.stat-card.alive').addEventListener('click', () => {
  showPlayersModal('생존자', cachedPlayers.filter(p => p.alive));
});
document.querySelector('.stat-card.dead').addEventListener('click', () => {
  showPlayersModal('탈락자', cachedPlayers.filter(p => !p.alive));
});

function showPlayersModal(title, players) {
  const filtered = [...players].sort((a, b) => b.score - a.score);
  document.getElementById('players-modal-title').textContent = `${title} (${filtered.length}명)`;
  const list = document.getElementById('players-modal-list');
  list.innerHTML = '';
  if (filtered.length === 0) {
    list.innerHTML = '<p class="modal-empty">해당 없음</p>';
  } else {
    filtered.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'modal-player-item';
      div.innerHTML = `
        <span class="mpi-rank">${i + 1}</span>
        <span class="mpi-nick">${escHtml(p.nickname)}</span>
        <span class="mpi-score">${p.score > 0 ? p.score.toLocaleString() + '점' : ''}</span>
      `;
      list.appendChild(div);
    });
  }
  document.getElementById('players-modal').classList.remove('hidden');
}

document.getElementById('players-modal-close').addEventListener('click', () => {
  document.getElementById('players-modal').classList.add('hidden');
});
document.getElementById('players-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('players-modal')) {
    document.getElementById('players-modal').classList.add('hidden');
  }
});

// ── 결과 모달 ───────────────────────────────────────────────
document.getElementById('btn-show-results').addEventListener('click', () => {
  document.getElementById('results-modal').classList.remove('hidden');
});

document.getElementById('results-modal-close').addEventListener('click', () => {
  document.getElementById('results-modal').classList.add('hidden');
});

document.getElementById('results-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('results-modal')) {
    document.getElementById('results-modal').classList.add('hidden');
  }
});

// 결과 모달 탭 전환
document.querySelectorAll('.results-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.results-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.rtab;
    document.querySelectorAll('.results-tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(`rtab-${tab}`).classList.remove('hidden');
  });
});
