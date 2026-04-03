const STORAGE_KEY = 'student-life-os.website-state.v1'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const PERIODS = [
  { label: 'Morning', time: '08:00 - 10:00' },
  { label: 'Late Morning', time: '10:00 - 12:00' },
  { label: 'Afternoon', time: '13:00 - 15:00' },
  { label: 'Evening', time: '16:00 - 18:00' },
]
const QUOTES = [
  { text: 'Small progress is still progress.', author: 'Student Life OS' },
  { text: 'Consistency beats intensity when the goal is growth.', author: 'Student Life OS' },
  { text: 'Make the next 25 minutes count.', author: 'Student Life OS' },
  { text: 'A clear plan turns a busy day into a productive one.', author: 'Student Life OS' },
  { text: 'Focus on the next useful step, not the entire staircase.', author: 'Student Life OS' },
  { text: 'You do not need more time. You need a calmer system.', author: 'Student Life OS' },
]

const DEFAULT_TASKS = [
  {
    id: crypto.randomUUID(),
    title: 'Review chemistry notes',
    category: 'Study',
    priority: 'high',
    completed: false,
    createdAt: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Submit assignment draft',
    category: 'Exams',
    priority: 'medium',
    completed: false,
    createdAt: Date.now(),
  },
]

const DEFAULT_TIMETABLE = Object.fromEntries(DAYS.map((day) => [day, ['', '', '', '']]))

const defaultState = () => ({
  theme: 'dark',
  soundEnabled: true,
  quoteIndex: 0,
  appearance: {
    accent: 'ocean',
    density: 'roomy',
    liquid: 'flow',
  },
  lastActiveDate: '',
  streak: 1,
  tasks: structuredClone(DEFAULT_TASKS),
  notes: 'Plan the day in one clear sentence, then start.',
  timetable: structuredClone(DEFAULT_TIMETABLE),
  stats: {},
  timer: {
    mode: 'work',
    remaining: 25 * 60,
    running: false,
  },
  focusSession: {
    duration: 25 * 60,
    remaining: 25 * 60,
    running: false,
  },
  focusMode: {
    theme: 'aurora',
    alarm: 'peaceful',
    autoBreak: true,
    quote: 'Breathe, focus, and finish one useful thing.',
  },
  focusSettings: {
    hours: 0,
    minutes: 25,
    seconds: 0,
  },
  taskHistory: [],
  aiHistory: [],
})

const app = document.getElementById('app')
const loader = document.createElement('div')
loader.className = 'loader'
loader.innerHTML = '<span></span><span></span><span></span>'
document.body.append(loader)

