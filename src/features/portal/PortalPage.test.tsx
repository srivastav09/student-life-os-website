import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import PortalPage from './PortalPage'

const storedPortalContent = {
  CSE: {
    materials: [{ id: 'material-1', title: 'Custom Notes', type: 'Notes', detail: 'Saved locally for revision.', meta: 'Sem 4' }],
    schedule: [],
    updates: [],
  },
  CSM: { materials: [], schedule: [], updates: [] },
  'CSE AI': { materials: [], schedule: [], updates: [] },
  'CSE AIDS': { materials: [], schedule: [], updates: [] },
}

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('student-life-os.portal-content.v1', JSON.stringify(storedPortalContent))
})

describe('PortalPage', () => {
  it('loads persisted branch content', async () => {
    const user = userEvent.setup()
    render(<PortalPage />)

    await user.click(screen.getByRole('button', { name: /cse computer science/i }))

    expect(await screen.findByText('Custom Notes')).toBeInTheDocument()
  })
})
