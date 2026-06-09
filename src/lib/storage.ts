import type { WorkoutSession } from '@/types'

export function getSessions(): WorkoutSession[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('voicegym-sessions')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveSession(session: WorkoutSession): void {
  if (typeof window === 'undefined') return
  const sessions = getSessions()
  sessions.unshift(session)
  localStorage.setItem('voicegym-sessions', JSON.stringify(sessions))
}
