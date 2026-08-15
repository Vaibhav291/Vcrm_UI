import { useState } from 'react'
import type { FormEvent } from 'react'
import { authApi } from '../../api/auth'
import { ApiError } from '../../api/client'
import { setSession } from '../../auth/session'

interface VerifyOtpPageProps {
  email: string
  onBack: () => void
}

export function VerifyOtpPage({ email, onBack }: VerifyOtpPageProps) {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const auth = await authApi.verifyOtp({ email, code })
      setSession(auth)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message || 'Invalid or expired verification code.'
          : 'Unable to reach the API',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setResent(false)
    try {
      await authApi.resendOtp({ email })
      setResent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to reach the API')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Verify your email</h2>
      <p>We sent a verification code to {email}.</p>

      <label>
        Verification code
        <input
          required
          maxLength={10}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </label>

      {error && <p className="form-error">{error}</p>}
      {resent && <p className="form-hint">A new code has been sent.</p>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onBack} disabled={submitting}>
          Back
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Verifying…' : 'Verify'}
        </button>
      </div>

      <p className="auth-switch">
        Didn&apos;t get a code?{' '}
        <button type="button" className="btn-link" onClick={handleResend}>
          Resend
        </button>
      </p>
    </form>
  )
}
