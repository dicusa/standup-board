import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { STORAGE_KEY } from './storage'

describe('Standup Board shell', () => {
  beforeEach(() => localStorage.clear())

  it('shows an accessible empty board and lets a person post and resolve a blocker', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Today’s board' })).toBeInTheDocument()
    expect(screen.getByText('A fresh day starts here')).toBeInTheDocument()
    fireEvent.click(screen.getAllByRole('button', { name: /post an update/i })[0])
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Alex' } })
    fireEvent.change(screen.getByLabelText(/yesterday/i), { target: { value: 'Reviewed the launch plan' } })
    fireEvent.change(screen.getByLabelText(/today/i), { target: { value: 'Build the board' } })
    fireEvent.change(screen.getByLabelText(/any blockers/i), { target: { value: 'Need design review' } })
    fireEvent.click(screen.getByRole('button', { name: /share update/i }))
    expect(await screen.findByText('Reviewed the launch plan')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).updates).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: /^Blockers/ }))
    fireEvent.click(screen.getByRole('button', { name: /mark as resolved/i }))
    expect(screen.getByText('All clear for now')).toBeInTheDocument()
  })

  it('shows a readable error for corrupt local data', async () => {
    localStorage.setItem(STORAGE_KEY, '{bad')
    render(<App />)
    expect(await screen.findByRole('alert')).toHaveTextContent('We couldn’t access your saved board')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
