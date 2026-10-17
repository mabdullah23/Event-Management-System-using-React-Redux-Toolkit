import { useEffect, useMemo, useState } from 'react'
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
    return <EventExplorer user={currentUser} onLogout={() => dispatch(logout())} />
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

const API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json'
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY

function EventExplorer({ user, onLogout }) {
  const [events, setEvents] = useState([])
  const [keyword, setKeyword] = useState('')
  const [city, setCity] = useState('')
  const [category, setCategory] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const categories = useMemo(() => {
    const names = events
      .map((event) => event.classifications?.[0]?.segment?.name)
      .filter(Boolean)
    return [...new Set(names)].sort()
  }, [events])

  async function findEvents(filters = {}) {
    if (!API_KEY) {
      setError('Add VITE_TICKETMASTER_API_KEY to your .env file to load live events.')
      return
    }

    setLoading(true)
    setError('')
    setHasSearched(true)

    const params = new URLSearchParams({
      apikey: API_KEY,
      size: '24',
      sort: 'date,asc',
      startDateTime: new Date().toISOString(),
    })

    if (filters.keyword?.trim()) params.set('keyword', filters.keyword.trim())
    if (filters.city?.trim()) params.set('city', filters.city.trim())
    if (filters.category) params.set('classificationName', filters.category)

    try {
      const response = await fetch(`${API_URL}?${params}`)
      if (!response.ok) {
        throw new Error(`Ticketmaster returned ${response.status}.`)
      }
      const data = await response.json()
      setEvents(data._embedded?.events ?? [])
    } catch (requestError) {
      console.error('Unable to load events from Ticketmaster.', requestError)
      setEvents([])
      setError('We could not load events right now. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    findEvents()
  }, [])

  function handleSearch(event) {
    event.preventDefault()
    findEvents({ keyword, city, category })
  }

  function handleCategoryChange(event) {
    const nextCategory = event.target.value
    setCategory(nextCategory)
    findEvents({ keyword, city, category: nextCategory })
  }

  return (
    <main className="explorer-shell">
      <header className="explorer-header">
        <a className="wordmark" href="/" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark" aria-hidden="true">EM</span>
          <span>Event Management</span>
        </a>
        <div className="header-actions">
          <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
          <button className="logout-button" type="button" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <section className="explorer-hero">
        <div>
          <p className="eyebrow">Discover what is next</p>
          <h1>Find your next<br /><em>good night out.</em></h1>
          <p>Live event listings from Ticketmaster, gathered in one place so you can spend less time searching and more time looking forward to it.</p>
        </div>
        <div className="hero-stamp" aria-hidden="true">LIVE<br /><span>EVENTS</span></div>
      </section>

      <section className="search-panel" aria-label="Search and filter events">
        <form className="search-form" onSubmit={handleSearch}>
          <label>
            <span>What are you looking for?</span>
            <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Artist, team, show..." />
          </label>
          <label>
            <span>Where?</span>
            <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" />
          </label>
          <button className="button button-primary search-button" type="submit">
            Search <span aria-hidden="true">→</span>
          </button>
        </form>
        <div className="filter-row">
          <span className="filter-label">Browse by category</span>
          <select value={category} onChange={handleCategoryChange} aria-label="Filter events by category">
            <option value="">All categories</option>
            {categories.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <button className="clear-filter" type="button" onClick={() => {
            setKeyword('')
            setCity('')
            setCategory('')
            findEvents()
          }}>
            Clear filters
          </button>
        </div>
      </section>

      <section className="results-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ticketmaster picks</p>
            <h2>{keyword || city ? 'Your search results' : 'Upcoming near you'}</h2>
          </div>
          {events.length > 0 && <span className="result-count">{events.length} events</span>}
        </div>

        {error && <div className="status-message error-message" role="alert">{error}</div>}
        {loading && <div className="status-message">Finding events for you...</div>}
        {!loading && !error && hasSearched && events.length === 0 && (
          <div className="status-message">No events matched those filters. Try a broader search.</div>
        )}
        {!loading && events.length > 0 && (
          <div className="event-grid">
            {events.map((event) => <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />)}
          </div>
        )}
      </section>

      {selectedEvent && <EventDetails event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </main>
  )
}

function EventCard({ event, onSelect }) {
  const date = new Date(event.dates?.start?.dateTime || `${event.dates?.start?.localDate}T00:00:00`)
  const image = event.images?.find((item) => item.width >= 500)?.url || event.images?.[0]?.url

  return (
    <article className="event-card">
      <button className="event-card-button" type="button" onClick={() => onSelect(event)}>
        <div className="event-image-wrap">
          {image ? <img src={image} alt="" className="event-image" /> : <div className="image-placeholder">EVENT</div>}
          <span className="date-badge"><strong>{date.toLocaleDateString('en-US', { day: '2-digit' })}</strong><small>{date.toLocaleDateString('en-US', { month: 'short' })}</small></span>
        </div>
        <div className="event-card-content">
          <p className="event-category">{event.classifications?.[0]?.segment?.name || 'Event'}</p>
          <h3>{event.name}</h3>
          <p className="event-meta">{event._embedded?.venues?.[0]?.name || 'Venue details available'} · {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        </div>
      </button>
    </article>
  )
}

function EventDetails({ event, onClose }) {
  const venue = event._embedded?.venues?.[0]
  const date = new Date(event.dates?.start?.dateTime || `${event.dates?.start?.localDate}T00:00:00`)

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <article className="details-modal" role="dialog" aria-modal="true" aria-labelledby="event-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close event details">×</button>
        <p className="eyebrow">{event.classifications?.[0]?.segment?.name || 'Event details'}</p>
        <h2 id="event-title">{event.name}</h2>
        <div className="details-list">
          <p><strong>When</strong>{date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
          <p><strong>Where</strong>{venue?.name || 'Venue to be announced'}{venue?.city?.name ? `, ${venue.city.name}` : ''}</p>
        </div>
        <a className="button button-primary ticket-link" href={event.url} target="_blank" rel="noreferrer">View tickets <span aria-hidden="true">↗</span></a>
      </article>
    </div>
  )
}

export default App
