import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App shell', () => {
  it('renders the portfolio hero', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /your name/i })).toBeInTheDocument()
  })

  it('updates the liquid cursor position on pointer move', () => {
    render(<App />)

    const event = new Event('pointermove')
    Object.defineProperty(event, 'clientX', { value: 240 })
    Object.defineProperty(event, 'clientY', { value: 180 })

    window.dispatchEvent(event)

    expect(document.documentElement.style.getPropertyValue('--cursor-x')).toBe('240px')
    expect(document.documentElement.style.getPropertyValue('--cursor-y')).toBe('180px')
  })
})