app.innerHTML = `
  <header class="topbar glass fade-in">
    <div class="brand">
      <div class="brand-mark">S</div>
      <div>
        <p>Student Life OS</p>
        <span>Student dashboard website</span>
      </div>
    </div>
    <div class="topbar-actions">
      <span class="version-pill" id="versionPill">v1.0.0</span>
      <button type="button" class="ghost-button" id="newQuoteBtn">New quote</button>
      <button type="button" class="ghost-button" id="focusBtn">Focus mode</button>
      <button type="button" class="primary-button" id="themeBtn">Toggle theme</button>
    </div>
  </header>

  <main class="page">
    <section class="hero-shell glass fade-up">
      <aside class="hero-sidebar">
        <div class="brand-stack">
          <div class="brand-mark large">S</div>
          <div>
            <p>Student Life OS</p>
            <span>VisionOS-inspired student companion</span>
          </div>
        </div>

        <div class="hero-sidebar-card">
          <p class="eyebrow">Daily overview</p>
          <h1 id="greeting">Good morning.</h1>
          <p id="heroSummary">Your dashboard loads study time, tasks, notes, and your weekly plan in one place.</p>
          <p class="build-note" id="buildNote">Last updated: loading...</p>
        </div>

        <div class="hero-sidebar-card hero-actions-stack">
          <button type="button" class="primary-button" data-scroll="#tasksPanel">Manage tasks</button>
          <button type="button" class="ghost-button" data-scroll="#schedulePanel">Open timetable</button>
          <button type="button" class="ghost-button" id="focusBtn">Focus mode</button>
        </div>

        <div class="quote-card surface floating-card">
          <span class="quote-label">Motivation</span>
          <p id="quoteText">Small progress is still progress.</p>
          <small id="quoteAuthor">Student Life OS</small>
        </div>
      </aside>

      <section class="hero-workspace">
        <div class="hero-visual">
          <div class="liquid-orb orb-a"></div>
          <div class="liquid-orb orb-b"></div>
          <div class="workspace-orbital floating-card">
            <span class="eyebrow">Workspace</span>
            <strong>Adaptive student OS</strong>
            <p>Time-aware, fluid, and command-driven.</p>
          </div>
        </div>
      </section>
    </section>

    <section class="os-strip glass fade-up delay-1" id="adaptiveStrip">
      <article class="os-card atmosphere-card">
        <div class="os-card-header">
          <span class="eyebrow">Adaptive OS</span>
          <strong id="adaptiveModeLabel">Morning mode</strong>
        </div>
        <p id="adaptiveModeText">Your layout shifts toward planning, scheduling, and a lighter start.</p>
      </article>

      <article class="os-card momentum-card">
        <div class="os-card-header">
          <span class="eyebrow">Momentum</span>
          <strong>Flow state</strong>
        </div>
        <div class="momentum-ring">
          <div>
            <span>Focus</span>
            <strong id="momentumFocus">0 min</strong>
          </div>
          <div>
            <span>Tasks</span>
            <strong id="momentumTasks">0</strong>
          </div>
        </div>
        <div class="momentum-wave" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
      </article>

      <article class="os-card timeline-card">
        <div class="os-card-header">
          <span class="eyebrow">Smart timeline</span>
          <strong>Now / Next / Later</strong>
        </div>
        <div id="smartTimeline" class="smart-timeline"></div>
      </article>

      <article class="os-card assistant-card">
        <div class="os-card-header">
          <span class="eyebrow">Digital assistant</span>
          <strong id="assistantTitle">Suggested next step</strong>
        </div>
        <p id="assistantText">You usually get momentum after a small study win. Start with one short task.</p>
        <button type="button" class="ghost-button dock-button" id="assistantRefreshBtn">Refresh suggestion</button>
      </article>
    </section>

    <section class="stats-grid fade-up delay-1">
      <article class="stat-card glass">
        <span>Tasks left</span>
        <strong id="tasksLeftStat">0</strong>
        <small id="tasksDoneStat">0 completed today</small>
      </article>
      <article class="stat-card glass">
        <span>Next class</span>
        <strong id="nextClassStat">Open slot</strong>
        <small id="nextClassSubStat">Update your timetable</small>
      </article>
      <article class="stat-card glass">
        <span>Focus time</span>
        <strong id="focusMinutesStat">0 min</strong>
        <small id="focusSessionsStat">0 sessions today</small>
      </article>
      <article class="stat-card glass">
        <span>Streak</span>
        <strong id="streakStat">1 day</strong>
        <small id="streakSubStat">Keep the momentum alive</small>
      </article>
    </section>

    <section class="panel-grid">
      <section class="panel glass fade-up delay-2" id="tasksPanel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Task manager</p>
            <h2>Stay on top of what matters</h2>
          </div>
          <span class="pill" id="taskCountPill">0 items</span>
        </div>

        <form id="taskForm" class="task-form">
          <input type="hidden" id="taskId" />
          <label>
            <span>Task</span>
            <input id="taskTitle" type="text" placeholder="Write essay outline" maxlength="80" required />
          </label>
          <label>
            <span>Category</span>
            <select id="taskCategory">
              <option>Study</option>
              <option>Personal</option>
              <option>Exams</option>
            </select>
          </label>
          <label>
            <span>Priority</span>
            <select id="taskPriority">
              <option value="high">High</option>
              <option value="medium" selected>Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <div class="task-form-actions">
            <button type="submit" class="primary-button" id="taskSubmitBtn">Add task</button>
            <button type="button" class="ghost-button" id="taskCancelBtn">Clear</button>
          </div>
        </form>

        <div id="taskList" class="task-list" aria-live="polite"></div>
      </section>

      <section class="panel glass fade-up delay-3" id="timerPanel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Study timer</p>
            <h2>Pomodoro focus</h2>
          </div>
          <span class="pill" id="timerModePill">Work</span>
        </div>

        <div class="timer-ring" id="timerRing" style="--progress: 0">
          <div>
            <strong id="timerValue">25:00</strong>
            <small id="timerLabel">Ready to start</small>
          </div>
        </div>

        <div class="timer-actions">
          <button type="button" class="primary-button" id="timerToggleBtn">Start</button>
          <button type="button" class="ghost-button" id="timerResetBtn">Reset</button>
        </div>

        <div class="mini-metrics">
          <div>
            <span>Work</span>
            <strong>25 min</strong>
          </div>
          <div>
            <span>Break</span>
            <strong>5 min</strong>
          </div>
          <div>
            <span>Today</span>
            <strong id="timerTodayStat">0 min</strong>
          </div>
        </div>
      </section>

      <section class="panel glass fade-up delay-4" id="notesPanel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Notes</p>
            <h2>Quick capture</h2>
          </div>
          <span class="pill" id="notesCount">0 chars</span>
        </div>

        <textarea id="notesInput" placeholder="Capture ideas, reminders, and next steps..."></textarea>
      </section>

      <section class="panel glass fade-up delay-5" id="schedulePanel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Timetable</p>
            <h2>Weekly schedule</h2>
          </div>
          <span class="pill">Editable grid</span>
        </div>
        <div class="schedule-wrap" id="timetableGrid"></div>
      </section>

      <section class="panel glass fade-up delay-6" id="insightsPanel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Insights</p>
            <h2>Calendar and progress</h2>
          </div>
          <span class="pill" id="monthLabel"></span>
        </div>
        <div class="insights-grid">
          <div>
            <h3>Calendar</h3>
            <div class="calendar" id="calendarGrid"></div>
          </div>
          <div>
            <h3>Progress</h3>
            <div class="chart" id="chartBars"></div>
          </div>
        </div>
      </section>

      <section class="panel glass fade-up delay-7" id="settingsPanel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Settings</p>
            <h2>Personalize the experience</h2>
          </div>
          <span class="pill">Local only</span>
        </div>

        <div class="settings-list">
          <div class="customize-grid">
            <label>
              <span>
                <strong>Accent palette</strong>
                <small>Change the liquid highlight color</small>
              </span>
              <select id="accentSelect">
                <option value="ocean">Ocean</option>
                <option value="aurora">Aurora</option>
                <option value="plum">Plum</option>
                <option value="sunrise">Sunrise</option>
              </select>
            </label>

            <label>
              <span>
                <strong>Page density</strong>
                <small>Choose how spacious the home feels</small>
              </span>
              <select id="densitySelect">
                <option value="roomy">Roomy</option>
                <option value="balanced">Balanced</option>
                <option value="compact">Compact</option>
              </select>
            </label>

            <label>
              <span>
                <strong>Liquid motion</strong>
                <small>Controls the float animation intensity</small>
              </span>
              <select id="liquidSelect">
                <option value="flow">Flow</option>
                <option value="drift">Drift</option>
                <option value="wave">Wave</option>
              </select>
            </label>
          </div>

          <label class="toggle-row">
            <span>
              <strong>Dark mode</strong>
              <small>Switch between soft light and dark themes</small>
            </span>
            <button type="button" class="switch" id="themeSwitch" aria-pressed="true" aria-label="Toggle dark mode"></button>
          </label>

          <label class="toggle-row">
            <span>
              <strong>Sound effects</strong>
              <small>Subtle beep when a timer phase ends</small>
            </span>
            <button type="button" class="switch" id="soundSwitch" aria-pressed="true" aria-label="Toggle sound effects"></button>
          </label>

          <button type="button" class="danger-button" id="resetBtn">Reset all data</button>
        </div>
      </section>

      <section class="panel glass fade-up delay-8" id="historyPanel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">History</p>
            <h2>Task activity log</h2>
          </div>
          <span class="pill">Recent changes</span>
        </div>
        <div id="taskHistoryList" class="history-list" aria-live="polite"></div>
      </section>

    </section>
  </main>

  <div class="toast" id="toast" role="status" aria-live="polite"></div>

  <nav class="dock glass" aria-label="Quick actions">
    <button type="button" class="dock-item" data-dock="#tasksPanel">Tasks</button>
    <button type="button" class="dock-item" data-dock="#schedulePanel">Timeline</button>
    <button type="button" class="dock-item" data-dock="#timerPanel">Focus</button>
    <button type="button" class="dock-item" data-dock="#insightsPanel">Progress</button>
  </nav>

  <section class="focus-overlay" id="focusOverlay" hidden>
    <div class="focus-glow focus-glow-a"></div>
    <div class="focus-glow focus-glow-b"></div>
    <button type="button" class="focus-exit-floating" id="focusExitFloatingBtn">Exit focus</button>
    <div class="focus-card glass">
      <button type="button" class="focus-close" id="focusCloseBtn" aria-label="Close focus mode">×</button>
      <span class="quote-label">Focus mode</span>
      <h2>Distraction-free session</h2>
      <p id="focusOverlayText">Everything you need is reduced to one calm view.</p>
      <div class="focus-quote-block">
        <label>
          <span>Custom focus quote</span>
          <textarea id="focusQuoteInput" rows="3" placeholder="Write a short focus line..."></textarea>
        </label>
        <button type="button" class="ghost-button" id="saveFocusQuoteBtn">Save quote</button>
      </div>
      <p class="focus-note">Set the duration in Pomodoro, then tune the mode here.</p>
      <div class="focus-meta">
        <div>
          <span>Session</span>
          <strong id="focusSessionLabel">25:00</strong>
        </div>
        <div>
          <span>Alarm</span>
          <strong>Peaceful melody</strong>
        </div>
        <div>
          <span>Status</span>
          <strong id="focusStatusLabel">Ready</strong>
        </div>
      </div>
      <div class="focus-customize-grid">
        <label>
          <span>Theme</span>
          <select id="focusThemeSelect">
            <option value="aurora">Aurora</option>
            <option value="ocean">Ocean</option>
            <option value="plum">Plum</option>
            <option value="sunrise">Sunrise</option>
          </select>
        </label>
        <label>
          <span>Alarm</span>
          <select id="focusAlarmSelect">
            <option value="peaceful">Peaceful melody</option>
            <option value="chime">Soft chime</option>
            <option value="silent">Silent finish</option>
          </select>
        </label>
      </div>
      <label class="toggle-row focus-toggle-row">
        <span>
          <strong>Auto break</strong>
          <small>Switch to break mode automatically after focus</small>
        </span>
        <button type="button" class="switch" id="focusAutoBreakSwitch" aria-pressed="true" aria-label="Toggle auto break"></button>
      </label>
      <div class="focus-duration">
        <label>
          <span>Hours</span>
          <input id="focusHours" type="number" min="0" max="12" value="0" />
        </label>
        <label>
          <span>Minutes</span>
          <input id="focusMinutes" type="number" min="0" max="59" value="25" />
        </label>
        <label>
          <span>Seconds</span>
          <input id="focusSeconds" type="number" min="0" max="59" value="0" />
        </label>
      </div>
      <div class="focus-presets">
        <button type="button" class="chip-button" data-focus-preset="900">15 min</button>
        <button type="button" class="chip-button" data-focus-preset="1500">25 min</button>
        <button type="button" class="chip-button" data-focus-preset="2700">45 min</button>
        <button type="button" class="chip-button" data-focus-preset="3600">1 hour</button>
      </div>
      <div class="focus-stats">
        <div>
          <span>Timer</span>
          <strong id="focusOverlayTimer">25:00</strong>
        </div>
        <div>
          <span>Tasks left</span>
          <strong id="focusOverlayTasks">0</strong>
        </div>
      </div>
      <div class="timer-actions">
        <button type="button" class="primary-button" id="focusStartBtn">Start focus</button>
        <button type="button" class="ghost-button" id="focusPauseBtn">Pause</button>
      </div>
      <button type="button" class="primary-button" id="exitFocusBtn">Exit focus mode</button>
    </div>
  </section>
`

