import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App shell', () => {
  it('renders the dashboard route', () => {
    render(<App />)
    expect(screen.getByText(/focus\. plan\. execute\./i)).toBeInTheDocument()
  })
})
