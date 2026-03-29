import type { FocusSession, Task, TimetableClass } from '../lib/domain'

export const seedTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Submit DBMS assignment',
    subject: 'DBMS',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'high',
    status: 'pending',
  },
  {
    id: 'task-2',
    title: 'Revise OS deadlocks',
    subject: 'OS',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    priority: 'medium',
    status: 'pending',
  },
]

export const seedClasses: TimetableClass[] = [
  {
    id: 'class-1',
    day: 'Mon',
    subject: 'DBMS',
    faculty: 'Dr. Mehta',
    room: 'C-204',
    startTime: '09:00',
    endTime: '10:00',
  },
  {
    id: 'class-2',
    day: 'Tue',
    subject: 'OS',
    faculty: 'Prof. Rao',
    room: 'Lab-1',
    startTime: '11:00',
    endTime: '12:00',
  },
]

export const seedFocusSessions: FocusSession[] = [
  {
    id: 'focus-1',
    startedAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date(Date.now() - 6900000).toISOString(),
    minutes: 25,
    distractions: 1,
  },
]