const focusExitBanner = document.createElement('button')
focusExitBanner.type = 'button'
focusExitBanner.className = 'focus-exit-banner'
focusExitBanner.textContent = 'Exit focus mode'
focusExitBanner.hidden = true
document.body.append(focusExitBanner)

const state = loadState()

const els = {
  body: document.body,
  greeting: document.getElementById('greeting'),
  heroSummary: document.getElementById('heroSummary'),
  quoteText: document.getElementById('quoteText'),
  quoteAuthor: document.getElementById('quoteAuthor'),
  versionPill: document.getElementById('versionPill'),
  buildNote: document.getElementById('buildNote'),
  newQuoteBtn: document.getElementById('newQuoteBtn'),
  focusBtn: document.getElementById('focusBtn'),
  themeBtn: document.getElementById('themeBtn'),
  themeSwitch: document.getElementById('themeSwitch'),
  soundSwitch: document.getElementById('soundSwitch'),
  accentSelect: document.getElementById('accentSelect'),
  densitySelect: document.getElementById('densitySelect'),
  liquidSelect: document.getElementById('liquidSelect'),
  taskForm: document.getElementById('taskForm'),
  taskId: document.getElementById('taskId'),
  taskTitle: document.getElementById('taskTitle'),
  taskCategory: document.getElementById('taskCategory'),
  taskPriority: document.getElementById('taskPriority'),
  taskSubmitBtn: document.getElementById('taskSubmitBtn'),
  taskCancelBtn: document.getElementById('taskCancelBtn'),
  taskList: document.getElementById('taskList'),
  taskCountPill: document.getElementById('taskCountPill'),
  tasksLeftStat: document.getElementById('tasksLeftStat'),
  tasksDoneStat: document.getElementById('tasksDoneStat'),
  nextClassStat: document.getElementById('nextClassStat'),
  nextClassSubStat: document.getElementById('nextClassSubStat'),
  focusMinutesStat: document.getElementById('focusMinutesStat'),
  focusSessionsStat: document.getElementById('focusSessionsStat'),
  streakStat: document.getElementById('streakStat'),
  streakSubStat: document.getElementById('streakSubStat'),
  timerModePill: document.getElementById('timerModePill'),
  timerRing: document.getElementById('timerRing'),
  timerValue: document.getElementById('timerValue'),
  timerLabel: document.getElementById('timerLabel'),
  timerToggleBtn: document.getElementById('timerToggleBtn'),
  timerResetBtn: document.getElementById('timerResetBtn'),
  timerTodayStat: document.getElementById('timerTodayStat'),
  notesInput: document.getElementById('notesInput'),
  notesCount: document.getElementById('notesCount'),
  timetableGrid: document.getElementById('timetableGrid'),
  calendarGrid: document.getElementById('calendarGrid'),
  chartBars: document.getElementById('chartBars'),
  monthLabel: document.getElementById('monthLabel'),
  resetBtn: document.getElementById('resetBtn'),
  taskHistoryList: document.getElementById('taskHistoryList'),
  toast: document.getElementById('toast'),
  focusOverlay: document.getElementById('focusOverlay'),
  focusOverlayText: document.getElementById('focusOverlayText'),
  focusSessionLabel: document.getElementById('focusSessionLabel'),
  focusStatusLabel: document.getElementById('focusStatusLabel'),
  focusOverlayTimer: document.getElementById('focusOverlayTimer'),
  focusOverlayTasks: document.getElementById('focusOverlayTasks'),
  focusThemeSelect: document.getElementById('focusThemeSelect'),
  focusAlarmSelect: document.getElementById('focusAlarmSelect'),
  focusAutoBreakSwitch: document.getElementById('focusAutoBreakSwitch'),
  focusQuoteInput: document.getElementById('focusQuoteInput'),
  saveFocusQuoteBtn: document.getElementById('saveFocusQuoteBtn'),
  focusHours: document.getElementById('focusHours'),
  focusMinutes: document.getElementById('focusMinutes'),
  focusSeconds: document.getElementById('focusSeconds'),
  focusStartBtn: document.getElementById('focusStartBtn'),
  focusPauseBtn: document.getElementById('focusPauseBtn'),
  focusCloseBtn: document.getElementById('focusCloseBtn'),
  focusExitFloatingBtn: document.getElementById('focusExitFloatingBtn'),
  exitFocusBtn: document.getElementById('exitFocusBtn'),
  focusExitBanner,
  adaptiveModeLabel: document.getElementById('adaptiveModeLabel'),
  adaptiveModeText: document.getElementById('adaptiveModeText'),
  momentumFocus: document.getElementById('momentumFocus'),
  momentumTasks: document.getElementById('momentumTasks'),
  smartTimeline: document.getElementById('smartTimeline'),
  assistantTitle: document.getElementById('assistantTitle'),
  assistantText: document.getElementById('assistantText'),
  assistantRefreshBtn: document.getElementById('assistantRefreshBtn'),
}

