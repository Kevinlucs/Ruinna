// ===== DADOS DOS TREINOS =====
const RACE_DATE = new Date(2026, 9, 17); // Sábado S24
const START_DATE = new Date(2026, 4, 5); // S1 Terça

function weekDates(weekIndex) {
  const base = new Date(START_DATE);
  base.setDate(base.getDate() + weekIndex * 7);
  const ter = new Date(base);
  const qui = new Date(base); qui.setDate(qui.getDate() + 2);
  const sab = new Date(base); sab.setDate(sab.getDate() + 4);
  return { ter, qui, sab };
}

function fmt(d) { return d.toISOString().split('T')[0]; }
function fmtBR(d) {
  const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  return `${dias[d.getDay()]}, ${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}`;
}

const WEEKS_DATA = [
  { week:'S1', phase:'Base', off:false, ter:{title:'8km Forte/Pace',desc:'1km forte / 1km pace 6:30',km:8,pace:'6:30/km alternado'}, qui:{title:'6km Leve',desc:'Corrida leve e contínua',km:6,pace:'6:30-7:00/km'}, sab:{title:'15km Progressivo',desc:'Longão progressivo',km:15,pace:'Progressivo'} },
  { week:'S2', phase:'Base', off:false, ter:{title:'8km Forte/Pace',desc:'1km forte / 1km pace 6:30',km:8,pace:'6:30/km alternado'}, qui:{title:'6km Leve',desc:'Corrida leve e contínua',km:6,pace:'6:30-7:00/km'}, sab:{title:'17km Progressivo',desc:'Longão progressivo',km:17,pace:'Progressivo'} },
  { week:'S3', phase:'Base', off:false, ter:{title:'10km Intervalado',desc:'Treino intervalado',km:10,pace:'Intervalado'}, qui:{title:'7km Leve',desc:'Corrida leve e contínua',km:7,pace:'6:30-7:00/km'}, sab:{title:'19km Progressivo',desc:'Longão progressivo',km:19,pace:'Progressivo'} },
  { week:'S4', phase:'Base', off:true, ter:{title:'6km Leve',desc:'Semana Off - recuperação',km:6,pace:'7:00/km'}, qui:{title:'5km Leve',desc:'Semana Off - recuperação',km:5,pace:'7:00/km'}, sab:{title:'12km Trote',desc:'Trote leve de recuperação',km:12,pace:'7:00-7:30/km'} },
  { week:'S5', phase:'Base', off:false, ter:{title:'10km Tempo Run',desc:'Corrida em ritmo forte sustentado',km:10,pace:'5:30-6:00/km'}, qui:{title:'8km Leve',desc:'Corrida leve e contínua',km:8,pace:'6:30-7:00/km'}, sab:{title:'21km Progressivo',desc:'Longão progressivo',km:21,pace:'Progressivo'} },
  { week:'S6', phase:'Base', off:false, ter:{title:'10km Subidas',desc:'Treino de subidas',km:10,pace:'Variado (subidas)'}, qui:{title:'8km Leve',desc:'Corrida leve e contínua',km:8,pace:'6:30-7:00/km'}, sab:{title:'23km Progressivo',desc:'Longão progressivo',km:23,pace:'Progressivo'} },
  { week:'S7', phase:'Base', off:false, ter:{title:'12km Intervalado',desc:'Treino intervalado longo',km:12,pace:'Intervalado'}, qui:{title:'8km Leve',desc:'Corrida leve e contínua',km:8,pace:'6:30-7:00/km'}, sab:{title:'25km Progressivo',desc:'Longão progressivo',km:25,pace:'Progressivo'} },
  { week:'S8', phase:'Base', off:true, ter:{title:'7km Leve',desc:'Semana Off - recuperação',km:7,pace:'7:00/km'}, qui:{title:'6km Leve',desc:'Semana Off - recuperação',km:6,pace:'7:00/km'}, sab:{title:'15km Trote',desc:'Trote leve de recuperação',km:15,pace:'7:00-7:30/km'} },
  { week:'S9', phase:'Resistência', off:false, ter:{title:'10x400m Subida',desc:'10 tiros de 400m em subida',km:7,pace:'Forte (subidas)'}, qui:{title:'10km Pace Prova',desc:'Corrida no pace de prova',km:10,pace:'Pace de Prova'}, sab:{title:'28km Longão',desc:'Longão de resistência',km:28,pace:'6:30-7:00/km'} },
  { week:'S10', phase:'Resistência', off:false, ter:{title:'12x400m Subida',desc:'12 tiros de 400m em subida',km:8,pace:'Forte (subidas)'}, qui:{title:'10km Pace Prova',desc:'Corrida no pace de prova',km:10,pace:'Pace de Prova'}, sab:{title:'30km Longão',desc:'Longão de resistência',km:30,pace:'6:30-7:00/km'} },
  { week:'S11', phase:'Resistência', off:false, ter:{title:'Tempo Run 12km',desc:'Corrida em ritmo forte sustentado',km:12,pace:'5:30-6:00/km'}, qui:{title:'12km Pace Prova',desc:'Corrida no pace de prova',km:12,pace:'Pace de Prova'}, sab:{title:'32km Longão',desc:'Longão de resistência',km:32,pace:'6:30-7:00/km'} },
  { week:'S12', phase:'Resistência', off:true, ter:{title:'8km Leve',desc:'Semana Off - recuperação',km:8,pace:'7:00/km'}, qui:{title:'8km Leve',desc:'Semana Off - recuperação',km:8,pace:'7:00/km'}, sab:{title:'18km Leve',desc:'Longão leve de recuperação',km:18,pace:'7:00-7:30/km'} },
  { week:'S13', phase:'Resistência', off:false, ter:{title:'12km Progressivo',desc:'Corrida progressiva de qualidade',km:12,pace:'Progressivo'}, qui:{title:'10km Pace Prova',desc:'Corrida no pace de prova',km:10,pace:'Pace de Prova'}, sab:{title:'34km Longão',desc:'Longão de resistência',km:34,pace:'6:30-7:00/km'} },
  { week:'S14', phase:'Resistência', off:false, ter:{title:'10x800m Intervalado',desc:'10 tiros de 800m intervalados',km:12,pace:'Intervalado forte'}, qui:{title:'12km Pace Prova',desc:'Corrida no pace de prova',km:12,pace:'Pace de Prova'}, sab:{title:'36km Longão',desc:'Longão de resistência',km:36,pace:'6:30-7:00/km'} },
  { week:'S15', phase:'Resistência', off:false, ter:{title:'Tempo Run 15km',desc:'Corrida em ritmo forte sustentado',km:15,pace:'5:30-6:00/km'}, qui:{title:'12km Pace Prova',desc:'Corrida no pace de prova',km:12,pace:'Pace de Prova'}, sab:{title:'38km Longão',desc:'Longão de resistência',km:38,pace:'6:30-7:00/km'} },
  { week:'S16', phase:'Resistência', off:true, ter:{title:'8km Leve',desc:'Semana Off - recuperação',km:8,pace:'7:00/km'}, qui:{title:'8km Leve',desc:'Semana Off - recuperação',km:8,pace:'7:00/km'}, sab:{title:'20km Leve',desc:'Longão leve de recuperação',km:20,pace:'7:00-7:30/km'} },
  { week:'S17', phase:'Pico', off:false, ter:{title:'15km Ritmo 21k',desc:'Corrida no ritmo de meia maratona',km:15,pace:'Ritmo 21k'}, qui:{title:'10km Leve',desc:'Corrida leve e contínua',km:10,pace:'6:30-7:00/km'}, sab:{title:'42km Simulado',desc:'Simulado de prova!',km:42,pace:'Pace de Prova'} },
  { week:'S18', phase:'Pico', off:false, ter:{title:'12km Intervalado',desc:'Treino intervalado de qualidade',km:12,pace:'Intervalado'}, qui:{title:'10km Leve',desc:'Corrida leve e contínua',km:10,pace:'6:30-7:00/km'}, sab:{title:'30km Longão',desc:'Longão forte',km:30,pace:'6:30-7:00/km'} },
  { week:'S19', phase:'Pico', off:false, ter:{title:'12km Subidas',desc:'Treino de subidas',km:12,pace:'Variado (subidas)'}, qui:{title:'10km Leve',desc:'Corrida leve e contínua',km:10,pace:'6:30-7:00/km'}, sab:{title:'45km Pico',desc:'Longão PICO - maior distância!',km:45,pace:'Pace de Prova'} },
  { week:'S20', phase:'Pico', off:true, ter:{title:'8km Leve',desc:'Semana Off - recuperação',km:8,pace:'7:00/km'}, qui:{title:'6km Leve',desc:'Semana Off - recuperação',km:6,pace:'7:00/km'}, sab:{title:'20km Leve',desc:'Longão leve de recuperação',km:20,pace:'7:00-7:30/km'} },
  { week:'S21', phase:'Pico', off:false, ter:{title:'10km Tempo Run',desc:'Polimento - Tempo Run',km:10,pace:'5:30-6:00/km'}, qui:{title:'8km Leve',desc:'Corrida leve de polimento',km:8,pace:'6:30-7:00/km'}, sab:{title:'30km Longão',desc:'Longão de polimento',km:30,pace:'6:30-7:00/km'} },
  { week:'S22', phase:'Pico', off:false, ter:{title:'8km Intervalado',desc:'Polimento - intervalado curto',km:8,pace:'Intervalado'}, qui:{title:'8km Leve',desc:'Corrida leve de polimento',km:8,pace:'6:30-7:00/km'}, sab:{title:'20km Leve',desc:'Longão leve de polimento',km:20,pace:'7:00/km'} },
  { week:'S23', phase:'Pico', off:false, ter:{title:'6km Leve',desc:'Polimento final - descanso',km:6,pace:'7:00/km'}, qui:{title:'5km Leve',desc:'Polimento final - descanso',km:5,pace:'7:00/km'}, sab:{title:'12km Leve',desc:'Último longão antes da prova',km:12,pace:'7:00/km'} },
  { week:'S24', phase:'Pico', off:false, ter:{title:'4km Regenerativo',desc:'Regenerativo pré-prova',km:4,pace:'7:30-8:00/km'}, qui:{title:'3km Trote',desc:'Trote leve pré-prova',km:3,pace:'7:30/km'}, sab:{title:'61KM - PROVA!',desc:'DIA DA PROVA! Boa sorte!',km:61,pace:'Pace de Prova'} },
];

