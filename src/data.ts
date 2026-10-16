import type { DailyUpdate } from './models'

const STORAGE_KEY = 'standup-board-updates'

export function loadUpdates(): Promise<DailyUpdate[]> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY)
        resolve(stored ? JSON.parse(stored) as DailyUpdate[] : [])
      } catch {
        reject(new Error('We couldn’t load your saved updates. Your browser may be blocking local storage.'))
      }
    }, 120)
  })
}