let timerInterval = null
let focusInterval = null
let focusHistoryPushed = false
let audioContext = null

registerActiveDay()
syncTheme()
syncThemeSwitches()
renderAll()
forceCloseFocusMode()
renderBuildStamp()

setupEvents()
hideLoader()

function setupEvents() {
  els.newQuoteBtn.addEventListener('click', () => {
    state.quoteIndex = randomQuoteIndex()
    saveState()
    renderMotivation()
    showToast('New quote loaded')
  })

  els.focusBtn.addEventListener('click', enterFocusMode)
  els.exitFocusBtn.addEventListener('click', exitFocusMode)
  els.themeBtn.addEventListener('click', toggleTheme)
  els.themeSwitch.addEventListener('click', toggleTheme)
  els.soundSwitch.addEventListener('click', toggleSound)
  els.accentSelect.addEventListener('change', updateAppearance)
  els.densitySelect.addEventListener('change', updateAppearance)
  els.liquidSelect.addEventListener('change', updateAppearance)

  els.taskForm.addEventListener('submit', handleTaskSubmit)
  els.taskCancelBtn.addEventListener('click', clearTaskForm)
  els.taskList.addEventListener('click', handleTaskListClick)

  els.timerToggleBtn.addEventListener('click', toggleTimer)
  els.timerResetBtn.addEventListener('click', () => resetTimer())

  els.focusStartBtn.addEventListener('click', startFocusSession)
  els.focusPauseBtn.addEventListener('click', pauseFocusSession)
  bindExitControl(els.focusCloseBtn)
  bindExitControl(els.focusExitFloatingBtn)
  bindExitControl(els.focusExitBanner)
  els.focusThemeSelect.addEventListener('change', updateFocusMode)
  els.focusAlarmSelect.addEventListener('change', updateFocusMode)
  els.focusAutoBreakSwitch.addEventListener('click', toggleAutoBreak)
  els.saveFocusQuoteBtn.addEventListener('click', saveFocusQuote)
  els.assistantRefreshBtn.addEventListener('click', refreshAssistant)
  document.querySelectorAll('[data-dock]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.dock)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
  document.addEventListener('pointermove', handlePointerMove, { passive: true })
  els.focusHours.addEventListener('input', syncFocusDurationFromInputs)
  els.focusMinutes.addEventListener('input', syncFocusDurationFromInputs)
  els.focusSeconds.addEventListener('input', syncFocusDurationFromInputs)
  document.querySelectorAll('[data-focus-preset]').forEach((button) => {
    button.addEventListener('click', () => applyFocusPreset(Number(button.dataset.focusPreset)))
  })

  els.notesInput.addEventListener('input', handleNotesInput)
  els.resetBtn.addEventListener('click', resetAllData)

  document.querySelectorAll('[data-scroll]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.querySelector(button.dataset.scroll)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })

  window.addEventListener('popstate', () => {
    if (!els.focusOverlay.hidden) exitFocusMode()
  })

  window.addEventListener('pageshow', () => {
    forceCloseFocusMode(true)
  })

  els.focusOverlay.addEventListener('click', (event) => {
    if (event.target === els.focusOverlay) exitFocusMode()
  })

  window.addEventListener('beforeunload', saveState)
}

function bindExitControl(element) {
  const handler = (event) => {
    event.preventDefault()
    event.stopPropagation()
    exitFocusMode()
  }

  element.addEventListener('click', handler)
  element.addEventListener('pointerup', handler)
  element.addEventListener('touchend', handler, { passive: false })
}

function loadState() {
  const fallback = defaultState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    return normalizeState({ ...fallback, ...parsed })
  } catch {
    return fallback
  }
}

function normalizeState(input) {
  const fallback = defaultState()
  const tasks = Array.isArray(input.tasks) && input.tasks.length ? input.tasks : fallback.tasks
  const timetable = DAYS.reduce((acc, day) => {
    const row = input.timetable?.[day]
    acc[day] = Array.isArray(row) ? row.slice(0, 4).concat(['', '', '', '']).slice(0, 4) : fallback.timetable[day]
    return acc
  }, {})

  return {
    ...fallback,
    ...input,
    tasks: tasks.map((task) => ({
      id: task.id ?? crypto.randomUUID(),
      title: String(task.title ?? '').trim(),
      category: ['Study', 'Personal', 'Exams'].includes(task.category) ? task.category : 'Study',
      priority: ['high', 'medium', 'low'].includes(String(task.priority).toLowerCase()) ? String(task.priority).toLowerCase() : 'medium',
      completed: Boolean(task.completed),
      createdAt: Number(task.createdAt ?? Date.now()),
    })).filter((task) => task.title),
    timetable,
    stats: typeof input.stats === 'object' && input.stats ? input.stats : {},
    timer: {
      mode: input.timer?.mode === 'break' ? 'break' : 'work',
      remaining: Number.isFinite(input.timer?.remaining) ? input.timer.remaining : 25 * 60,
      running: Boolean(input.timer?.running),
    },
    focusSession: {
      duration: Number.isFinite(input.focusSession?.duration) ? input.focusSession.duration : 25 * 60,
      remaining: Number.isFinite(input.focusSession?.remaining) ? input.focusSession.remaining : 25 * 60,
      running: Boolean(input.focusSession?.running),
    },
    focusMode: normalizeFocusMode(input.focusMode),
    focusSettings: normalizeFocusSettings(input.focusSettings, input.focusSession?.duration),
    appearance: normalizeAppearance(input.appearance),
    taskHistory: Array.isArray(input.taskHistory) ? input.taskHistory.slice(0, 20).map(normalizeHistoryItem).filter(Boolean) : [],
    notes: String(input.notes ?? fallback.notes),
    theme: input.theme === 'light' ? 'light' : 'dark',
    soundEnabled: input.soundEnabled !== false,
    quoteIndex: Number.isFinite(input.quoteIndex) ? input.quoteIndex : 0,
    streak: Number.isFinite(input.streak) ? input.streak : 1,
    lastActiveDate: String(input.lastActiveDate ?? ''),
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function renderAll() {
  registerActiveDay()
  renderTheme()
  updateAtmosphere()
  renderMotivation()
  renderOverview()
  renderAdaptiveShell()
  renderTasks()
  renderTimer()
  renderNotes()
  renderTimetable()
  renderCalendar()
  renderChart()
  renderFocusOverlay()
  renderTaskHistory()
  saveState()
}

function renderTheme() {
  els.body.classList.toggle('theme-light', state.theme === 'light')
  els.body.classList.toggle('theme-dark', state.theme === 'dark')
  els.body.dataset.accent = state.appearance.accent
  els.body.dataset.density = state.appearance.density
  els.body.dataset.liquid = state.appearance.liquid
  const pressed = state.theme === 'dark'
  els.themeSwitch.setAttribute('aria-pressed', String(pressed))
  els.soundSwitch.setAttribute('aria-pressed', String(state.soundEnabled))
  els.themeBtn.textContent = state.theme === 'dark' ? 'Light mode' : 'Dark mode'
  els.accentSelect.value = state.appearance.accent
  els.densitySelect.value = state.appearance.density
  els.liquidSelect.value = state.appearance.liquid
}

function renderMotivation() {
  const quote = QUOTES[state.quoteIndex % QUOTES.length]
  els.quoteText.textContent = quote.text
  els.quoteAuthor.textContent = quote.author
}

function renderBuildStamp() {
  const updated = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date())
  els.versionPill.textContent = 'v1.1.0'
  els.buildNote.textContent = `Last updated: ${updated}`
}

function renderOverview() {
  const now = new Date()
  const greeting = getGreeting(now)
  const openTasks = state.tasks.filter((task) => !task.completed).length
  const completedToday = getTodayStats().completedTasks
  const focusMinutes = getTodayStats().focusMinutes
  const nextClass = getNextClass(now)
  const adaptive = getAdaptiveMode()

  els.greeting.textContent = `${greeting}, student.`
  els.heroSummary.textContent = adaptive.description
  els.tasksLeftStat.textContent = String(openTasks)
  els.tasksDoneStat.textContent = `${completedToday} completed today`
  els.nextClassStat.textContent = nextClass.title
  els.nextClassSubStat.textContent = nextClass.subtitle
  els.focusMinutesStat.textContent = `${focusMinutes} min`
  els.focusSessionsStat.textContent = `${getTodayStats().focusSessions} sessions today`
  els.streakStat.textContent = `${state.streak} day${state.streak === 1 ? '' : 's'}`
  els.streakSubStat.textContent = state.lastActiveDate === todayKey() ? 'Active today' : 'Come back tomorrow to keep it going'
  els.timerTodayStat.textContent = `${focusMinutes} min`
}

function renderAdaptiveShell() {
  const mode = getAdaptiveMode()
  els.adaptiveModeLabel.textContent = `${mode.label} mode`
  els.adaptiveModeText.textContent = mode.description
  els.momentumFocus.textContent = `${getTodayStats().focusMinutes} min`
  els.momentumTasks.textContent = String(state.tasks.filter((task) => !task.completed).length)
  renderSmartTimeline()
  renderAssistant()
}

function renderSmartTimeline() {
  const items = getTimelineItems()
  els.smartTimeline.innerHTML = items
    .map(
      (item, index) => `
        <article class="timeline-item ${item.kind}">
          <span class="timeline-index">${String(index + 1).padStart(2, '0')}</span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.detail)}</p>
          </div>
        </article>
      `,
    )
    .join('')
}

function renderAssistant() {
  const suggestion = getAssistantSuggestion()
  els.assistantTitle.textContent = suggestion.title
  els.assistantText.textContent = suggestion.text
}

function updateAtmosphere() {
  const hour = new Date().getHours()
  const period = hour < 11 ? 'morning' : hour < 17 ? 'day' : hour < 21 ? 'evening' : 'night'
  document.body.dataset.period = period
}

function getAdaptiveMode() {
  const hour = new Date().getHours()
  if (hour < 11) {
    return {
      label: 'Morning',
      description: 'Planning, timetable, and quick wins are emphasized this session.',
    }
  }
  if (hour < 17) {
    return {
      label: 'Day',
      description: 'Focus on tasks, progress, and the next important deadline.',
    }
  }
  if (hour < 21) {
    return {
      label: 'Evening',
      description: 'Review, deep work, and wrap-up suggestions are prioritized.',
    }
  }
  return {
    label: 'Night',
    description: 'The UI shifts toward reflection, light review, and tomorrow prep.',
  }
}

function getTimelineItems() {
  const openTasks = state.tasks.filter((task) => !task.completed)
  const sorted = [...openTasks].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
  const overdue = sorted.filter((task) => Date.now() - Number(task.createdAt) > 3 * 24 * 60 * 60 * 1000)
  const nextTask = sorted[0]
  const laterTask = sorted[1]

  return [
    {
      kind: 'now',
      title: nextTask ? nextTask.title : 'Nothing urgent',
      detail: nextTask ? `Start ${nextTask.category.toLowerCase()} work now.` : 'Take a breath, then open your notes.',
    },
    {
      kind: 'next',
      title: laterTask ? laterTask.title : 'Review block',
      detail: laterTask ? `After that, move to ${laterTask.category.toLowerCase()}.` : 'Spend 10 minutes reviewing the day.',
    },
    {
      kind: 'later',
      title: overdue.length ? `${overdue.length} overdue task${overdue.length === 1 ? '' : 's'}` : 'Light admin',
      detail: overdue.length ? `You should clear ${overdue[0].title} first.` : 'Reserve a short block for planning.',
    },
  ]
}

function getAssistantSuggestion() {
  const mode = getAdaptiveMode().label
  return {
    title: `Suggested next step for ${mode.toLowerCase()} mode`,
    text: 'Open your next task and start with a tiny first step.',
  }
}

function refreshAssistant() {
  renderAssistant()
  showToast('Suggestion refreshed')
}

function handlePointerMove(event) {
  const x = (event.clientX / window.innerWidth) * 100
  const y = (event.clientY / window.innerHeight) * 100
  document.body.style.setProperty('--cursor-x', x.toFixed(2))
  document.body.style.setProperty('--cursor-y', y.toFixed(2))
}

function capitalize(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1)
}

function renderTasks() {
  const priorityWeight = { high: 3, medium: 2, low: 1 }
  const tasks = [...state.tasks].sort((a, b) => {
    const diff = priorityWeight[b.priority] - priorityWeight[a.priority]
    return diff || Number(b.createdAt) - Number(a.createdAt)
  })
  els.taskCountPill.textContent = `${tasks.length} item${tasks.length === 1 ? '' : 's'}`
  els.taskList.innerHTML = tasks.length
    ? tasks
        .map(
          (task) => {
            const overdue = !task.completed && Date.now() - Number(task.createdAt) > 3 * 24 * 60 * 60 * 1000
            return `
            <article class="task-item ${task.completed ? 'done' : ''} ${overdue ? 'overdue' : ''}">
              <label class="task-check">
                <input type="checkbox" data-action="toggle" data-id="${task.id}" ${task.completed ? 'checked' : ''} />
                <span>${escapeHtml(task.title)}</span>
              </label>
              <div class="task-meta">
                <span class="category ${task.category.toLowerCase()}">${task.category}</span>
                <span class="category priority ${task.priority}">${capitalize(task.priority)}</span>
                <div class="task-actions">
                  <button type="button" class="icon-button" data-action="edit" data-id="${task.id}">Edit</button>
                  <button type="button" class="icon-button danger" data-action="delete" data-id="${task.id}">Delete</button>
                </div>
              </div>
            </article>
          `
          },
        )
        .join('')
    : '<div class="empty-state">Add a task to get started.</div>'
}

function renderTimer() {
  const total = state.timer.mode === 'work' ? 25 * 60 : 5 * 60
  const remaining = Math.max(0, state.timer.remaining)
  const progress = 1 - remaining / total
  els.timerModePill.textContent = state.timer.mode === 'work' ? 'Work' : 'Break'
  els.timerValue.textContent = formatDuration(remaining)
  els.timerLabel.textContent = state.timer.running ? 'Session in progress' : state.timer.mode === 'work' ? 'Ready to focus' : 'Take a short break'
  els.timerRing.style.setProperty('--progress', String(Math.max(0, Math.min(1, progress))))
  els.timerToggleBtn.textContent = state.timer.running ? 'Pause' : 'Start'
  els.timerRing.dataset.mode = state.timer.mode
}

function renderNotes() {
  if (document.activeElement !== els.notesInput) {
    els.notesInput.value = state.notes
  }
  els.notesCount.textContent = `${state.notes.length} chars`
}

function renderTimetable() {
  const header = ['Time', ...DAYS].map((label) => `<div class="table-head">${label}</div>`).join('')
  const rows = PERIODS.map((period, index) => {
    const cells = DAYS.map(
      (day) => `
        <label class="schedule-cell">
          <span class="sr-only">${day} ${period.label}</span>
          <input
            type="text"
            maxlength="30"
            value="${escapeAttr(state.timetable[day][index] ?? '')}"
            data-day="${day}"
            data-period="${index}"
            placeholder="${period.label}"
          />
        </label>
      `,
    ).join('')

    return `
      <div class="table-row">
        <div class="time-cell">
          <strong>${period.label}</strong>
          <span>${period.time}</span>
        </div>
        ${cells}
      </div>
    `
  }).join('')

  els.timetableGrid.innerHTML = `<div class="table-grid">${header}</div>${rows}`

  els.timetableGrid.querySelectorAll('input[data-day]').forEach((input) => {
    input.addEventListener('input', (event) => {
      const target = event.currentTarget
      const day = target.dataset.day
      const period = Number(target.dataset.period)
      state.timetable[day][period] = target.value
      saveState()
      renderOverview()
      renderCalendar()
      renderChart()
    })
  })
}

function renderCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = startOffset + daysInMonth
  const cells = []
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)

  els.monthLabel.textContent = monthName

  for (let i = 0; i < totalCells; i += 1) {
    const day = i - startOffset + 1
    if (day < 1) {
      cells.push('<div class="calendar-cell muted"></div>')
      continue
    }

    const date = new Date(year, month, day)
    const key = todayKey(date)
    const stats = state.stats[key] ?? { completedTasks: 0, focusMinutes: 0, focusSessions: 0 }
    const isToday = key === todayKey()
    const hasActivity = stats.completedTasks > 0 || stats.focusMinutes > 0

    cells.push(`
      <div class="calendar-cell ${isToday ? 'today' : ''} ${hasActivity ? 'active' : ''}">
        <strong>${day}</strong>
        <span>${stats.focusMinutes ? `${stats.focusMinutes}m` : stats.completedTasks ? `${stats.completedTasks} task${stats.completedTasks === 1 ? '' : 's'}` : ''}</span>
      </div>
    `)
  }

  els.calendarGrid.innerHTML = cells.join('')
}

