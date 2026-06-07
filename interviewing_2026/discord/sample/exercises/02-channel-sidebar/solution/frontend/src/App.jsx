import { useEffect, useRef, useState } from 'react'
import './App.css'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function App() {
  const [channels, setChannels] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // The subtle bug this guards against: user clicks channel A, request fires.
  // While it's still in flight, they click channel B, second request fires. If
  // A's response happens to arrive AFTER B's, naive code would overwrite B's
  // messages with A's. Incrementing this counter on every fetch and ignoring
  // any response whose token doesn't match the latest fixes it.
  //
  // A ref (not state) is the right tool here: we need the value inside the
  // async callback but we don't want a change to trigger a re-render.
  const requestIdRef = useRef(0)

  // Load channels once. Auto-selecting the first channel on mount also
  // triggers the messages effect below.
  useEffect(() => {
    fetch('/api/channels')
      .then((r) => r.json())
      .then((data) => {
        setChannels(data)
        if (data.length > 0) setSelectedId(data[0].id)
      })
      .catch((e) => setError(e.message))
  }, [])

  // Fetch messages whenever the selected channel changes.
  useEffect(() => {
    if (selectedId == null) return

    // Capture this request's id BEFORE the async work. If a newer request
    // increments the counter while we wait, every guard below will short-circuit.
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)

    fetch(`/api/channels/${selectedId}/messages`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (requestId !== requestIdRef.current) return // stale response, drop it
        setMessages(data)
      })
      .catch((e) => {
        if (requestId !== requestIdRef.current) return
        setError(e.message)
      })
      .finally(() => {
        if (requestId !== requestIdRef.current) return
        setLoading(false)
      })
  }, [selectedId])

  const selected = channels.find((c) => c.id === selectedId)

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="sidebar__title">Channels</h2>
        <ul className="sidebar__list">
          {channels.map((c) => (
            <li key={c.id}>
              {/* `type="button"` on buttons-inside-non-forms is a small but real
                  papercut to remember — the default is "submit", which can cause
                  surprising behaviour if a form ever wraps this. */}
              <button
                type="button"
                className={`sidebar__item${c.id === selectedId ? ' sidebar__item--active' : ''}`}
                onClick={() => setSelectedId(c.id)}
              >
                <span className="sidebar__hash">#</span>
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="pane">
        {selected && (
          <header className="pane__header">
            <h1># {selected.name}</h1>
            {selected.topic && <p className="pane__topic">{selected.topic}</p>}
          </header>
        )}

        <div className="pane__body">
          {loading && <p className="pane__state">Loading…</p>}
          {error && <p className="pane__state pane__state--error">{error}</p>}
          {!loading && !error && messages.length === 0 && (
            <p className="pane__state">No messages in this channel yet.</p>
          )}
          {!loading && !error && (
            <ol className="messages">
              {messages.map((m) => (
                <li key={m.id} className="message">
                  <div className="message__meta">
                    <span className="message__author">{m.author}</span>
                    <time className="message__time">{formatTime(m.created_at)}</time>
                  </div>
                  <div className="message__body">{m.body}</div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
