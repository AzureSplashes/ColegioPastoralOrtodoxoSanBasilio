/**
 * Liturgical Calendar Engine - Colegio Pastoral Ortodoxo San Basilio
 * Integrates with Orthocal API (https://orthocal.info/api/)
 */

// State
const state = {
  calendar: 'gregorian', // 'gregorian', 'julian', 'revised'
  view: 'daily', // 'daily', 'monthly'
  date: new Date(),
  data: null,
  monthData: null,
  speechSynth: window.speechSynthesis || null,
  isSpeaking: false,
  speechUtterance: null
};

// Days & Months in Spanish
const SPANISH_DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const SPANISH_MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  parseUrlParams();
  setupEventListeners();
  loadData();
});

// Parse URL search parameters (?calendar=julian&date=2026-07-29)
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const calParam = params.get('calendar');
  const dateParam = params.get('date');
  const viewParam = params.get('view');

  if (['gregorian', 'julian', 'revised'].includes(calParam)) {
    state.calendar = calParam;
  }
  if (viewParam && ['daily', 'monthly'].includes(viewParam)) {
    state.view = viewParam;
  }
  if (dateParam) {
    const parsedDate = new Date(dateParam + 'T12:00:00');
    if (!isNaN(parsedDate.getTime())) {
      state.date = parsedDate;
    }
  }

  updateToolbarActiveStates();
}

// Update URL params in browser history
function syncUrlParams() {
  const url = new URL(window.location.href);
  url.searchParams.set('calendar', state.calendar);
  url.searchParams.set('view', state.view);
  const dateStr = formatDateISO(state.date);
  url.searchParams.set('date', dateStr);
  window.history.pushState({}, '', url.toString());
}

function formatDateISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Setup toolbar & interaction listeners
function setupEventListeners() {
  // Calendar Mode Buttons
  document.querySelectorAll('.calendar-mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = e.currentTarget.dataset.mode;
      if (mode && mode !== state.calendar) {
        state.calendar = mode;
        updateToolbarActiveStates();
        syncUrlParams();
        loadData();
      }
    });
  });

  // View Mode Toggle
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      if (view && view !== state.view) {
        state.view = view;
        updateToolbarActiveStates();
        syncUrlParams();
        renderView();
      }
    });
  });

  // Nav Buttons
  document.getElementById('btn-prev-day')?.addEventListener('click', () => changeDate(-1));
  document.getElementById('btn-next-day')?.addEventListener('click', () => changeDate(1));
  document.getElementById('btn-today')?.addEventListener('click', () => {
    state.date = new Date();
    syncUrlParams();
    loadData();
  });

  // Date Picker
  const dateInput = document.getElementById('calendar-date-picker');
  if (dateInput) {
    dateInput.value = formatDateISO(state.date);
    dateInput.addEventListener('change', (e) => {
      if (e.target.value) {
        const pDate = new Date(e.target.value + 'T12:00:00');
        if (!isNaN(pDate.getTime())) {
          state.date = pDate;
          syncUrlParams();
          loadData();
        }
      }
    });
  }

  // Audio Play Button
  document.getElementById('btn-play-speech')?.addEventListener('click', toggleSpeech);
}

function updateToolbarActiveStates() {
  document.querySelectorAll('.calendar-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.calendar);
  });
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === state.view);
  });

  const dateInput = document.getElementById('calendar-date-picker');
  if (dateInput) {
    dateInput.value = formatDateISO(state.date);
  }
}

function changeDate(days) {
  if (state.view === 'monthly') {
    // In monthly view, step by 1 month
    state.date.setMonth(state.date.getMonth() + days);
  } else {
    // In daily view, step by 1 day
    state.date.setDate(state.date.getDate() + days);
  }
  syncUrlParams();
  loadData();
}

// Load Data from Orthocal API
async function loadData() {
  showLoading(true);
  stopSpeech();

  const year = state.date.getFullYear();
  const month = state.date.getMonth() + 1;
  const day = state.date.getDate();

  // Orthocal endpoint mapping
  // Revised Julian uses gregorian endpoint with Eastern Pascha logic
  const apiCal = (state.calendar === 'julian') ? 'julian' : 'gregorian';
  const dayUrl = `https://orthocal.info/api/${apiCal}/${year}/${month}/${day}/`;
  const monthUrl = `https://orthocal.info/api/${apiCal}/${year}/${month}/`;

  try {
    const [dayRes, monthRes] = await Promise.all([
      fetch(dayUrl).then(r => r.ok ? r.json() : null),
      fetch(monthUrl).then(r => r.ok ? r.json() : null)
    ]);

    state.data = dayRes;
    state.monthData = monthRes;
    showLoading(false);
    renderView();
  } catch (err) {
    console.error('Error fetching Orthocal calendar:', err);
    showError('No se pudieron cargar los datos del calendario litúrgico. Por favor intente de nuevo.');
  }
}

