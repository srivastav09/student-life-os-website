import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, CheckCircle2, Filter, Plus, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { Badge, Button, Card, Input, Label, Modal, GhostButton } from '../../components/ui'
import { deriveTaskStatus, filterTasks } from '../../lib/domain'
import { formatDate } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

const taskSchema = z.object({
  title: z.string().min(2),
  subject: z.string().min(1),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  priority: z.enum(['low', 'medium', 'high']),
})

type TaskForm = z.infer<typeof taskSchema>

const formVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.03 } },
}

const fieldVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

export function TasksPage() {
  const tasks = useAppStore((state) => state.tasks)
  const addTask = useAppStore((state) => state.addTask)
  const toggleTask = useAppStore((state) => state.toggleTask)
  const deleteTask = useAppStore((state) => state.deleteTask)
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [subject, setSubject] = useState('')
  const [priority, setPriority] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!saved) return
    const timer = window.setTimeout(() => setSaved(false), 900)
    return () => window.clearTimeout(timer)
  }, [saved])

  const visibleTasks = useMemo(
    () => filterTasks(tasks.map((task) => ({ ...task, status: deriveTaskStatus(task) })), { subject, priority, status }),
    [tasks, priority, status, subject],
  )

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      subject: '',
      dueDate: new Date().toISOString().slice(0, 10),
      priority: 'medium',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    addTask(values)
    reset()
    setSaved(true)
    window.setTimeout(() => setOpen(false), 260)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-2xl shadow-black/10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[var(--app-muted)]">Tasks & assignments</p>
          <h2 className="text-2xl font-semibold text-[var(--app-fg)]">Track work without friction</h2>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Add task</Button>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-[var(--app-fg)]"><Filter className="h-4 w-4" /> Filters</div>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Input placeholder="Priority" value={priority} onChange={(e) => setPriority(e.target.value)} />
          <Input placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>
      </Card>

      <div className="grid gap-3">
        <AnimatePresence>
          {visibleTasks.map((task) => (
            <motion.article key={task.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="rounded-[1.75rem] border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <Badge>{task.priority}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[var(--app-muted)]">{task.subject} • Due {formatDate(task.dueDate)} • {task.status}</p>
                </div>
                <div className="flex gap-2">
                  <GhostButton onClick={() => toggleTask(task.id)}>{task.status === 'completed' ? 'Reopen' : 'Complete'}</GhostButton>
                  <GhostButton onClick={() => deleteTask(task.id)}><Trash2 className="h-4 w-4" /></GhostButton>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      <Modal open={open} title="Add task" onClose={() => setOpen(false)}>
        <motion.form className="space-y-4" onSubmit={onSubmit} initial="hidden" animate="show" variants={formVariants}>
          <motion.div variants={fieldVariants}>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title ? <p className="mt-1 text-xs text-rose-300">Title is required.</p> : null}
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2">
            <motion.div variants={fieldVariants}>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register('subject')} />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" {...register('dueDate')} />
              <p className="mt-1 text-xs text-[var(--app-muted)]">Use the format YYYY-MM-DD.</p>
            </motion.div>
          </div>
          <motion.div variants={fieldVariants}>
            <Label htmlFor="priority">Priority</Label>
            <Input id="priority" {...register('priority')} />
          </motion.div>
          <motion.div variants={fieldVariants} className="flex items-center justify-between gap-2">
            <motion.div
              initial={false}
              animate={saved ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
              className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200"
            >
              <CheckCircle2 className="h-4 w-4" /> Saved
            </motion.div>
            <div className="flex gap-2">
            <GhostButton type="button" onClick={() => setOpen(false)}>Cancel</GhostButton>
              <Button type="submit" disabled={isSubmitting}><CalendarPlus className="mr-2 h-4 w-4" />Save task</Button>
            </div>
          </motion.div>
        </motion.form>
      </Modal>
    </div>
  )
}
