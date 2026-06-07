import { useEffect, useState } from 'react'
import './App.css'

const STATUS_LABEL = {
  online: 'online',
  idle: 'idle',
  dnd: 'do not disturb',
  offline: 'offline',
}

function App() {
  const [query, setQuery] = useState('')
  const [members, setMembers] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)

  // This effect handles the two trickiest behaviours of search-as-you-type:
  //
  //   1. DEBOUNCE: don't fire a request on every keystroke. Wait 250ms after
  //      the last change. We do this with setTimeout and clear it in the
  //      cleanup function — which React runs both on unmount AND before the
  //      next effect run when deps change. So if `query` changes again before
  //      the 250ms elapses, the previous timeout is cancelled and a fresh one
  //      starts.
  //
  //   2. STALE RESPONSE: if a request DOES fire and the user types again
  //      before the response arrives, we want to abort the in-flight request
  //      so its result can't overwrite the newer one. AbortController is the
  //      standard way: pass `signal` to fetch, call `abort()` in cleanup.
  //
  // The two interact correctly because both `clearTimeout` and `abort()` are
  // safe no-ops if the underlying thing has already happened.
  useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      setSearching(true)
      setError(null)
      fetch(`/api/members?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        })
        .then((data) => setMembers(data))
        .catch((e) => {
          // AbortError fires when we cancel; that's expected, not an error to surface.
          if (e.name === 'AbortError') return
          setError(e.message)
        })
        .finally(() => {
          // Only clear the "searching" badge if THIS request finished naturally
          // (not because we aborted to start a new one). Otherwise the badge
          // would briefly flicker off between aborts.
          if (!controller.signal.aborted) setSearching(false)
        })
    }, 250)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query])

  return (
    <main className="app">
      <header className="header">
        <h1>Members</h1>
        <div className="search">
          <input
            className="search__input"
            placeholder="Search by name or @handle"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searching && <span className="search__badge">Searching…</span>}
        </div>
        <p className="count">{members.length} {members.length === 1 ? 'member' : 'members'}</p>
      </header>

      {error && <p className="error">{error}</p>}

      <ul className="list">
        {/* Don't show "no results" while a search is still in flight — would
            cause a flash of empty state between the old results disappearing
            and the new ones arriving. */}
        {!searching && members.length === 0 && <li className="list__empty">No members match.</li>}
        {members.map((m) => (
          <li key={m.id} className="row">
            <span
              className="avatar"
              style={{ background: m.avatar_color }}
              aria-hidden
            >
              {m.name.charAt(0).toUpperCase()}
              {/* The presence dot is a child of the avatar so it positions
                  relative to it via CSS without any layout calculations. */}
              <span className={`dot dot--${m.status}`} title={STATUS_LABEL[m.status]} />
            </span>
            <span className="row__name">{m.name}</span>
            <span className="row__handle">@{m.handle}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