// ===== GERAR LISTA FLAT DE TREINOS =====
const allWorkouts = [];
WEEKS_DATA.forEach((w, i) => {
  const dates = weekDates(i);
  ['ter','qui','sab'].forEach((day, di) => {
    const dayNames = {ter:'Terça', qui:'Quinta', sab:'Sábado'};
    const dayTypes = {ter:'Qualidade', qui:'Base', sab:'Longão'};
    const d = [dates.ter, dates.qui, dates.sab][di];
    allWorkouts.push({
      id: `${w.week}-${day}`,
      week: w.week, weekIndex: i, phase: w.phase, off: w.off,
      day: dayNames[day], dayType: dayTypes[day],
      date: d, dateStr: fmt(d), dateBR: fmtBR(d),
      title: w[day].title, desc: w[day].desc,
      km: w[day].km, pace: w[day].pace,
    });
  });
});

// ===== STATE =====
let completedWorkouts = JSON.parse(localStorage.getItem('planebsb_completed') || '{}');
let customizations = JSON.parse(localStorage.getItem('planebsb_custom') || '{}');
let currentPage = 'home';
let currentPhase = null;
let currentWorkout = null;
let pageHistory = [];

function saveCompleted() { localStorage.setItem('planebsb_completed', JSON.stringify(completedWorkouts)); }
function saveCustom() { localStorage.setItem('planebsb_custom', JSON.stringify(customizations)); }
function isCompleted(id) { return !!completedWorkouts[id]; }
function toggleComplete(id) {
  if (completedWorkouts[id]) delete completedWorkouts[id];
  else completedWorkouts[id] = new Date().toISOString();
  saveCompleted();
}
function getDesc(w) { return (customizations[w.id] && customizations[w.id].desc) || w.desc; }
function getPace(w) { return (customizations[w.id] && customizations[w.id].pace) || w.pace; }

