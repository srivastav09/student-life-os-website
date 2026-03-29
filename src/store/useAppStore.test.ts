import { beforeEach, describe, expect, it } from 'vitest'
import { seedClasses, seedFocusSessions, seedTasks } from '../data/seed'
import { createDefaultFocusState, useAppStore } from './useAppStore'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({
    tasks: seedTasks,
    classes: seedClasses,
    focus: createDefaultFocusState(),
  })
})

describe('useAppStore', () => {
  it('adds tasks', () => {
    useAppStore.getState().addTask({ title: 'Read notes', subject: 'OS', dueDate: '2026-03-30', priority: 'low' })
    expect(useAppStore.getState().tasks[0].title).toBe('Read notes')
  })

  it('records focus distractions', () => {
    useAppStore.setState({ focus: { ...createDefaultFocusState(), sessions: seedFocusSessions } })
    useAppStore.getState().addDistraction()
    expect(useAppStore.getState().focus.distractionCount).toBe(1)
  })

  it('rejects clashing classes', () => {
    const result = useAppStore.getState().addClass({
      day: 'Mon',
      subject: 'Maths',
      faculty: 'Prof',
      room: 'C-101',
      startTime: '09:30',
      endTime: '10:30',
    })

    expect(result.ok).toBe(false)
    expect(result.clash).toBe(true)
  })
})