function renderChart() {
  const days = lastSevenDays().map((date) => ({
    key: todayKey(date),
    label: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
    stats: state.stats[todayKey(date)] ?? { completedTasks: 0, focusMinutes: 0, focusSessions: 0 },
  }))
  const max = Math.max(25, ...days.map((day) => day.stats.focusMinutes + day.stats.completedTasks * 10))

  els.chartBars.innerHTML = days
    .map((day) => {
      const value = day.stats.focusMinutes + day.stats.completedTasks * 10
      const height = Math.max(12, (value / max) * 100)
      return `
        <div class="bar-group" title="${day.label}: ${day.stats.focusMinutes} min, ${day.stats.completedTasks} task${day.stats.completedTasks === 1 ? '' : 's'}">
          <div class="bar-track">
            <div class="bar-fill" style="height:${height}%"></div>
          </div>
          <span>${day.label}</span>
        </div>
      `
    })
    .join('')
}

function renderFocusOverlay() {
  els.focusOverlayText.textContent = state.focusMode.quote || QUOTES[state.quoteIndex % QUOTES.length].text
  const remaining = state.focusSession.running ? state.focusSession.remaining : state.focusSession.duration
  els.focusOverlayTimer.textContent = formatHms(remaining)
  els.focusSessionLabel.textContent = formatHms(state.focusSession.duration)
  els.focusStatusLabel.textContent = state.focusSession.running ? 'In progress' : 'Ready'
  els.focusOverlayTasks.textContent = String(state.tasks.filter((task) => !task.completed).length)
  els.focusThemeSelect.value = state.focusMode.theme
  els.focusAlarmSelect.value = state.focusMode.alarm
  els.focusAutoBreakSwitch.setAttribute('aria-pressed', String(state.focusMode.autoBreak))
  els.focusQuoteInput.value = state.focusMode.quote || ''
  setFocusInputsFromSettings(state.focusSettings)
  els.focusStartBtn.textContent = state.focusSession.running ? 'Restart focus' : 'Start focus'
  els.focusPauseBtn.textContent = state.focusSession.running ? 'Pause' : 'Reset'
  document.body.dataset.focusTheme = state.focusMode.theme
}