// S1 Terça já concluído
if (!completedWorkouts['S1-ter']) {
  completedWorkouts['S1-ter'] = '2026-05-05T00:00:00.000Z';
  saveCompleted();
}

// ===== STATS HELPERS =====
function getTotalKmDone() {
  return allWorkouts.filter(w => isCompleted(w.id)).reduce((s, w) => s + w.km, 0);
}
function getTotalKmPlan() {
  return allWorkouts.reduce((s, w) => s + w.km, 0);
}
function getCompletedCount() { return allWorkouts.filter(w => isCompleted(w.id)).length; }
function getDaysToRace() {
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.max(0, Math.ceil((RACE_DATE - now) / 86400000));
}
function getNextWorkout() {
  const today = new Date(); today.setHours(0,0,0,0);
  return allWorkouts.find(w => !isCompleted(w.id) && w.date >= today) || allWorkouts.find(w => !isCompleted(w.id));
}
function getCurrentWeekWorkouts() {
  const next = getNextWorkout();
  if (!next) return allWorkouts.slice(-3);
  return allWorkouts.filter(w => w.weekIndex === next.weekIndex);
}
function getPhaseWorkouts(phase) {
  const phases = { base: 'Base', resistencia: 'Resistência', pico: 'Pico' };
  return allWorkouts.filter(w => w.phase === phases[phase]);
}
function getPhaseCompleted(phase) {
  return getPhaseWorkouts(phase).filter(w => isCompleted(w.id)).length;
}
function getConsecutiveWeeks() {
  let streak = 0;
  for (let i = 0; i < WEEKS_DATA.length; i++) {
    const wks = allWorkouts.filter(w => w.weekIndex === i);
    if (wks.every(w => isCompleted(w.id))) streak++;
    else break;
  }
  return streak;
}

