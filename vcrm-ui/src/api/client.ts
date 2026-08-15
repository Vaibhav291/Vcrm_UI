import { clearSession, getSession } from '../auth/session'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function parseErrorMessage(body: string): string | null {
  if (!body) return null
  try {
    const parsed: unknown = JSON.parse(body)
    if (typeof parsed === 'string') return parsed
    if (parsed && typeof parsed === 'object' && 'title' in parsed) {
      return String((parsed as { title: unknown }).title)
    }
  } catch {
    // Not JSON — fall through to the raw body.
  }
  return body
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const session = getSession()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
      ...init?.headers,
    },
  })

  if (response.status === 401 && session) {
    clearSession()
  }

  if (!response.ok) {
    const body = await response.text()
    throw new ApiError(response.status, parseErrorMessage(body) || response.statusText)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
}