function renderTaskHistory() {
  const items = state.taskHistory.slice(0, 8)
  if (!items.length) {
    els.taskHistoryList.innerHTML = '<div class="empty-state">Task activity will appear here.</div>'
    return
  }

  els.taskHistoryList.innerHTML = items
    .map(
      (entry) => `
        <article class="history-item">
          <div>
            <strong>${escapeHtml(entry.title)}</strong>
            <p>${escapeHtml(entry.detail)}</p>
          </div>
          <span>${formatRelativeTime(entry.at)}</span>
        </article>
      `,
    )
    .join('')
}

function handleTaskSubmit(event) {
  event.preventDefault()
  const title = els.taskTitle.value.trim()
  const category = els.taskCategory.value
  const priority = els.taskPriority.value

  if (!title) return

  const taskId = els.taskId.value
  if (taskId) {
    const task = state.tasks.find((item) => item.id === taskId)
    if (task) {
      const before = task.title
      task.title = title
      task.category = category
      task.priority = priority
      pushTaskHistory('edited', title, `Edited from ${before}`)
    }
    showToast('Task updated')
  } else {
    state.tasks.unshift({
      id: crypto.randomUUID(),
      title,
      category,
      priority,
      completed: false,
      createdAt: Date.now(),
    })
    pushTaskHistory('created', title, `Added to ${category} (${priority})`)
    showToast('Task added')
  }

  clearTaskForm()
  saveState()
  renderAll()
}