// ===== RENDER HELPERS =====
function phaseColor(phase) {
  if (phase === 'Base') return '#FC4C02';
  if (phase === 'Resistência') return '#FF6B2B';
  return '#FF8C42';
}

function renderWorkoutRow(w, showPhase) {
  const d = w.date;
  const dayNum = d.getDate().toString().padStart(2, '0');
  const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  const mon = months[d.getMonth()];
  const done = isCompleted(w.id);
  const today = new Date(); today.setHours(0,0,0,0);
  const isToday = fmt(d) === fmt(today);
  return `<div class="workout-row${done ? ' completed' : ''}${isToday ? ' today' : ''}" data-id="${w.id}" onclick="openWorkout('${w.id}')">
    <div class="row-day"><span class="row-day-num">${dayNum}</span>${mon}</div>
    <div class="row-info">
      <div class="row-title">${w.title}</div>
      <div class="row-sub">${showPhase ? w.phase + ' • ' : ''}${w.day} - ${w.dayType}${w.off ? ' (Off)' : ''}</div>
    </div>
    <div class="row-km">${w.km}km</div>
  </div>`;
}

// ===== RENDER PAGES =====
function renderHome() {
  const next = getNextWorkout();
  const hero = document.getElementById('hero-card');
  if (next) {
    hero.innerHTML = `
      <div class="workout-phase">${next.phase} • ${next.week}</div>
      <div class="workout-title">${next.title}</div>
      <div class="workout-date">📅 ${next.dateBR} • ${next.day}</div>
      <div class="workout-meta">
        <div class="meta-item"><span class="meta-icon">📏</span><span class="meta-value">${next.km} km</span></div>
        <div class="meta-item"><span class="meta-icon">⏱️</span><span class="meta-value">${getPace(next)}</span></div>
        <div class="meta-item"><span class="meta-icon">🏷️</span><span class="meta-value">${next.dayType}</span></div>
      </div>
      <span class="hero-arrow">›</span>`;
    hero.onclick = () => openWorkout(next.id);
  } else {
    hero.innerHTML = `<div class="workout-title">Todos os treinos concluídos! 🎉</div>
      <div class="workout-date">Parabéns pela dedicação!</div>`;
    hero.onclick = null;
  }

  // Countdown
  document.getElementById('countdown-days').textContent = getDaysToRace();
  document.getElementById('countdown-km-done').textContent = getTotalKmDone();
  document.getElementById('countdown-km-total').textContent = getTotalKmPlan();
  const pct = Math.min(100, (getTotalKmDone() / getTotalKmPlan()) * 100);
  document.getElementById('progress-bar').style.width = pct + '%';

  // Weekly
  const weekWks = getCurrentWeekWorkouts();
  const weeklyEl = document.getElementById('weekly-workouts');
  weeklyEl.innerHTML = weekWks.map(w => renderWorkoutRow(w, false)).join('');

  // Header stat
  document.getElementById('total-km').textContent = getTotalKmDone() + ' km';
}

