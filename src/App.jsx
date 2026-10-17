import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  login,
  logout,
  register,
  clearError,
  selectCurrentUser,
  selectAuthError,
} from './store/authSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const authError = useSelector(selectAuthError)
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isRegistering = mode === 'register'

  function handleSubmit(event) {
    event.preventDefault()

    const action = isRegistering
      ? register({ name, email, password })
      : login({ email, password })

    dispatch(action)
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    dispatch(clearError())
    setName('')
    setEmail('')
    setPassword('')
  }

  if (currentUser) {
    return (
      <main className="app-shell">
        <section className="welcome-panel">
          <div className="brand-mark" aria-hidden="true">EM</div>
          <p className="eyebrow">Event Management System</p>
          <h1>Welcome back, {currentUser.name}.</h1>
          <p className="welcome-copy">
            You are signed in and ready to discover your next memorable event.
          </p>
          <div className="profile-card">
            <span className="avatar" aria-hidden="true">
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <strong>{currentUser.name}</strong>
              <span>{currentUser.email}</span>
            </div>
          </div>
          <button className="button button-secondary" type="button" onClick={() => dispatch(logout())}>
            Log out
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="intro-panel">
        <div className="brand-mark" aria-hidden="true">EM</div>
        <p className="eyebrow">Event Management System</p>
        <h1>Make every moment an event.</h1>
        <p className="intro-copy">
          Organize, discover, and experience events that bring people together.
        </p>
        <div className="event-decoration" aria-hidden="true">
          <span>01</span>
          <span className="line" />
          <span>CREATE · CONNECT · CELEBRATE</span>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-heading">
          <p className="eyebrow">Your account</p>
          <h2 id="auth-title">{isRegistering ? 'Create your account' : 'Welcome back'}</h2>
          <p>{isRegistering ? 'Start planning experiences people will remember.' : 'Sign in to continue to your events.'}</p>
        </div>

        <div className="mode-switcher" role="tablist" aria-label="Authentication mode">
          <button
            className={mode === 'login' ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => switchMode('login')}
          >
            Log in
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Alex Morgan"
                autoComplete="name"
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength="6"
              required
            />
          </label>

          {authError && <p className="form-error" role="alert">{authError}</p>}

          <button className="button button-primary" type="submit">
            {isRegistering ? 'Create account' : 'Log in'}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className="auth-footnote">
          {isRegistering ? 'Already have an account?' : 'New to Event Management?'}{' '}
          <button type="button" onClick={() => switchMode(isRegistering ? 'login' : 'register')}>
            {isRegistering ? 'Log in' : 'Create one'}
          </button>
        </p>
        <p className="simulation-note">Frontend demo authentication · Your session persists on refresh</p>
      </section>
    </main>
  )
}

export default App
