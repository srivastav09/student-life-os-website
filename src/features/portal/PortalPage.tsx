import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  CalendarOff,
  Database,
  FolderOpen,
  GraduationCap,
  Grid2X2,
  LayoutGrid,
  Layers3,
  Menu,
  MessageSquareWarning,
  PanelTop,
  Shield,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState, type ElementType, type ReactNode } from 'react'

const sectionsByBranch: Record<string, string[]> = {
  CSE: ['A', 'B', 'C', 'D', 'E', 'F'],
  CSM: ['A', 'B', 'C'],
  'CSE AI': ['A', 'B'],
  'CSE AIDS': ['A', 'B'],
}

const branchCards = [
  { key: 'CSE', full: 'Computer Science & Engineering', icon: PanelTop, accent: 'from-indigo-500 to-blue-600' },
  { key: 'CSM', full: 'CS & Machine Learning', icon: Database, accent: 'from-purple-500 to-fuchsia-600' },
  { key: 'CSE AI', full: 'CS & Artificial Intelligence', icon: Brain, accent: 'from-cyan-500 to-indigo-600' },
  { key: 'CSE AIDS', full: 'AI & Data Science', icon: Layers3, accent: 'from-emerald-500 to-teal-600' },
] as const

const adminTabs = [
  { id: 'upload', label: 'Upload Material', icon: Upload },
  { id: 'manage', label: 'Manage Content', icon: Grid2X2 },
  { id: 'update', label: 'Post Update', icon: Bell },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays },
] as const

type BranchKey = 'CSE' | 'CSM' | 'CSE AI' | 'CSE AIDS'

type BranchMaterial = {
  id: string
  title: string
  type: string
  detail: string
  meta: string
}

type BranchSchedule = {
  id: string
  day: string
  time: string
  subject: string
  room: string
}

type BranchUpdate = {
  id: string
  title: string
  detail: string
}

type BranchContent = {
  materials: BranchMaterial[]
  schedule: BranchSchedule[]
  updates: BranchUpdate[]
}

type PortalContent = Record<BranchKey, BranchContent>

const PORTAL_STORAGE_KEY = 'student-life-os.portal-content.v1'

const branchDirectory: PortalContent = {
  CSE: {
    materials: [
      { id: 'cse-m1', title: 'Data Structures Quick Notes', type: 'Notes', detail: 'Arrays, linked lists, stacks, and practice prompts for revision.', meta: 'Sem 2' },
      { id: 'cse-m2', title: 'DBMS Revision Pack', type: 'Previous Papers', detail: 'Normalization, SQL, and exam-ready diagrams in one place.', meta: 'Sem 3' },
    ],
    schedule: [
      { id: 'cse-s1', day: 'Mon', time: '09:00 - 10:00', subject: 'DBMS', room: 'C-204' },
      { id: 'cse-s2', day: 'Tue', time: '11:00 - 12:00', subject: 'OS Lab', room: 'Lab-1' },
    ],
    updates: [
      { id: 'cse-u1', title: 'Tutorial moved to Lab-2', detail: 'The Thursday DBMS tutorial now runs in Lab-2 at 2 PM.' },
      { id: 'cse-u2', title: 'Assignment reminder', detail: 'Upload the DS mini-project draft before Friday evening.' },
    ],
  },
  CSM: {
    materials: [
      { id: 'csm-m1', title: 'ML Foundations Sheet', type: 'Notes', detail: 'Core formulas, model intuition, and quick revision summaries.', meta: 'Sem 1' },
      { id: 'csm-m2', title: 'Probability Practice Set', type: 'Assignments', detail: 'Focused problems on distributions, mean, variance, and sampling.', meta: 'Sem 2' },
    ],
    schedule: [
      { id: 'csm-s1', day: 'Wed', time: '10:00 - 11:00', subject: 'Linear Algebra', room: 'A-101' },
      { id: 'csm-s2', day: 'Fri', time: '13:00 - 14:00', subject: 'Machine Learning', room: 'Seminar Hall' },
    ],
    updates: [
      { id: 'csm-u1', title: 'Lab checklist uploaded', detail: 'The new ML lab checklist is ready for the next cycle.' },
      { id: 'csm-u2', title: 'Mentor hour confirmed', detail: 'Mentor hour remains at 4 PM every Wednesday.' },
    ],
  },
  'CSE AI': {
    materials: [
      { id: 'ai-m1', title: 'AI Concepts Starter Kit', type: 'Syllabus', detail: 'Search, inference, and agent fundamentals with clean examples.', meta: 'Sem 1' },
      { id: 'ai-m2', title: 'Python for AI Lab', type: 'Notes', detail: 'Notebook-friendly snippets for data prep, plots, and experiments.', meta: 'Sem 2' },
    ],
    schedule: [
      { id: 'ai-s1', day: 'Mon', time: '10:00 - 11:00', subject: 'Python', room: 'Lab-3' },
      { id: 'ai-s2', day: 'Thu', time: '14:00 - 15:00', subject: 'AI Theory', room: 'C-301' },
    ],
    updates: [
      { id: 'ai-u1', title: 'Project topics shared', detail: 'The department shared a fresh list of AI mini-project topics.' },
      { id: 'ai-u2', title: 'Workshop registration open', detail: 'Register for the weekend model-building workshop before seats fill.' },
    ],
  },
  'CSE AIDS': {
    materials: [
      { id: 'aids-m1', title: 'Data Visualization Pack', type: 'Notes', detail: 'Charts, dashboards, and design tips for clean presentation.', meta: 'Sem 2' },
      { id: 'aids-m2', title: 'Statistics Crash Course', type: 'Syllabus', detail: 'Probability, sampling, and hypothesis testing in a compact format.', meta: 'Sem 3' },
    ],
    schedule: [
      { id: 'aids-s1', day: 'Tue', time: '09:00 - 10:00', subject: 'Statistics', room: 'D-102' },
      { id: 'aids-s2', day: 'Sat', time: '11:00 - 12:00', subject: 'Data Science Lab', room: 'Lab-4' },
    ],
    updates: [
      { id: 'aids-u1', title: 'Dashboard review scheduled', detail: 'The next visualization review is on Saturday after class.' },
      { id: 'aids-u2', title: 'Resource bundle refreshed', detail: 'The data science resource pack has been updated for this term.' },
    ],
  },
}

