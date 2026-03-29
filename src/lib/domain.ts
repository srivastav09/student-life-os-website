export type Priority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'completed' | 'overdue'
export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'

export type Task = {
  id: string
  title: string
  subject: string
  dueDate: string
  priority: Priority
  status: TaskStatus
}

export type TimetableClass = {
  id: string
  day: DayKey
  subject: string
  faculty: string
  room: string
  startTime: string
  endTime: string
}

export type FocusSession = {
  id: string
  startedAt: string
  completedAt: string
  minutes: number
  distractions: number
}

export function deriveTaskStatus(task: Pick<Task, 'dueDate' | 'status'>, now = new Date()) {
  if (task.status === 'completed') return 'completed' as const
  const due = new Date(task.dueDate)
  return due.getTime() < now.setHours(23, 59, 59, 999) ? 'overdue' : 'pending'
}

export function filterTasks(tasks: Task[], filters: { subject: string; priority: string; status: string }) {
  return tasks.filter((task) => {
    const subjectMatch = !filters.subject || task.subject === filters.subject
    const priorityMatch = !filters.priority || task.priority === filters.priority
    const statusMatch = !filters.status || task.status === filters.status
    return subjectMatch && priorityMatch && statusMatch
  })
}

export function detectClash(items: TimetableClass[], draft: Omit<TimetableClass, 'id'>) {
  const draftStart = minutesFromTime(draft.startTime)
  const draftEnd = minutesFromTime(draft.endTime)

  return items.some((item) => {
    if (item.day !== draft.day) return false
    const start = minutesFromTime(item.startTime)
    const end = minutesFromTime(item.endTime)
    return draftStart < end && draftEnd > start
  })
}

export function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function createSeedId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export type StudyNode = {
  id: string
  label: string
  x: number
  y: number
  color: string
}

export type StudyEdge = {
  from: string
  to: string
}
