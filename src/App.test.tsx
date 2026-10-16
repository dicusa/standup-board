import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { loadProfile, saveProfile } from './profile'

afterEach(() => { cleanup(); vi.restoreAllMocks(); window.localStorage.clear() })
beforeEach(() => { window.localStorage.setItem('standup-board-profile', JSON.stringify({ name: 'Alex Morgan' })) })

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
    const originalGet = Storage.prototype.getItem
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) { if (key === 'standup-board-updates') throw new Error('blocked'); return originalGet.call(this, key) })
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent(/browser may be blocking local storage/i)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('asks for a name on first use and restores it on a later visit', async () => {
    window.localStorage.clear()
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    await user.type(screen.getByLabelText('Your name'), '  Sam Rivera  ')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByRole('heading', { name: 'Good morning, Sam Rivera' })).toBeInTheDocument()
    expect(window.localStorage.getItem('standup-board-profile')).toBe(JSON.stringify({ name: 'Sam Rivera' }))
    unmount()
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Good morning, Sam Rivera' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Your name')).not.toBeInTheDocument()
  })

  it('recovers from malformed profile data by allowing a replacement name', async () => {
    window.localStorage.setItem('standup-board-profile', '{bad json')
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('alert')).toHaveTextContent(/saved name could not be read/i)
    await user.type(screen.getByLabelText('Your name'), 'Taylor')
    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(await screen.findByRole('heading', { name: 'Good morning, Taylor' })).toBeInTheDocument()
  })
})

describe('profile storage', () => {
  it('saves and restores a trimmed name', () => {
    expect(saveProfile('  Lee  ')).toBe(true)
    expect(loadProfile()).toEqual({ status: 'saved', name: 'Lee' })
  })
  it('reports malformed, empty, and unavailable storage', () => {
    expect(loadProfile()).toEqual({ status: 'saved', name: 'Alex Morgan' })
    window.localStorage.setItem('standup-board-profile', 'not-json')
    expect(loadProfile()).toEqual({ status: 'invalid' })
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    expect(loadProfile()).toEqual({ status: 'unavailable' })
  })
})
