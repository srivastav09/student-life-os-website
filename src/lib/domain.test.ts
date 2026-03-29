import { describe, expect, it } from 'vitest'
import type { Task, TimetableClass } from './domain'
import { detectClash, filterTasks } from './domain'

describe('domain helpers', () => {
  it('filters tasks by subject, priority, and status', () => {
    const tasks: Task[] = [
      { id: '1', title: 'A', subject: 'DBMS', dueDate: '2026-03-30', priority: 'high', status: 'pending' },
      { id: '2', title: 'B', subject: 'OS', dueDate: '2026-03-30', priority: 'low', status: 'completed' },
    ]

    expect(filterTasks(tasks, { subject: 'DBMS', priority: 'high', status: 'pending' })).toHaveLength(1)
    expect(filterTasks(tasks, { subject: 'OS', priority: '', status: 'completed' })).toHaveLength(1)
  })

  it('detects timetable clashes', () => {
    const items: TimetableClass[] = [{ id: '1', day: 'Mon', subject: 'DBMS', faculty: 'A', room: '1', startTime: '09:00', endTime: '10:00' }]

    expect(detectClash(items, { day: 'Mon', subject: 'OS', faculty: 'B', room: '2', startTime: '09:30', endTime: '10:30' })).toBe(true)
    expect(detectClash(items, { day: 'Tue', subject: 'OS', faculty: 'B', room: '2', startTime: '09:30', endTime: '10:30' })).toBe(false)
  })
})