function handleTaskListClick(event) {
  const button = event.target.closest('button, input[type="checkbox"]')
  if (!button) return

  const id = button.dataset.id
  const task = state.tasks.find((item) => item.id === id)
  if (!task) return

  const action = button.dataset.action
  if (action === 'toggle' || button.type === 'checkbox') {
    const previous = task.completed
    task.completed = button.checked
    if (task.completed && !previous) {
      bumpDailyStat('completedTasks', 1)
      registerActiveDay()
      pushTaskHistory('completed', task.title, 'Marked as complete')
      showToast('Task completed')
    } else if (!task.completed && previous) {
      bumpDailyStat('completedTasks', -1)
      pushTaskHistory('reopened', task.title, 'Marked as incomplete')
    }
  }

  if (action === 'edit') {
    els.taskId.value = task.id
    els.taskTitle.value = task.title
    els.taskCategory.value = task.category
    els.taskPriority.value = task.priority ?? 'medium'
    els.taskSubmitBtn.textContent = 'Save task'
    els.taskTitle.focus()
    return
  }

  if (action === 'delete') {
    pushTaskHistory('deleted', task.title, 'Removed from task list')
    state.tasks = state.tasks.filter((item) => item.id !== id)
    showToast('Task deleted')
  }

  saveState()
  renderAll()
}

function handleNotesInput() {
  state.notes = els.notesInput.value
  saveState()
  renderNotes()
}

function clearTaskForm() {
  els.taskId.value = ''
  els.taskForm.reset()
  els.taskPriority.value = 'medium'
  els.taskSubmitBtn.textContent = 'Add task'
  els.taskTitle.focus()
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark'
  registerActiveDay()
  syncTheme()
  saveState()
  renderTheme()
  showToast(`${state.theme === 'dark' ? 'Dark' : 'Light'} mode enabled`)
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled
  saveState()
  renderTheme()
  showToast(`Sound ${state.soundEnabled ? 'on' : 'off'}`)
}

function updateAppearance() {
  state.appearance = {
    accent: els.accentSelect.value,
    density: els.densitySelect.value,
    liquid: els.liquidSelect.value,
  }
  saveState()
  renderTheme()
}

function syncTheme() {
  els.body.dataset.theme = state.theme
}

function syncThemeSwitches() {
  els.themeSwitch.setAttribute('aria-pressed', String(state.theme === 'dark'))
  els.soundSwitch.setAttribute('aria-pressed', String(state.soundEnabled))
}

