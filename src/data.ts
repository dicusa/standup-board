import type { DailyUpdate } from './models'

const STORAGE_KEY = 'standup-board-updates'

export function localDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function saveDailyUpdate(updates: DailyUpdate[], update: DailyUpdate): DailyUpdate[] {
  const next = updates.filter(item => !(item.personName === update.personName && item.updateDate === update.updateDate))
  next.push(update)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

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
