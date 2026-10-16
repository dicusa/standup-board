import { describe, expect, it } from 'vitest'
import { readBoard, STORAGE_KEY, writeBoard } from './storage'

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe('board storage', () => {
  it('starts with an empty board and round trips saved data', () => {
    const storage = memoryStorage()
    expect(readBoard(storage)).toEqual({ personName: '', updates: [] })
    const board = { personName: 'Alex', updates: [{ id: '1', personName: 'Alex', yesterday: 'Reviewed', today: 'Ship', blocker: '', blockerResolved: false, updateDate: '2026-10-17' }] }
    writeBoard(board, storage)
    expect(storage.getItem(STORAGE_KEY)).toContain('Alex')
    expect(readBoard(storage)).toEqual(board)
  })

  it('reports malformed saved data clearly', () => {
    const storage = memoryStorage()
    storage.setItem(STORAGE_KEY, '{bad json')
    expect(() => readBoard(storage)).toThrow()
    storage.setItem(STORAGE_KEY, JSON.stringify({ personName: 4, updates: [] }))
    expect(() => readBoard(storage)).toThrow('Saved board data is not in a readable format.')
  })
})
