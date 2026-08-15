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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setNeedsVerification(false)
    try {
      const auth = await authApi.login({ username, password })
      setSession(auth)
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setNeedsVerification(true)
        setError('Email not verified. Enter your email below to verify it.')
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
        Username
        <input
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

      {needsVerification && (
        <div className="verify-inline">
          <input
            placeholder="you@example.com"
            value={verifyEmail}
            onChange={(e) => setVerifyEmail(e.target.value)}
          />
          <button
            type="button"
            className="btn-link"
            onClick={() => verifyEmail && onNeedVerification(verifyEmail)}
          >
            Verify email
          </button>
        </div>
      )}

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
    if (err.status === 401) return 'Invalid username or password.'
    return err.message || `Request failed (${err.status})`
  }
  return err instanceof Error ? err.message : 'Unable to reach the API'
}