function renderPhases() {
  ['base','resistencia','pico'].forEach(p => {
    const total = getPhaseWorkouts(p).length;
    const done = getPhaseCompleted(p);
    document.getElementById(`count-${p}`).textContent = `${done}/${total}`;
    document.getElementById(`progress-${p}`).style.width = (done/total*100) + '%';
  });
}

function renderPhaseDetail(phase) {
  currentPhase = phase;
  const titles = { base:'BASE', resistencia:'RESISTÊNCIA', pico:'PICO' };
  const subs = { base:'Semanas 1 a 8', resistencia:'Semanas 9 a 16', pico:'Semanas 17 a 24' };
  document.getElementById('phase-detail-title').textContent = titles[phase];
  document.getElementById('phase-detail-sub').textContent = subs[phase];
  const workouts = getPhaseWorkouts(phase);
  const list = document.getElementById('phase-workouts-list');
  let html = '';
  let lastWeek = '';
  workouts.forEach(w => {
    if (w.week !== lastWeek) {
      html += `<div class="week-divider">${w.week}${w.off ? ' (OFF)' : ''} • Volume: ${WEEKS_DATA[w.weekIndex].ter.km + WEEKS_DATA[w.weekIndex].qui.km + WEEKS_DATA[w.weekIndex].sab.km}km</div>`;
      lastWeek = w.week;
    }
    html += renderWorkoutRow(w, false);
  });
  list.innerHTML = html;
}

