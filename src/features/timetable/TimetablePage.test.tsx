import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { seedClasses, seedFocusSessions, seedTasks } from '../../data/seed'
import { createDefaultFocusState, useAppStore } from '../../store/useAppStore'
import { TimetablePage } from './TimetablePage'

beforeEach(() => {
  localStorage.clear()
  useAppStore.setState({
    tasks: seedTasks,
    classes: seedClasses,
    focus: { ...createDefaultFocusState(), sessions: seedFocusSessions },
  })
})

describe('TimetablePage', () => {
  it('opens the add class modal', async () => {
    const user = userEvent.setup()
    render(<TimetablePage />)

    await user.click(screen.getByRole('button', { name: /add class/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/^day$/i)).toBeInTheDocument()
  })
})
