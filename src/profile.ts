const PROFILE_KEY = 'standup-board-profile'

export type ProfileLoadResult =
  | { status: 'saved'; name: string }
  | { status: 'empty' }
  | { status: 'invalid' }
  | { status: 'unavailable' }

export function loadProfile(): ProfileLoadResult {
  let raw: string | null
  try {
    raw = window.localStorage.getItem(PROFILE_KEY)
  } catch {
    return { status: 'unavailable' }
  }
  if (raw === null) return { status: 'empty' }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || !('name' in parsed) || typeof parsed.name !== 'string' || !parsed.name.trim()) return { status: 'invalid' }
    return { status: 'saved', name: parsed.name.trim() }
  } catch { return { status: 'invalid' } }
}

export function saveProfile(name: string): boolean {
  const trimmed = name.trim()
  if (!trimmed) return false
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: trimmed }))
    return true
  } catch {
    return false
  }
}
