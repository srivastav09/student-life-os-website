import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import dayjs from 'dayjs'
import { ArrowRight, BookOpen, Brain, Clock3, Sparkles, Target, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card, GhostButton } from '../../components/ui'
import type { StudyEdge, StudyNode } from '../../lib/domain'
import { deriveTaskStatus } from '../../lib/domain'
import { formatClock } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

const nodes: StudyNode[] = [
  { id: 'goal', label: 'Semester Goal', x: 50, y: 14, color: 'from-cyan-400 to-blue-500' },
  { id: 'plan', label: 'Plan', x: 16, y: 56, color: 'from-violet-400 to-fuchsia-500' },
  { id: 'learn', label: 'Learn', x: 50, y: 58, color: 'from-emerald-400 to-teal-500' },
  { id: 'build', label: 'Build', x: 84, y: 56, color: 'from-amber-400 to-orange-500' },
  { id: 'ship', label: 'Ship', x: 50, y: 88, color: 'from-rose-400 to-pink-500' },
]

const edges: StudyEdge[] = [
  { from: 'goal', to: 'plan' },
  { from: 'goal', to: 'learn' },
  { from: 'goal', to: 'build' },
  { from: 'learn', to: 'ship' },
  { from: 'build', to: 'ship' },
  { from: 'plan', to: 'ship' },
]

function StudyGraph() {
  const [activeNode, setActiveNode] = useState<string | null>(null)

  return (
    <Card className="relative overflow-hidden lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--app-muted)]">Study graph</p>
          <h3 className="text-xl font-semibold text-[var(--app-fg)]">Explore how work connects</h3>
        </div>
        <Brain className="h-5 w-5 text-cyan-300" />
      </div>
      <div className="relative h-72 rounded-[2rem] border border-[var(--app-border)] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_40%),linear-gradient(180deg,var(--app-surface)_0%,transparent_100%)]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
          {edges.map((edge) => {
            const from = nodes.find((node) => node.id === edge.from)
            const to = nodes.find((node) => node.id === edge.to)
            if (!from || !to) return null
            const connected = !activeNode || edge.from === activeNode || edge.to === activeNode
            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={connected ? 'rgba(103,232,249,0.7)' : 'rgba(148,163,184,0.18)'}
                strokeWidth={connected ? '1.1' : '0.6'}
                strokeDasharray="2 2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: connected ? 1 : 0.5 }}
                transition={{ duration: 1.2, delay: 0.1 }}
              />
            )
          })}
        </svg>
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: activeNode && activeNode !== node.id ? 0.95 : 1, y: 0 }}
            transition={{ delay: index * 0.12, type: 'spring', stiffness: 260, damping: 18 }}
            onHoverStart={() => setActiveNode(node.id)}
            onHoverEnd={() => setActiveNode(null)}
          >
            <div className={`rounded-full bg-gradient-to-br ${node.color} p-[1px] shadow-2xl shadow-cyan-500/20`}>
              <motion.div
                className="rounded-full bg-[var(--app-surface-strong)] px-4 py-3 text-center text-xs font-semibold text-[var(--app-fg)] backdrop-blur"
                animate={{
                  scale: activeNode && activeNode !== node.id ? 0.98 : 1,
                  boxShadow: activeNode === node.id ? '0 0 0 1px rgba(34,211,238,0.35), 0 0 24px rgba(34,211,238,0.12)' : '0 0 0 0 rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.22 }}
              >
                {node.label}
              </motion.div>
            </div>
          </motion.div>
        ))}
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-3xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] px-4 py-3 text-center shadow-2xl shadow-black/20" initial={{ scale: 0.9, opacity: 0.5 }} animate={{ scale: [0.98, 1, 0.98], opacity: 1 }} transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--app-muted)]">Student system</p>
          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--app-fg)]">
            <BookOpen className="h-4 w-4 text-cyan-300" /> Learn
            <Wrench className="h-4 w-4 text-amber-300" /> Build
          </div>
        </motion.div>
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const tasks = useAppStore((state) => state.tasks)
  const classes = useAppStore((state) => state.classes)
  const focus = useAppStore((state) => state.focus)

  const today = dayjs()
  const todayTasks = tasks.filter((task) => deriveTaskStatus(task) !== 'completed').slice(0, 3)
  const upcomingClass = classes.find((entry) => entry.day === today.format('ddd')) ?? classes[0]

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top_left,_var(--app-glow),_transparent_42%),linear-gradient(135deg,var(--app-surface-strong),var(--app-surface))] p-6 shadow-2xl shadow-cyan-500/10"
        >
          <Badge className="border-cyan-400/30 bg-cyan-400/10 text-cyan-700">Offline-first dashboard</Badge>
          <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-[var(--app-fg)] sm:text-5xl">
            One place for tasks, timetable, and focus sprints.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--app-muted)] sm:text-base">
            Built for Indian college routines with local storage, fast cards, and motion-rich interactions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/tasks"><GhostButton>Open tasks <ArrowRight className="ml-2 h-4 w-4" /></GhostButton></Link>
            <Link to="/focus"><GhostButton>Start focus</GhostButton></Link>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <Card className="relative overflow-hidden">
            <Target className="mb-2 h-5 w-5 text-cyan-300" />
            <p className="text-sm text-[var(--app-muted)]">Next focus session</p>
            <p className="mt-1 text-4xl font-black">{formatClock(focus.remainingSeconds)}</p>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              {focus.phase === 'focus' ? 'Deep work' : 'Break'} mode with {focus.distractionCount} distractions logged.
            </p>
          </Card>
          <Card>
            <Clock3 className="mb-2 h-5 w-5 text-violet-300" />
            <p className="text-sm text-[var(--app-muted)]">Today</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--app-fg)]">{today.format('ddd, D MMM')}</p>
            <p className="mt-2 text-sm text-[var(--app-muted)]">{todayTasks.length} tasks in motion, {classes.length} classes scheduled.</p>
          </Card>
        </div>
      </section>

      <StudyGraph />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--app-muted)]">Today’s tasks</p>
              <h3 className="text-xl font-semibold text-[var(--app-fg)]">Keep momentum</h3>
            </div>
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
          <AnimatePresence>
            <div className="grid gap-3">
              {todayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14 }}
                  className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--app-fg)]">{task.title}</p>
                      <p className="text-sm text-[var(--app-muted)]">{task.subject} • {task.priority}</p>
                    </div>
                    <Badge>{task.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </Card>
        <Card>
          <p className="text-sm text-[var(--app-muted)]">Upcoming class</p>
          {upcomingClass ? (
            <>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--app-fg)]">{upcomingClass.subject}</h3>
              <p className="mt-2 text-sm text-[var(--app-muted)]">{upcomingClass.day} • {upcomingClass.startTime} - {upcomingClass.endTime}</p>
              <p className="mt-1 text-sm text-[var(--app-muted)]">{upcomingClass.faculty} • {upcomingClass.room}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--app-muted)]">Add classes in timetable.</p>
          )}
        </Card>
      </section>
    </div>
  )
}