function renderWorkoutDetail(id) {
  const w = allWorkouts.find(x => x.id === id);
  if (!w) return;
  currentWorkout = w;
  const done = isCompleted(w.id);
  const desc = getDesc(w);
  const pace = getPace(w);
  const el = document.getElementById('workout-detail');
  el.innerHTML = `
    <div class="wd-header">
      <div class="wd-phase" style="color:${phaseColor(w.phase)}">${w.phase} • ${w.week}</div>
      <div class="wd-title">${w.title}</div>
      <div class="wd-date">📅 ${w.dateBR} • ${w.day}</div>
    </div>
    <div class="wd-stats">
      <div class="wd-stat"><div class="wd-stat-icon">📏</div><div class="wd-stat-value">${w.km} km</div><div class="wd-stat-label">Distância</div></div>
      <div class="wd-stat" onclick="startEditPace('${w.id}')" style="cursor:pointer"><div class="wd-stat-icon">⏱️</div><div class="wd-stat-value" style="font-size:1rem">${pace}</div><div class="wd-stat-label">Pace ✏️</div></div>
      <div class="wd-stat"><div class="wd-stat-icon">🏷️</div><div class="wd-stat-value">${w.dayType}</div><div class="wd-stat-label">Tipo</div></div>
      <div class="wd-stat"><div class="wd-stat-icon">📆</div><div class="wd-stat-value">${w.week}</div><div class="wd-stat-label">Semana</div></div>
    </div>
    <div class="wd-description" id="wd-desc-block">
      <button class="btn-edit-inline" onclick="startEditDesc('${w.id}')">✏️ Editar</button>
      <h3>Descrição do Treino</h3>
      <p>${desc}${w.off ? '<br><br>⚠️ <strong>Semana de recuperação</strong> — respeite o descanso!' : ''}</p>
    </div>
    <button class="btn-complete ${done ? 'done' : 'not-done'}" id="btn-toggle-complete" onclick="handleToggleComplete('${w.id}')">
      ${done ? '✅ TREINO CONCLUÍDO' : '🏃 MARCAR COMO CONCLUÍDO'}
    </button>
    ${done ? `<button class="btn-undo" onclick="handleUndo('${w.id}')">Desmarcar conclusão</button>` : ''}`;
}

function renderStats() {
  document.getElementById('stat-total-km').textContent = getTotalKmDone() + ' km';
  document.getElementById('stat-completed').textContent = getCompletedCount();
  document.getElementById('stat-remaining').textContent = allWorkouts.length - getCompletedCount();
  document.getElementById('stat-streak').textContent = getConsecutiveWeeks();
  const phases = [
    { key:'base', name:'BASE', sub:'Semanas 1-8' },
    { key:'resistencia', name:'RESISTÊNCIA', sub:'Semanas 9-16' },
    { key:'pico', name:'PICO', sub:'Semanas 17-24' },
  ];
  const el = document.getElementById('stats-phases');
  el.innerHTML = phases.map(p => {
    const total = getPhaseWorkouts(p.key).length;
    const done = getPhaseCompleted(p.key);
    const kmDone = getPhaseWorkouts(p.key).filter(w => isCompleted(w.id)).reduce((s,w) => s+w.km, 0);
    const kmTotal = getPhaseWorkouts(p.key).reduce((s,w) => s+w.km, 0);
    return `<div class="stats-phase-item">
      <h3>${p.name}</h3>
      <div class="sp-info"><span>${done}/${total} treinos</span><span>${kmDone}/${kmTotal} km</span></div>
      <div class="phase-progress"><div class="phase-progress-bar" style="width:${done/total*100}%"></div></div>
    </div>`;
  }).join('');
}

// ===== NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navBtn) navBtn.classList.add('active');
  const backBtn = document.getElementById('btn-back');
  if (page === 'phase-detail' || page === 'workout') {
    backBtn.classList.remove('hidden');
  } else {
    backBtn.classList.add('hidden');
  }
  currentPage = page;
  window.scrollTo(0, 0);
}

function navigateTo(page) {
  pageHistory.push(currentPage);
  showPage(page);
}

function goBack() {
  const prev = pageHistory.pop();
  if (prev) {
    showPage(prev);
    if (prev === 'home') renderHome();
    else if (prev === 'phases') renderPhases();
    else if (prev === 'phase-detail' && currentPhase) renderPhaseDetail(currentPhase);
    else if (prev === 'stats') renderStats();
  } else {
    showPage('home');
    renderHome();
  }
}

function openPhase(phase) {
  renderPhaseDetail(phase);
  navigateTo('phase-detail');
}

function openWorkout(id) {
  renderWorkoutDetail(id);
  navigateTo('workout');
}

