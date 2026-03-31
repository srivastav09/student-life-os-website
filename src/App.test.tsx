import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App shell', () => {
  it('renders the portal hero', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /smart college/i })).toBeInTheDocument()
    expect(screen.getByText(/your gateway to academic excellence/i)).toBeInTheDocument()
  })
})
