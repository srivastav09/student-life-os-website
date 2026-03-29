import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, Clock3, TriangleAlert } from 'lucide-react'
import dayjs from 'dayjs'
import { z } from 'zod'
import { Badge, Button, Card, GhostButton, Input, Label, Modal } from '../../components/ui'
import { timeToMinutes } from '../../lib/utils'
import { useAppStore } from '../../store/useAppStore'

const classSchema = z.object({
  day: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']),
  subject: z.string().min(1),
  faculty: z.string().min(1),
  room: z.string().min(1),
  startTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM'),
  endTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Use HH:MM'),
})

type ClassForm = z.infer<typeof classSchema>

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

export function TimetablePage() {
  const classes = useAppStore((state) => state.classes)
  const addClass = useAppStore((state) => state.addClass)
  const deleteClass = useAppStore((state) => state.deleteClass)
  const [open, setOpen] = useState(false)
  const [clash, setClash] = useState(false)

  const { register, handleSubmit, reset } = useForm<ClassForm>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      day: 'Mon',
      subject: '',
      faculty: '',
      room: '',
      startTime: '09:00',
      endTime: '10:00',
    },
  })

  const grouped = useMemo<Record<(typeof days)[number], typeof classes>>(
    () =>
      Object.fromEntries(
        days.map((day) => [day, classes.filter((entry) => entry.day === day).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))]),
      ) as Record<(typeof days)[number], typeof classes>,
    [classes],
  )
  const currentDay = dayjs().format('ddd') as (typeof days)[number]

  const onSubmit = handleSubmit((values) => {
    const result = addClass(values)
    setClash(!result.ok)
    if (result.ok) {
      reset()
      setOpen(false)
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-[var(--app-border)] bg-[var(--app-surface)] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[var(--app-muted)]">Timetable planner</p>
          <h2 className="text-2xl font-semibold text-[var(--app-fg)]">Weekly grid for Mon-Sat</h2>
        </div>
        <Button onClick={() => setOpen(true)}><CalendarPlus className="mr-2 h-4 w-4" />Add class</Button>
      </div>

      {clash ? <Card className="border-amber-400/30 bg-amber-400/10 text-amber-900 shadow-lg shadow-amber-400/10"><TriangleAlert className="mb-2 h-5 w-5" />The slot clashes with an existing class.</Card> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {days.map((day) => (
          <Card key={day} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--app-fg)]">{day}</h3>
              <Badge>{grouped[day].length}</Badge>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {grouped[day].map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={entry.day === currentDay ? 'rounded-2xl border border-cyan-400/40 bg-cyan-400/10 p-4 shadow-lg shadow-cyan-500/10' : 'rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface-strong)] p-4'}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{entry.subject}</p>
                        <p className="text-sm text-[var(--app-muted)]">{entry.faculty}</p>
                      </div>
                      <GhostButton onClick={() => deleteClass(entry.id)}><TriangleAlert className="h-4 w-4" /></GhostButton>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-[var(--app-muted)]"><Clock3 className="h-4 w-4 text-cyan-300" />{entry.startTime} - {entry.endTime} • {entry.room}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} title="Add class" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="day">Day</Label>
              <Input id="day" {...register('day')} placeholder="Mon" />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" {...register('subject')} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="faculty">Faculty</Label>
              <Input id="faculty" {...register('faculty')} />
            </div>
            <div>
              <Label htmlFor="room">Room</Label>
              <Input id="room" {...register('room')} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startTime">Start</Label>
              <Input id="startTime" type="text" inputMode="numeric" placeholder="HH:MM" {...register('startTime')} />
            </div>
            <div>
              <Label htmlFor="endTime">End</Label>
              <Input id="endTime" type="text" inputMode="numeric" placeholder="HH:MM" {...register('endTime')} />
            </div>
          </div>
          <p className="text-xs text-[var(--app-muted)]">Use 24-hour format like 09:30.</p>
          <div className="flex justify-end gap-2">
            <GhostButton type="button" onClick={() => setOpen(false)}>Cancel</GhostButton>
            <Button type="submit">Save class</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