const createDefaultPortalContent = (): PortalContent => structuredClone(branchDirectory)

function createPortalId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

const portalMotion = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
}

function GlassCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ eyebrow, title, subtitle, icon: Icon }: { eyebrow: string; title: string; subtitle: string; icon: ElementType }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300/90">
        <Icon className="h-4 w-4" /> {eyebrow}
      </div>
      <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
        {title.split(' ').slice(0, -1).join(' ')} <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">{title.split(' ').slice(-1)[0]}</span>
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{subtitle}</p>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description }: { icon: ElementType; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 px-6 py-12 text-center">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-indigo-300">
        <Icon className="h-7 w-7" />
      </div>
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  )
}

function PortalShell({ children, onOpenAdmin }: { children: ReactNode; onOpenAdmin: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    ['Home', '#home'],
    ['Branches', '#branches'],
    ['Materials', '#materials'],
    ['Timetable', '#timetable'],
    ['Updates', '#updates'],
  ] as const

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_26%),linear-gradient(180deg,#050816_0%,#050816_100%)] text-slate-100">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-indigo-300/80">Smart College Portal</p>
              <p className="text-sm font-semibold text-white">Modern Academic Resource Platform</p>
            </div>
          </a>
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map(([label, href]) => (
              <a key={label} href={href} className="relative text-sm font-medium text-slate-300 transition hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-indigo-400 after:to-violet-400 after:transition-all hover:after:w-full">
                {label}
              </a>
            ))}
            <button onClick={onOpenAdmin} className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-500/25">
              <Shield className="h-4 w-4" /> Admin
            </button>
          </nav>
          <button onClick={() => setMenuOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 md:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {menuOpen ? (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10 md:hidden">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6">
                {navItems.map(([label, href]) => (
                  <a key={label} href={href} onClick={() => setMenuOpen(false)} className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-200">
                    {label}
                  </a>
                ))}
                <button onClick={onOpenAdmin} className="inline-flex w-fit items-center gap-2 rounded-2xl bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-100">
                  <Shield className="h-4 w-4" /> Admin
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <main className="pt-24">{children}</main>
    </div>
  )
}

export default function PortalPage() {
  const reducedMotion = useReducedMotion()
  const [selectedBranch, setSelectedBranch] = useState<(typeof branchCards)[number]['key']>('CSE')
  const [selectedSection, setSelectedSection] = useState('A')
  const [branchModalOpen, setBranchModalOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminTab, setAdminTab] = useState<(typeof adminTabs)[number]['id']>('upload')
  const [portalData, setPortalData] = useState<PortalContent>(() => createDefaultPortalContent())
  const [adminBranch, setAdminBranch] = useState<BranchKey>('CSE')
  const [feedback, setFeedback] = useState('')
  const [materialDraft, setMaterialDraft] = useState({ title: '', type: 'Notes', meta: 'Sem 1', detail: '' })
  const [updateDraft, setUpdateDraft] = useState({ title: '', detail: '' })
  const [scheduleDraft, setScheduleDraft] = useState({ day: 'Mon', time: '09:00 - 10:00', subject: '', room: '' })

  useEffect(() => {
    setSelectedSection(sectionsByBranch[selectedBranch][0])
  }, [selectedBranch])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(PORTAL_STORAGE_KEY)
      if (!stored) return
      const parsed = JSON.parse(stored) as PortalContent
      setPortalData(parsed)
    } catch {
      setPortalData(createDefaultPortalContent())
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(portalData))
  }, [portalData])

  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(''), 2200)
    return () => window.clearTimeout(timer)
  }, [feedback])

  const branchInfo = useMemo(
    () => branchCards.find((branch) => branch.key === selectedBranch) ?? branchCards[0],
    [selectedBranch],
  )

  const branchContent = useMemo(() => portalData[selectedBranch as BranchKey], [portalData, selectedBranch])
  const adminContent = portalData[adminBranch]
  const portalStats = useMemo(
    () => [
      { label: 'Materials', value: String(Object.values(portalData).reduce((count, branch) => count + branch.materials.length, 0)) },
      { label: 'Branches', value: '4' },
      { label: 'Updates', value: String(Object.values(portalData).reduce((count, branch) => count + branch.updates.length, 0)) },
      { label: 'Semesters', value: '8' },
    ],
    [portalData],
  )

  const sectionTabs = sectionsByBranch[selectedBranch] ?? []

  const savePortalBranch = (branch: BranchKey, update: (content: BranchContent) => BranchContent) => {
    setPortalData((state) => ({
      ...state,
      [branch]: update(state[branch]),
    }))
  }

  const addMaterial = () => {
    if (!materialDraft.title.trim() || !materialDraft.detail.trim()) return
    savePortalBranch(adminBranch, (content) => ({
      ...content,
      materials: [
        { id: createPortalId('material'), title: materialDraft.title.trim(), type: materialDraft.type.trim() || 'Notes', meta: materialDraft.meta.trim() || 'Sem 1', detail: materialDraft.detail.trim() },
        ...content.materials,
      ],
    }))
    setMaterialDraft({ title: '', type: 'Notes', meta: 'Sem 1', detail: '' })
    setFeedback('Material saved locally.')
  }

  const addUpdate = () => {
    if (!updateDraft.title.trim() || !updateDraft.detail.trim()) return
    savePortalBranch(adminBranch, (content) => ({
      ...content,
      updates: [
        { id: createPortalId('update'), title: updateDraft.title.trim(), detail: updateDraft.detail.trim() },
        ...content.updates,
      ],
    }))
    setUpdateDraft({ title: '', detail: '' })
    setFeedback('Announcement posted locally.')
  }

  const addSchedule = () => {
    if (!scheduleDraft.subject.trim() || !scheduleDraft.room.trim()) return
    savePortalBranch(adminBranch, (content) => ({
      ...content,
      schedule: [
        { id: createPortalId('slot'), day: scheduleDraft.day, time: scheduleDraft.time.trim(), subject: scheduleDraft.subject.trim(), room: scheduleDraft.room.trim() },
        ...content.schedule,
      ],
    }))
    setScheduleDraft({ day: 'Mon', time: '09:00 - 10:00', subject: '', room: '' })
    setFeedback('Timetable slot saved locally.')
  }

  const resetBranch = () => {
    setPortalData((state) => ({
      ...state,
      [adminBranch]: createDefaultPortalContent()[adminBranch],
    }))
    setFeedback(`Restored ${adminBranch} to defaults.`)
  }

  return (
    <PortalShell onOpenAdmin={() => setAdminOpen(true)}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <AnimatePresence>
        {branchModalOpen ? (
          <motion.div className="fixed inset-0 z-[60] overflow-auto bg-slate-950/95 px-4 py-6 backdrop-blur-xl sm:px-6 lg:px-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mx-auto max-w-6xl">
              <button onClick={() => setBranchModalOpen(false)} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200">
                <ArrowLeft className="h-4 w-4" /> Back to All Branches
              </button>
              <GlassCard className="p-6 sm:p-8">
                <div className="mb-8">
                  <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">{branchInfo.key}</h1>
                  <p className="mt-2 text-lg text-slate-400">{branchInfo.full}</p>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><BookOpen className="h-4 w-4 text-indigo-300" /> {branchContent.materials.length} Materials</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><CalendarDays className="h-4 w-4 text-violet-300" /> {branchContent.schedule.length} Timetables</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><Bell className="h-4 w-4 text-sky-300" /> {branchContent.updates.length} Updates</span>
                  </div>
                </div>

                <div className="mb-8 flex flex-wrap gap-2">
                  {sectionTabs.map((section) => (
                    <button
                      key={section}
                      onClick={() => setSelectedSection(section)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedSection === section ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
                    >
                      Section {section}
                    </button>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <section className="lg:col-span-3">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white"><BookOpen className="h-5 w-5 text-indigo-300" /> Study Materials</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {branchContent.materials.map((material) => (
                        <GlassCard key={material.title} className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.28em] text-indigo-300/80">{material.meta}</p>
                              <h3 className="mt-2 text-lg font-bold text-white">{material.title}</h3>
                            </div>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">{material.type}</span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-400">{material.detail}</p>
                        </GlassCard>
                      ))}
                    </div>
                  </section>
                  <section className="lg:col-span-3">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white"><CalendarDays className="h-5 w-5 text-violet-300" /> Timetables</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {branchContent.schedule.map((slot) => (
                        <GlassCard key={`${slot.day}-${slot.time}-${slot.subject}`} className="p-5">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-lg font-bold text-white">{slot.subject}</p>
                            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-200">{slot.day}</span>
                          </div>
                          <p className="mt-3 text-sm text-slate-400">{slot.time} • {slot.room}</p>
                        </GlassCard>
                      ))}
                    </div>
                  </section>
                  <section className="lg:col-span-3">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white"><Bell className="h-5 w-5 text-sky-300" /> Updates &amp; Announcements</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {branchContent.updates.map((update) => (
                        <GlassCard key={update.title} className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-500/10 text-sky-300">
                              <MessageSquareWarning className="h-4 w-4" />
                            </div>
                            <h3 className="text-lg font-bold text-white">{update.title}</h3>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-400">{update.detail}</p>
                        </GlassCard>
                      ))}
                    </div>
                  </section>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {adminOpen ? (
          <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/90 px-4 py-6 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GlassCard className="max-h-[90vh] w-full max-w-4xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600"><Shield className="h-5 w-5 text-white" /></div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Admin Control Panel</h3>
                      <p className="text-xs text-slate-400">Manage all portal content, stored in this browser</p>
                    </div>
                  </div>
                  <button onClick={() => setAdminOpen(false)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>

              <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-5 py-3 sm:px-6">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon
                  const active = adminTab === tab.id
                  return (
                    <button key={tab.id} onClick={() => setAdminTab(tab.id)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${active ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-300'}`}>
                      <Icon className="h-4 w-4" /> {tab.label}
                    </button>
                  )
                })}
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                  <p>Editing branch <span className="font-semibold text-white">{adminBranch}</span></p>
                  <select
                    value={adminBranch}
                    onChange={(event) => setAdminBranch(event.target.value as BranchKey)}
                    className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
                  >
                    {branchCards.map((branch) => (
                      <option key={branch.key} value={branch.key}>{branch.key}</option>
                    ))}
                  </select>
                </div>

                {feedback ? <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{feedback}</div> : null}

                {adminTab === 'manage' ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <GlassCard className="p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Materials</p>
                        <p className="mt-2 text-3xl font-black text-white">{adminContent.materials.length}</p>
                      </GlassCard>
                      <GlassCard className="p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Timetable slots</p>
                        <p className="mt-2 text-3xl font-black text-white">{adminContent.schedule.length}</p>
                      </GlassCard>
                      <GlassCard className="p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Updates</p>
                        <p className="mt-2 text-3xl font-black text-white">{adminContent.updates.length}</p>
                      </GlassCard>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-3">
                      <GlassCard className="p-4 lg:col-span-1">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">Materials</p>
                          <button type="button" onClick={resetBranch} className="text-xs font-semibold text-indigo-300 hover:text-indigo-200">Reset branch</button>
                        </div>
                        <div className="space-y-3">
                          {adminContent.materials.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-white">{item.title}</p>
                                  <p className="text-xs text-slate-400">{item.type} • {item.meta}</p>
                                </div>
                                <button type="button" onClick={() => savePortalBranch(adminBranch, (content) => ({ ...content, materials: content.materials.filter((entry) => entry.id !== item.id) }))} className="text-xs font-semibold text-rose-300 hover:text-rose-200">Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                      <GlassCard className="p-4 lg:col-span-1">
                        <p className="mb-3 text-sm font-semibold text-white">Timetable</p>
                        <div className="space-y-3">
                          {adminContent.schedule.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-white">{item.subject}</p>
                                  <p className="text-xs text-slate-400">{item.day} • {item.time} • {item.room}</p>
                                </div>
                                <button type="button" onClick={() => savePortalBranch(adminBranch, (content) => ({ ...content, schedule: content.schedule.filter((entry) => entry.id !== item.id) }))} className="text-xs font-semibold text-rose-300 hover:text-rose-200">Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                      <GlassCard className="p-4 lg:col-span-1">
                        <p className="mb-3 text-sm font-semibold text-white">Updates</p>
                        <div className="space-y-3">
                          {adminContent.updates.map((item) => (
                            <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-white">{item.title}</p>
                                  <p className="text-xs text-slate-400">{item.detail}</p>
                                </div>
                                <button type="button" onClick={() => savePortalBranch(adminBranch, (content) => ({ ...content, updates: content.updates.filter((entry) => entry.id !== item.id) }))} className="text-xs font-semibold text-rose-300 hover:text-rose-200">Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </div>
                  </div>
                ) : adminTab === 'upload' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Title *</span>
                      <input value={materialDraft.title} onChange={(event) => setMaterialDraft((draft) => ({ ...draft, title: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="Data Structures Unit 1" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Type *</span>
                      <input value={materialDraft.type} onChange={(event) => setMaterialDraft((draft) => ({ ...draft, type: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="Notes" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Semester *</span>
                      <input value={materialDraft.meta} onChange={(event) => setMaterialDraft((draft) => ({ ...draft, meta: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="Sem 1" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Description *</span>
                      <textarea value={materialDraft.detail} onChange={(event) => setMaterialDraft((draft) => ({ ...draft, detail: event.target.value }))} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="Short summary students can scan quickly." />
                    </label>
                    <button type="button" onClick={addMaterial} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white">
                      <Upload className="h-4 w-4" /> Save material locally
                    </button>
                  </div>
                ) : adminTab === 'update' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Title *</span>
                      <input value={updateDraft.title} onChange={(event) => setUpdateDraft((draft) => ({ ...draft, title: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="Class shifted to Lab-2" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Announcement *</span>
                      <textarea value={updateDraft.detail} onChange={(event) => setUpdateDraft((draft) => ({ ...draft, detail: event.target.value }))} rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="Write a short announcement students can act on." />
                    </label>
                    <button type="button" onClick={addUpdate} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white">
                      <Upload className="h-4 w-4" /> Post announcement locally
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Day *</span>
                      <select value={scheduleDraft.day} onChange={(event) => setScheduleDraft((draft) => ({ ...draft, day: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <option key={day} value={day}>{day}</option>)}
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Time *</span>
                      <input value={scheduleDraft.time} onChange={(event) => setScheduleDraft((draft) => ({ ...draft, time: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="09:00 - 10:00" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Subject *</span>
                      <input value={scheduleDraft.subject} onChange={(event) => setScheduleDraft((draft) => ({ ...draft, subject: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="DBMS" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Room *</span>
                      <input value={scheduleDraft.room} onChange={(event) => setScheduleDraft((draft) => ({ ...draft, room: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none" placeholder="C-204" />
                    </label>
                    <button type="button" onClick={addSchedule} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white">
                      <Upload className="h-4 w-4" /> Save timetable slot locally
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.section id="home" variants={portalMotion} initial={reducedMotion ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }} className="grid gap-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <GlassCard className="overflow-hidden p-6 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              Academic Year 2024-25 • Now Live
            </div>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-white sm:text-7xl">
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">Smart College</span>
              <br />Portal
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Your gateway to academic excellence — all study materials, timetables &amp; updates in one place.
            </p>
            <p className="mt-3 text-base font-semibold text-indigo-300">Department of Computer Science &amp; Engineering</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#materials" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5">
                Explore Materials <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#branches" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10">
                <LayoutGrid className="h-4 w-4" /> View Branches
              </a>
            </div>
          </GlassCard>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <GlassCard className="p-6">
              <Sparkles className="h-5 w-5 text-indigo-300" />
              <p className="mt-3 text-sm text-slate-400">Live announcement</p>
              <p className="mt-2 text-base leading-7 text-slate-200">
                📢 Welcome to the new semester! • Check out the latest study materials • Timetables have been updated • Stay tuned for more announcements
              </p>
            </GlassCard>
            <div className="grid gap-4 grid-cols-2">
              {portalStats.map((stat) => (
                <GlassCard key={stat.label} className="p-5 text-center">
                  <p className="text-4xl font-black bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="branches" variants={portalMotion} initial={reducedMotion ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.5 }} className="py-12">
          <SectionTitle eyebrow="Departments" title="Choose Your Branch" subtitle="Select your department to access branch-specific study materials, timetables, and resources." icon={LayoutGrid} />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {branchCards.map((branch, index) => {
              const Icon = branch.icon
              return (
                <motion.button
                  key={branch.key}
                  onClick={() => {
                    setSelectedBranch(branch.key)
                    setBranchModalOpen(true)
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 text-left shadow-2xl shadow-black/10 transition hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.06]"
                >
                  <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${branch.accent} shadow-lg shadow-indigo-500/20`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{branch.key}</h3>
                  <p className="mt-1 text-sm text-slate-400">{branch.full}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-300">
                    <Layers3 className="h-3.5 w-3.5" /> 0 resources
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        <div className="mx-auto my-10 h-px max-w-5xl bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

        <motion.section id="materials" variants={portalMotion} initial={reducedMotion ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="py-12">
          <div className="flex flex-col gap-6">
            <SectionTitle eyebrow="Resources" title="Study Materials" subtitle={`All resources for branch: ${selectedBranch}`} icon={BookOpen} />
            <div className="flex flex-wrap gap-2">
              {['All Sems', 'Sem 1', 'Sem 2'].map((item, index) => (
                <button key={item} className={`rounded-full px-4 py-2 text-sm font-medium transition ${index === 0 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                  {item}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {['All', 'Notes', 'Syllabus', 'Previous Papers', 'Assignments'].map((item, index) => (
                <button key={item} className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${index === 0 ? 'bg-indigo-500 text-white' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                  {index === 0 ? <BookOpen className="h-4 w-4" /> : null}
                  {item}
                </button>
              ))}
            </div>
            <EmptyState icon={FolderOpen} title="No materials found" description="The admin hasn't uploaded anything here yet." />
          </div>
        </motion.section>

        <div className="mx-auto my-10 h-px max-w-5xl bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

        <motion.section id="timetable" variants={portalMotion} initial={reducedMotion ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="py-12">
          <SectionTitle eyebrow="Schedule" title="Class Timetable" subtitle={`Timetables for ${selectedBranch}`} icon={CalendarDays} />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <EmptyState icon={CalendarOff} title="No timetable uploaded" description="Check back later or contact admin." />
            <GlassCard className="flex items-center justify-center p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-violet-300"><ClockWidget /></div>
                <p className="mt-4 text-lg font-semibold text-white">Focused scheduling</p>
                <p className="mt-2 text-sm text-slate-400">All eight semesters are represented in the portal, ready for future timetable uploads.</p>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <div className="mx-auto my-10 h-px max-w-5xl bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

        <motion.section id="updates" variants={portalMotion} initial={reducedMotion ? 'show' : 'hidden'} whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="py-12">
          <SectionTitle eyebrow="Notices" title="Latest Updates" subtitle="Important announcements and notices from the admin." icon={Bell} />
          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_0.7fr]">
            <EmptyState icon={MessageSquareWarning} title="No updates yet" description="Admin will post announcements here." />
            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300"><Sparkles className="h-5 w-5" /></div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Portal status</p>
                  <p className="text-lg font-bold text-white">Ready for academic content</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <p>• Smart College Portal</p>
                <p>• Department of Computer Science &amp; Engineering</p>
                <p>• 4 branches, 8 semesters</p>
                <p>• Offline-first and browser-only</p>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <footer className="mt-8 border-t border-white/10 py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600"><GraduationCap className="h-5 w-5 text-white" /></div>
              <span className="text-lg font-bold text-white">Smart College Portal</span>
            </div>
            <p className="max-w-xl text-sm text-slate-400">Empowering students with easy access to academic resources.</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              {['Home', 'Branches', 'Materials', 'Updates'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-indigo-300">
                  {item}
                </a>
              ))}
            </div>
            <p className="pt-4 text-xs text-slate-600">© 2024 Smart College Portal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </PortalShell>
  )
}

function ClockWidget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