function showLoading(isLoading) {
  const spinner = document.getElementById('calendar-spinner');
  const dailyEl = document.getElementById('daily-view-container');
  const monthlyEl = document.getElementById('monthly-view-container');

  if (spinner) spinner.style.display = isLoading ? 'flex' : 'none';
  if (dailyEl && isLoading) dailyEl.style.display = 'none';
  if (monthlyEl && isLoading) monthlyEl.style.display = 'none';
}

function showError(msg) {
  showLoading(false);
  const container = document.getElementById('daily-view-container');
  if (container) {
    container.style.display = 'block';
    container.innerHTML = `<div style="text-align:center; padding: 3rem; color: #9B1C1C;">
      <i data-lucide="alert-circle" style="width:48px;height:48px;margin-bottom:1rem;"></i>
      <h3>${msg}</h3>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
  }
}

// Render Main View
function renderView() {
  const dailyEl = document.getElementById('daily-view-container');
  const monthlyEl = document.getElementById('monthly-view-container');

  if (state.view === 'daily') {
    if (monthlyEl) monthlyEl.style.display = 'none';
    if (dailyEl) {
      dailyEl.style.display = 'block';
      renderDailyView();
    }
  } else {
    if (dailyEl) dailyEl.style.display = 'none';
    if (monthlyEl) {
      monthlyEl.style.display = 'block';
      renderMonthlyView();
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

// Render Daily View
function renderDailyView() {
  const d = state.data;
  if (!d) return;

  const container = document.getElementById('daily-view-container');
  if (!container) return;

  // Format Date String
  const dayName = SPANISH_DAYS[state.date.getDay()];
  const monthName = SPANISH_MONTHS[state.date.getMonth()];
  const dateNum = state.date.getDate();
  const yearNum = state.date.getFullYear();
  const fullDateStr = `${dayName}, ${dateNum} de ${monthName} de ${yearNum}`;

  // Julian date note if Julian or Revised
  let calendarLabel = 'Calendario GREGORIANO (Sincronización Civil)';
  let julianNoteHtml = '';

  if (state.calendar === 'julian') {
    calendarLabel = 'Calendario JULIANO (Estilo Antiguo Traditional)';
    // Compute Julian date approximation (13 days behind in 20th/21st century)
    const julDate = new Date(state.date);
    julDate.setDate(julDate.getDate() - 13);
    const jDay = julDate.getDate();
    const jMonth = SPANISH_MONTHS[julDate.getMonth()];
    julianNoteHtml = `<div class="julian-date-sub">Correspondiente al ${jDay} de ${jMonth} en el Calendario Antiguo</div>`;
  } else if (state.calendar === 'revised') {
    calendarLabel = 'Calendario JULIANO REVISADO (Nuevo Calendario Ortodoxo)';
    julianNoteHtml = `<div class="julian-date-sub">Fiestas Fijas en Fecha Civil • Pascua en Pascualión Ortodoxo</div>`;
  }

  // Fast Level & Badge
  const fastInfo = getFastInfo(d.fast_level, d.fast_level_desc, d.fast_exception_desc);

  // Tone info
  const toneText = d.tone ? `Tono ${d.tone}` : null;

  // Feasts Title
  const feastTitle = d.summary_title || (d.feasts && d.feasts.length > 0 ? d.feasts[0] : null);

  // Readings HTML
  let readingsHtml = '';
  if (d.readings && d.readings.length > 0) {
    readingsHtml = d.readings.map((r, idx) => {
      const passageHtml = r.passage && r.passage.length > 0 
        ? r.passage.map(v => `<span class="verse"><sup class="verse-num">${v.verse}</sup> ${escapeHtml(v.content)}</span>`).join('')
        : '<p>Sin texto extendido disponible.</p>';

      return `
        <div class="reading-card">
          <div class="reading-header">
            <div class="reading-title-box">
              <span class="reading-source-type">${escapeHtml(r.source || 'Lectura')}</span>
              <h4>${escapeHtml(r.display || r.book)}</h4>
            </div>
            <i data-lucide="book-open" style="color:var(--cal-burgundy); width:20px; height:20px;"></i>
          </div>
          <div class="reading-body">
            ${passageHtml}
          </div>
        </div>
      `;
    }).join('');
  } else {
    readingsHtml = '<p style="color:#718096; font-style:italic;">No hay lecturas registradas para este día.</p>';
  }

  // Saints & Commemorations HTML
  let saintsHtml = '';
  if (d.saints && d.saints.length > 0) {
    saintsHtml = d.saints.map(saint => {
      const saintName = typeof saint === 'string' ? saint : saint.title;
      const story = d.stories ? d.stories.find(s => s.title && s.title.includes(saintName)) : null;
      const storyText = story ? story.story : null;

      return `
        <div class="saint-item-card">
          <div class="saint-name">
            <i data-lucide="cross" style="width:16px;height:16px;"></i>
            <span>${escapeHtml(saintName)}</span>
          </div>
          ${storyText ? `<div class="saint-story-text">${escapeHtml(storyText)}</div>` : ''}
        </div>
      `;
    }).join('');
  } else {
    saintsHtml = '<p style="color:#718096; font-style:italic;">Sin conmemoraciones registradas para este día.</p>';
  }

  container.innerHTML = `
    <div class="daily-view-card">
      <div class="daily-header-banner">
        <h2 class="daily-date-title">${fullDateStr}</h2>
        ${julianNoteHtml}
        
        <div class="meta-badges-row">
          <span class="tone-badge" title="Tono de la Semana">
            <i data-lucide="music" style="width:14px; height:14px;"></i> ${toneText || 'Ciclo Pascual'}
          </span>
          <span class="fast-badge ${fastInfo.badgeClass}">
            <i data-lucide="${fastInfo.icon}" style="width:16px; height:16px;"></i> ${fastInfo.label}
          </span>
        </div>
      </div>

      ${feastTitle ? `<div class="feast-banner">${escapeHtml(feastTitle)}</div>` : ''}

      <div class="audio-player-bar">
        <div class="audio-controls">
          <button id="btn-play-speech" class="btn-play-audio" title="Escuchar Lecturas Diarias">
            <i data-lucide="play" id="audio-play-icon"></i>
          </button>
          <div class="audio-info">
            <span class="audio-title">Lectura Guiada por Audio</span>
            <span class="audio-status" id="audio-status-text">Presione reproducir para escuchar las lecturas</span>
          </div>
        </div>
        <div style="font-size:0.85rem; opacity:0.8;">
          <i data-lucide="volume-2" style="vertical-align:middle; width:16px; height:16px; margin-right:4px;"></i> Sintetizador de voz
        </div>
      </div>

      <div class="daily-content-grid">
        <div>
          <h3 class="section-header-title">
            <i data-lucide="book-marked"></i> Lecturas Bíblicas del Día
          </h3>
          ${readingsHtml}
        </div>

        <div>
          <h3 class="section-header-title">
            <i data-lucide="users"></i> Santos y Conmemoraciones
          </h3>
          ${saintsHtml}
        </div>
      </div>
    </div>
  `;
}

// Render Monthly View
function renderMonthlyView() {
  const container = document.getElementById('monthly-view-container');
  if (!container) return;

  const year = state.date.getFullYear();
  const month = state.date.getMonth();
  const monthName = SPANISH_MONTHS[month];

  // First day of month & total days
  const firstDayObj = new Date(year, month, 1);
  const startingWeekday = firstDayObj.getDay(); // 0 = Sunday
  const totalDays = new Date(year, month + 1, 0).getDate();

  let daysGridHtml = '';

  // Weekday Headers
  const weekdaysHtml = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    .map(w => `<div class="weekday-header">${w}</div>`).join('');

  // Empty preceding cells
  for (let i = 0; i < startingWeekday; i++) {
    daysGridHtml += `<div class="month-day-cell other-month"></div>`;
  }

  // Days of current month
  const monthDataList = state.monthData || [];

  for (let d = 1; d <= totalDays; d++) {
    const dayData = monthDataList.find(item => item.day === d) || {};
    const fastInfo = getFastInfo(dayData.fast_level, dayData.fast_level_desc, dayData.fast_exception_desc);

    const isToday = (
      d === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    );

    const summaryText = dayData.summary_title || (dayData.saints && dayData.saints[0]) || '';

    daysGridHtml += `
      <div class="month-day-cell ${isToday ? 'is-today' : ''}" onclick="selectMonthDay(${d})">
        <div class="day-number-row">
          <span class="day-num">${d}</span>
          <span class="day-fast-dot ${fastInfo.dotClass}" title="${fastInfo.label}"></span>
        </div>
        ${summaryText ? `<div class="day-summary-text">${escapeHtml(summaryText)}</div>` : ''}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="monthly-view-card">
      <div class="month-header-row">
        <h2 class="month-title">${monthName} ${year}</h2>
        <div style="font-size:0.9rem; color:#718096; font-style:italic;">
          Haga clic en cualquier día para ver las lecturas completas
        </div>
      </div>

      <div class="month-grid">
        ${weekdaysHtml}
        ${daysGridHtml}
      </div>
    </div>
  `;
}

// Select a day from month grid
window.selectMonthDay = function(dayNum) {
  state.date.setDate(dayNum);
  state.view = 'daily';
  updateToolbarActiveStates();
  syncUrlParams();
  loadData();
};

// Fast Level Helper
function getFastInfo(level, desc, exception) {
  let label = desc || 'Sin Ayuno';
  let badgeClass = 'fast-free';
  let dotClass = 'fast-green';
  let icon = 'check-circle';

  if (exception) {
    label += ` (${exception})`;
  }

  if (level === 0 || label.toLowerCase().includes('no fast') || label.toLowerCase().includes('fast free')) {
    badgeClass = 'fast-free';
    dotClass = 'fast-green';
    icon = 'check-circle';
    label = 'Sin Ayuno';
  } else if (label.toLowerCase().includes('fish') || (exception && exception.toLowerCase().includes('fish'))) {
    badgeClass = 'fish-allowed';
    dotClass = 'fast-amber';
    icon = 'fish';
    label = 'Pescado Permitido';
  } else if (label.toLowerCase().includes('wine') || (exception && exception.toLowerCase().includes('wine'))) {
    badgeClass = 'wine-oil';
    dotClass = 'fast-amber';
    icon = 'glass-water';
    label = 'Vino y Aceite';
  } else if (level === 1 || label.toLowerCase().includes('fast')) {
    badgeClass = 'fast-day';
    dotClass = 'fast-red';
    icon = 'utensils-crossed';
    label = 'Día de Ayuno';
  } else if (level >= 2 || label.toLowerCase().includes('strict')) {
    badgeClass = 'strict-fast';
    dotClass = 'fast-purple';
    icon = 'shield-alert';
    label = 'Ayuno Estricto';
  }

  return { label, badgeClass, dotClass, icon };
}

// Text-to-Speech Audio Player
function toggleSpeech() {
  if (!state.speechSynth) {
    alert('El navegador no soporta síntesis de voz.');
    return;
  }

  if (state.isSpeaking) {
    stopSpeech();
    return;
  }

  if (!state.data) return;

  let textToRead = `Calendario Litúrgico. ${SPANISH_DAYS[state.date.getDay()]}, ${state.date.getDate()} de ${SPANISH_MONTHS[state.date.getMonth()]}. `;
  
  if (state.data.summary_title) {
    textToRead += `Conmemoración principal: ${state.data.summary_title}. `;
  }

  if (state.data.readings) {
    state.data.readings.forEach(r => {
      textToRead += `Lectura de ${r.display || r.source}. `;
      if (r.passage) {
        r.passage.forEach(v => {
          textToRead += `${v.content} `;
        });
      }
    });
  }

  state.speechUtterance = new SpeechSynthesisUtterance(textToRead);
  state.speechUtterance.lang = 'es-ES';
  state.speechUtterance.rate = 0.95;

  const playIcon = document.getElementById('audio-play-icon');
  const statusText = document.getElementById('audio-status-text');

  state.speechUtterance.onstart = () => {
    state.isSpeaking = true;
    if (playIcon) playIcon.setAttribute('data-lucide', 'square');
    if (statusText) statusText.textContent = 'Reproduciendo audio de lecturas...';
    if (window.lucide) window.lucide.createIcons();
  };

  state.speechUtterance.onend = () => {
    stopSpeech();
  };

  state.speechUtterance.onerror = () => {
    stopSpeech();
  };

  state.speechSynth.speak(state.speechUtterance);
}

function stopSpeech() {
  if (state.speechSynth) {
    state.speechSynth.cancel();
  }
  state.isSpeaking = false;
  const playIcon = document.getElementById('audio-play-icon');
  const statusText = document.getElementById('audio-status-text');
  if (playIcon) playIcon.setAttribute('data-lucide', 'play');
  if (statusText) statusText.textContent = 'Presione reproducir para escuchar las lecturas';
  if (window.lucide) window.lucide.createIcons();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
