import type { AuthResponse } from '../types/auth'

const STORAGE_KEY = 'vcrm.session'

export interface Session {
  token: string
  expiresAt: string
  username: string
  role: string
}

type Listener = () => void

const listeners = new Set<Listener>()

function readStorage(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

let current: Session | null = readStorage()

export function getSession(): Session | null {
  return current
}

export function setSession(auth: AuthResponse): void {
  current = {
    token: auth.token,
    expiresAt: auth.expiresAt,
    username: auth.username,
    role: auth.role,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  notify()
}

export function clearSession(): void {
  current = null
  localStorage.removeItem(STORAGE_KEY)
  notify()
}

export function subscribeSession(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notify(): void {
  listeners.forEach((listener) => listener())
}
