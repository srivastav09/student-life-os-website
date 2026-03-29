import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { seedClasses, seedFocusSessions, seedTasks } from '../../data/seed'
import { createDefaultFocusState, useAppStore } from '../../store/useAppStore'
import { TasksPage } from './TasksPage'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({
    tasks: seedTasks,
    classes: seedClasses,
    focus: { ...createDefaultFocusState(), sessions: seedFocusSessions },
  })
})

describe('TasksPage', () => {
  it('opens the add task modal', async () => {
    const user = userEvent.setup()
    render(<TasksPage />)

    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
  })
})
