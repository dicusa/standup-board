import type { BoardData } from './models'

export const STORAGE_KEY = 'standup-board:v1'

export function readBoard(storage: Pick<Storage, 'getItem'> = window.localStorage): BoardData {
  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) return { personName: '', updates: [] }
  const value: unknown = JSON.parse(raw)
  if (!value || typeof value !== 'object' || !('personName' in value) || !('updates' in value) ||
      typeof value.personName !== 'string' || !Array.isArray(value.updates)) {
    throw new Error('Saved board data is not in a readable format.')
  }
  return value as BoardData
}

export function writeBoard(data: BoardData, storage: Pick<Storage, 'setItem'> = window.localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(data))
}
