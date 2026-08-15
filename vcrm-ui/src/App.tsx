import { useState } from 'react'
import './App.css'
import { useSession } from './auth/useSession'
import { LoginPage } from './features/auth/LoginPage'
import { SignUpPage } from './features/auth/SignUpPage'
import { VerifyOtpPage } from './features/auth/VerifyOtpPage'
import { CustomersPage } from './features/customers/CustomersPage'

type AuthView = { kind: 'login' } | { kind: 'signup' } | { kind: 'verify-otp'; email: string }

function App() {
  const session = useSession()
  const [view, setView] = useState<AuthView>({ kind: 'login' })

  if (session) {
    return <CustomersPage />
  }

  if (view.kind === 'signup') {
    return (
      <SignUpPage
        onSignedUp={(email) => setView({ kind: 'verify-otp', email })}
        onSwitchToLogin={() => setView({ kind: 'login' })}
      />
    )
  }

  if (view.kind === 'verify-otp') {
    return <VerifyOtpPage email={view.email} onBack={() => setView({ kind: 'login' })} />
  }

  return (
    <LoginPage
      onSwitchToSignUp={() => setView({ kind: 'signup' })}
      onNeedVerification={(email) => setView({ kind: 'verify-otp', email })}
    />
  )
}

export default App
