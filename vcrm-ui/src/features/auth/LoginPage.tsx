import { useState } from 'react'
import type { FormEvent } from 'react'
import { authApi } from '../../api/auth'
import { ApiError } from '../../api/client'
import { setSession } from '../../auth/session'

interface LoginPageProps {
  onSwitchToSignUp: () => void
  onNeedVerification: (email: string) => void
}

export function LoginPage({ onSwitchToSignUp, onNeedVerification }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const auth = await authApi.login({ email, password })
      setSession(auth)
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        onNeedVerification(email)
      } else {
        setError(describeAuthError(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Log in</h2>

      <label>
        Email
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </div>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <button type="button" className="btn-link" onClick={onSwitchToSignUp}>
          Sign up
        </button>
      </p>
    </form>
  )
}

function describeAuthError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Invalid email or password.'
    return err.message || `Request failed (${err.status})`
  }
  return err instanceof Error ? err.message : 'Unable to reach the API'
}