// ===== ACTIONS =====
function handleToggleComplete(id) {
  if (isCompleted(id)) return;
  const w = allWorkouts.find(x => x.id === id);
  document.getElementById('modal-icon').textContent = '🎉';
  document.getElementById('modal-title').textContent = 'Treino Concluído!';
  document.getElementById('modal-message').textContent = `Marcar "${w.title}" (${w.km}km) como concluído?`;
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-confirm').onclick = () => {
    toggleComplete(id);
    document.getElementById('modal-overlay').classList.add('hidden');
    renderWorkoutDetail(id);
    renderHome();
    renderPhases();
  };
  document.getElementById('modal-cancel').onclick = () => {
    document.getElementById('modal-overlay').classList.add('hidden');
  };
}

function handleUndo(id) {
  document.getElementById('modal-icon').textContent = '🔄';
  document.getElementById('modal-title').textContent = 'Desmarcar Treino?';
  document.getElementById('modal-message').textContent = 'Tem certeza que quer desmarcar este treino?';
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-confirm').onclick = () => {
    toggleComplete(id);
    document.getElementById('modal-overlay').classList.add('hidden');
    renderWorkoutDetail(id);
    renderHome();
    renderPhases();
  };
  document.getElementById('modal-cancel').onclick = () => {
    document.getElementById('modal-overlay').classList.add('hidden');
  };
}

// ===== EDIT FUNCTIONS =====
function startEditDesc(id) {
  const w = allWorkouts.find(x => x.id === id);
  const desc = getDesc(w);
  const block = document.getElementById('wd-desc-block');
  block.innerHTML = `
    <h3>Editar Descrição</h3>
    <textarea class="edit-field" id="edit-desc-input" rows="3">${desc}</textarea>
    <div class="edit-actions">
      <button class="btn btn-secondary" onclick="renderWorkoutDetail('${id}')">Cancelar</button>
      <button class="btn btn-primary" onclick="saveEditDesc('${id}')">Salvar</button>
    </div>`;
  document.getElementById('edit-desc-input').focus();
}

function saveEditDesc(id) {
  const val = document.getElementById('edit-desc-input').value.trim();
  if (!customizations[id]) customizations[id] = {};
  customizations[id].desc = val;
  saveCustom();
  renderWorkoutDetail(id);
}

function startEditPace(id) {
  const w = allWorkouts.find(x => x.id === id);
  const pace = getPace(w);
  document.getElementById('modal-icon').textContent = '⏱️';
  document.getElementById('modal-title').textContent = 'Editar Pace';
  document.getElementById('modal-message').innerHTML = `
    <input type="text" class="edit-field" id="edit-pace-input" value="${pace}" style="text-align:center;margin-top:8px">`;
  document.getElementById('modal-overlay').classList.remove('hidden');
  setTimeout(() => document.getElementById('edit-pace-input')?.focus(), 100);
  document.getElementById('modal-confirm').onclick = () => {
    const val = document.getElementById('edit-pace-input').value.trim();
    if (val) {
      if (!customizations[id]) customizations[id] = {};
      customizations[id].pace = val;
      saveCustom();
    }
    document.getElementById('modal-overlay').classList.add('hidden');
    renderWorkoutDetail(id);
    renderHome();
  };
  document.getElementById('modal-cancel').onclick = () => {
    document.getElementById('modal-overlay').classList.add('hidden');
  };
}

// ===== EVENT LISTENERS =====
document.getElementById('btn-back').addEventListener('click', goBack);

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    pageHistory = [];
    showPage(page);
    if (page === 'home') renderHome();
    else if (page === 'phases') renderPhases();
    else if (page === 'stats') renderStats();
  });
});

document.querySelectorAll('.phase-card').forEach(card => {
  card.addEventListener('click', () => openPhase(card.dataset.phase));
});

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden');
});

// ===== INIT =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    renderHome();
    renderPhases();
  }, 2300);
});
