import { useState } from 'react'
import type { FormEvent } from 'react'
import { authApi } from '../../api/auth'
import { ApiError } from '../../api/client'

interface SignUpPageProps {
  onSignedUp: (email: string) => void
  onSwitchToLogin: () => void
}

export function SignUpPage({ onSignedUp, onSwitchToLogin }: SignUpPageProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = await authApi.signUp({ username, email, password })
      onSignedUp(result.email)
    } catch (err) {
      setError(describeSignUpError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign up</h2>

      <label>
        Username
        <input
          required
          maxLength={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Email
        <input
          required
          type="email"
          maxLength={150}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          required
          type="password"
          minLength={8}
          maxLength={100}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        Confirm password
        <input
          required
          type="password"
          minLength={8}
          maxLength={100}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </div>

      <p className="auth-switch">
        Already have an account?{' '}
        <button type="button" className="btn-link" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  )
}

function describeSignUpError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 409) return 'Username or email is already taken.'
    return err.message || `Request failed (${err.status})`
  }
  return err instanceof Error ? err.message : 'Unable to reach the API'
}