function toggleTimer() {
  if (state.timer.running) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function startTimer() {
  state.timer.running = true
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = window.setInterval(tickTimer, 1000)
  showToast('Timer started')
  saveState()
  renderTimer()
}

function pauseTimer(silent = false) {
  state.timer.running = false
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = null
  if (!silent) showToast('Timer paused')
  saveState()
  renderTimer()
}

function resetTimer(mode = 'work') {
  state.timer.mode = mode
  state.timer.remaining = mode === 'work' ? 25 * 60 : 5 * 60
  state.timer.running = false
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = null
  saveState()
  renderAll()
}

function tickTimer() {
  state.timer.remaining -= 1
  if (state.timer.remaining <= 0) {
    completeTimerPhase()
    return
  }

  saveState()
  renderTimer()
  renderFocusOverlay()
}

function completeTimerPhase() {
  pauseTimer(true)

  if (state.timer.mode === 'work') {
    bumpDailyStat('focusMinutes', 25)
    bumpDailyStat('focusSessions', 1)
    playTone()
    state.timer.mode = 'break'
    state.timer.remaining = 5 * 60
    showToast('Work session complete. Break time.')
  } else {
    playTone(660)
    state.timer.mode = 'work'
    state.timer.remaining = 25 * 60
    showToast('Break complete. Ready for another round.')
  }

  registerActiveDay()
  saveState()
  renderAll()
}

function enterFocusMode() {
  els.focusOverlay.hidden = false
  document.body.classList.add('focus-mode')
  els.focusExitBanner.hidden = false
  if (!focusHistoryPushed) {
    history.pushState({ focusMode: true }, '', location.href)
    focusHistoryPushed = true
  }
  renderFocusOverlay()
  showToast('Focus mode enabled')
}

function exitFocusMode() {
  pauseFocusSession(true)
  forceCloseFocusMode()
}

function forceCloseFocusMode(silent = false) {
  els.focusOverlay.hidden = true
  document.body.classList.remove('focus-mode')
  els.focusExitBanner.hidden = true
  if (!silent && history.state?.focusMode) {
    history.replaceState({}, '', location.href)
    focusHistoryPushed = false
  }
}

function syncFocusDurationFromInputs() {
  const settings = readFocusSettings()
  const duration = focusSettingsToSeconds(settings)
  state.focusSettings = settings
  state.focusSession.duration = duration
  if (!state.focusSession.running) {
    state.focusSession.remaining = duration
  }
  saveState()
  renderFocusOverlay()
}

function applyFocusPreset(totalSeconds) {
  const settings = secondsToFocusSettings(totalSeconds)
  state.focusSettings = settings
  state.focusSession.duration = totalSeconds
  state.focusSession.remaining = totalSeconds
  saveState()
  renderFocusOverlay()
  showToast(`Focus preset set to ${formatHms(totalSeconds)}`)
}

function startFocusSession() {
  const settings = readFocusSettings()
  const duration = focusSettingsToSeconds(settings)
  state.focusSettings = settings
  state.focusSession.duration = duration
  state.focusSession.remaining = duration
  state.focusSession.running = true
  if (focusInterval) clearInterval(focusInterval)
  focusInterval = window.setInterval(tickFocusSession, 1000)
  saveState()
  renderFocusOverlay()
  showToast('Focus session started')
}

function pauseFocusSession(silent = false) {
  state.focusSession.running = false
  if (focusInterval) clearInterval(focusInterval)
  focusInterval = null
  if (!silent) showToast('Focus session paused')
  saveState()
  renderFocusOverlay()
}

function tickFocusSession() {
  state.focusSession.remaining -= 1
  if (state.focusSession.remaining <= 0) {
    completeFocusSession()
    return
  }

  saveState()
  renderFocusOverlay()
}

function completeFocusSession() {
  pauseFocusSession(true)
  state.focusSession.remaining = state.focusSession.duration
  bumpDailyStat('focusMinutes', Math.max(1, Math.ceil(state.focusSession.duration / 60)))
  bumpDailyStat('focusSessions', 1)
  playFocusAlarm()
  if (!state.focusMode.autoBreak) {
    renderFocusOverlay()
    showToast('Focus session complete')
    return
  }
  saveState()
  renderAll()
  showToast('Focus session complete')
}

function focusInputSeconds() {
  return focusSettingsToSeconds(readFocusSettings())
}

function readFocusSettings() {
  return {
    hours: clampNumber(els.focusHours.value, 0, 12),
    minutes: clampNumber(els.focusMinutes.value, 0, 59),
    seconds: clampNumber(els.focusSeconds.value, 0, 59),
  }
}

function normalizeFocusSettings(settings, fallbackDuration = 25 * 60) {
  if (settings && typeof settings === 'object') {
    return {
      hours: clampNumber(settings.hours ?? 0, 0, 12),
      minutes: clampNumber(settings.minutes ?? 25, 0, 59),
      seconds: clampNumber(settings.seconds ?? 0, 0, 59),
    }
  }

  return secondsToFocusSettings(fallbackDuration)
}

function normalizeAppearance(appearance) {
  const allowedAccent = ['ocean', 'aurora', 'plum', 'sunrise']
  const allowedDensity = ['roomy', 'balanced', 'compact']
  const allowedLiquid = ['flow', 'drift', 'wave']

  return {
    accent: allowedAccent.includes(appearance?.accent) ? appearance.accent : 'ocean',
    density: allowedDensity.includes(appearance?.density) ? appearance.density : 'roomy',
    liquid: allowedLiquid.includes(appearance?.liquid) ? appearance.liquid : 'flow',
  }
}

function normalizeHistoryItem(entry) {
  if (!entry || typeof entry !== 'object') return null
  return {
    id: String(entry.id ?? crypto.randomUUID()),
    action: String(entry.action ?? 'updated'),
    title: String(entry.title ?? 'Task'),
    detail: String(entry.detail ?? ''),
    at: String(entry.at ?? new Date().toISOString()),
  }
}

function secondsToFocusSettings(duration) {
  const safeDuration = Math.max(5, Number(duration) || 0)
  return {
    hours: Math.floor(safeDuration / 3600),
    minutes: Math.floor((safeDuration % 3600) / 60),
    seconds: safeDuration % 60,
  }
}

function focusSettingsToSeconds(settings) {
  const total = settings.hours * 3600 + settings.minutes * 60 + settings.seconds
  return Math.max(5, total)
}

function pushTaskHistory(action, title, detail) {
  state.taskHistory.unshift({
    id: crypto.randomUUID(),
    action,
    title,
    detail,
    at: new Date().toISOString(),
  })
  state.taskHistory = state.taskHistory.slice(0, 20)
}

function setFocusInputsFromSettings(settings) {
  els.focusHours.value = String(settings.hours)
  els.focusMinutes.value = String(settings.minutes)
  els.focusSeconds.value = String(settings.seconds)
}

function resetAllData() {
  if (!confirm('Reset all Student Life OS data?')) return
  const fresh = defaultState()
  Object.assign(state, fresh)
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = null
  if (focusInterval) clearInterval(focusInterval)
  focusInterval = null
  focusHistoryPushed = false
  syncTheme()
  syncThemeSwitches()
  saveState()
  clearTaskForm()
  renderAll()
  showToast('All data reset')
}

function normalizeFocusMode(value) {
  const allowedThemes = ['aurora', 'ocean', 'plum', 'sunrise']
  const allowedAlarms = ['peaceful', 'chime', 'silent']
  return {
    theme: allowedThemes.includes(value?.theme) ? value.theme : 'aurora',
    alarm: allowedAlarms.includes(value?.alarm) ? value.alarm : 'peaceful',
    autoBreak: value?.autoBreak !== false,
    quote: String(value?.quote || 'Breathe, focus, and finish one useful thing.'),
  }
}

function updateFocusMode() {
  state.focusMode.theme = els.focusThemeSelect.value
  state.focusMode.alarm = els.focusAlarmSelect.value
  saveState()
  renderFocusOverlay()
}

function toggleAutoBreak() {
  state.focusMode.autoBreak = !state.focusMode.autoBreak
  saveState()
  renderFocusOverlay()
}

function saveFocusQuote() {
  const quote = els.focusQuoteInput.value.trim()
  state.focusMode.quote = quote || 'Breathe, focus, and finish one useful thing.'
  saveState()
  renderFocusOverlay()
  showToast('Focus quote saved')
}

function registerActiveDay() {
  const today = todayKey()
  if (state.lastActiveDate === today) return
  if (state.lastActiveDate && isYesterday(state.lastActiveDate, today)) {
    state.streak += 1
  } else if (!state.lastActiveDate) {
    state.streak = Math.max(1, state.streak)
  } else {
    state.streak = 1
  }
  state.lastActiveDate = today
}

function bumpDailyStat(field, amount) {
  const entry = getTodayStats()
  entry[field] = Math.max(0, (entry[field] ?? 0) + amount)
  state.stats[todayKey()] = entry
}

function getTodayStats() {
  const key = todayKey()
  if (!state.stats[key]) {
    state.stats[key] = { completedTasks: 0, focusMinutes: 0, focusSessions: 0 }
  }
  return state.stats[key]
}

function getNextClass(now) {
  const dayIndex = (now.getDay() + 6) % 7
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const todaysSubjects = state.timetable[DAYS[dayIndex]]

  for (let i = 0; i < PERIODS.length; i += 1) {
    const slotStart = [8 * 60, 10 * 60, 13 * 60, 16 * 60][i]
    if (slotStart > currentMinutes && todaysSubjects[i]) {
      return {
        title: todaysSubjects[i],
        subtitle: `Today, ${PERIODS[i].time}`,
      }
    }
  }

  for (let d = 1; d <= 7; d += 1) {
    const nextDay = DAYS[(dayIndex + d) % 7]
    const row = state.timetable[nextDay]
    const filled = row.find((item) => item)
    if (filled) {
      return {
        title: filled,
        subtitle: d === 1 ? `Tomorrow, ${nextDay}` : `${nextDay} next week`,
      }
    }
  }

  return { title: 'Open slot', subtitle: 'Update your timetable' }
}

function randomQuoteIndex() {
  let next = Math.floor(Math.random() * QUOTES.length)
  if (next === state.quoteIndex) next = (next + 1) % QUOTES.length
  return next
}

function getGreeting(date) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function lastSevenDays() {
  const days = []
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date)
  }
  return days
}

function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isYesterday(earlierKey, laterKey) {
  const earlier = new Date(`${earlierKey}T00:00:00`)
  const later = new Date(`${laterKey}T00:00:00`)
  const diff = (later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24)
  return Math.round(diff) === 1
}

function formatDuration(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${secs}`
}

function formatHms(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.max(1, Math.round(diff / 60000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  return `${hours}h ago`
}

function clampNumber(value, min, max) {
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) return min
  return Math.min(max, Math.max(min, parsed))
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttr(value) {
  return escapeHtml(value)
}

function playTone(frequency = 523) {
  if (!state.soundEnabled) return
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return

  audioContext ??= new AudioCtx()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.value = 0.0001
  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.start()
  gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3)
  oscillator.stop(audioContext.currentTime + 0.32)
}

function playFocusAlarm() {
  if (!state.soundEnabled || state.focusMode.alarm === 'silent') return
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return

  audioContext ??= new AudioCtx()
  const start = audioContext.currentTime
  const notes =
    state.focusMode.alarm === 'chime'
      ? [659.25, 783.99, 987.77]
      : [523.25, 659.25, 783.99, 659.25, 523.25]

  notes.forEach((frequency, index) => {
    const noteStart = start + index * 0.24
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.0001, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.06, noteStart + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.22)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteStart + 0.24)
  })
}

function showToast(message) {
  els.toast.textContent = message
  els.toast.classList.add('show')
  window.clearTimeout(showToast._timer)
  showToast._timer = window.setTimeout(() => els.toast.classList.remove('show'), 1800)
}

function hideLoader() {
  window.setTimeout(() => loader.classList.add('hide'), 500)
  window.setTimeout(() => loader.remove(), 1200)
}
