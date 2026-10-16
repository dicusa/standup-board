import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

afterEach(() => { cleanup(); vi.restoreAllMocks(); window.localStorage.clear() })

describe('Standup Board shell', () => {
  it('shows an accessible loading state, then the empty board', async () => {
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent(/getting your team’s updates/i)
    expect(await screen.findByRole('heading', { name: 'A fresh start' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('opens the update form from the empty state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await screen.findByRole('heading', { name: 'A fresh start' })
    await user.click(screen.getByRole('button', { name: /post your update/i }))
    expect(screen.getByRole('heading', { name: 'Share your update' })).toBeInTheDocument()
    expect(screen.getByLabelText(/what did you work on yesterday/i)).toBeInTheDocument()
  })

  it('shows a useful error when local data cannot be read', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent(/browser may be blocking local storage/i)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })
})
