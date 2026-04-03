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

const portalStats = [
  { label: 'Materials', value: '0' },
  { label: 'Branches', value: '4' },
  { label: 'Updates', value: '0' },
  { label: 'Semesters', value: '8' },
]

const adminTabs = [
  { id: 'upload', label: 'Upload Material', icon: Upload },
  { id: 'manage', label: 'Manage Content', icon: Grid2X2 },
  { id: 'update', label: 'Post Update', icon: Bell },
  { id: 'timetable', label: 'Timetable', icon: CalendarDays },
] as const

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

  useEffect(() => {
    setSelectedSection(sectionsByBranch[selectedBranch][0])
  }, [selectedBranch])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  const branchInfo = useMemo(
    () => branchCards.find((branch) => branch.key === selectedBranch) ?? branchCards[0],
    [selectedBranch],
  )

  const sectionTabs = sectionsByBranch[selectedBranch] ?? []

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
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><BookOpen className="h-4 w-4 text-indigo-300" /> 0 Materials</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><CalendarDays className="h-4 w-4 text-violet-300" /> 0 Timetables</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2"><Bell className="h-4 w-4 text-sky-300" /> 0 Updates</span>
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
                    <EmptyState icon={FolderOpen} title="No materials available" description="The admin hasn't uploaded anything here yet." />
                  </section>
                  <section className="lg:col-span-3">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white"><CalendarDays className="h-5 w-5 text-violet-300" /> Timetables</h2>
                    <EmptyState icon={CalendarOff} title="No timetables available" description="Check back later or contact admin." />
                  </section>
                  <section className="lg:col-span-3">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white"><Bell className="h-5 w-5 text-sky-300" /> Updates &amp; Announcements</h2>
                    <EmptyState icon={MessageSquareWarning} title="No updates available" description="No announcements have been posted for this branch yet." />
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
                    <p className="text-xs text-slate-400">Manage all portal content</p>
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
                {adminTab === 'manage' ? (
                  <EmptyState icon={FolderOpen} title="No content uploaded yet." description="Use the upload tabs to add study materials, updates, or timetables." />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Branch *</span>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">CSE</div>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Section *</span>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">Select Section</div>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Semester *</span>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">Semester 1</div>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Type *</span>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">Notes</div>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Title *</span>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">Data Structures Unit 1 Notes</div>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Description</span>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">Brief description...</div>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300 sm:col-span-2">
                      <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Resource Link *</span>
                      <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3">https://drive.google.com/...</div>
                    </label>
                    <button className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-4 py-3 font-semibold text-white">
                      <Upload className="h-4 w-4" /> {adminTab === 'timetable' ? 'Upload Timetable' : adminTab === 'update' ? 'Post Update' : 'Upload Material'}
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
