import { useEffect, useRef, useState } from 'react'
import './App.css'

// "just now" for anything in the last minute, otherwise the wall-clock time.
// We deliberately don't pull in a date library — Intl + toLocaleTimeString
// handle the formatting and the threshold is one line.
function formatTime(iso) {
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  if (diffMs < 60_000) return 'just now'
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function App() {
  // List + load state. `loadError` is for the initial fetch; we use a separate
  // `sendErrors` below for composer-specific failures so the two don't get
  // tangled (a send failure shouldn't blank out the messages you've loaded).
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Composer state. `author` is lazy-init'd from localStorage so the field
  // pre-fills on refresh — small QoL touch from the prompt's stretch goal.
  const [author, setAuthor] = useState(() => localStorage.getItem('author') ?? '')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendErrors, setSendErrors] = useState(null)

  // Ref to the bottom-of-list sentinel; we scroll it into view on each new
  // message so the user always sees the latest. Using scrollIntoView on a
  // sentinel is simpler than measuring scrollHeight on the container.
  const listEndRef = useRef(null)

  // Initial load. Empty deps array = runs once on mount.
  useEffect(() => {
    fetch('/api/messages')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => setMessages(data))
      .catch((e) => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Scroll-to-bottom whenever the message count changes. Keyed on length, not
  // the array reference, so we don't fire on unrelated re-renders.
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Persist `author` on every change so it survives a refresh.
  useEffect(() => {
    localStorage.setItem('author', author)
  }, [author])

  async function send(e) {
    e.preventDefault()
    // Guard against double-submits while the request is in flight. The Send
    // button is also disabled, but this catches Enter-key submissions too.
    if (sending) return
    setSendErrors(null)
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        // API-only Rails needs Content-Type: application/json so the body is
        // parsed as JSON (and ends up under `params[:message]` thanks to the
        // wrap_parameters default). Without this header you'd see "param is
        // missing" errors server-side.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: { author, body } }),
      })
      const data = await res.json()
      if (!res.ok) {
        // Server returned 422 with `{ errors: { field: [msgs] } }`. Fall back
        // to a generic "Unknown error" if the shape isn't what we expect.
        setSendErrors(data.errors ?? { base: ['Unknown error'] })
        return
      }
      // Append the server-returned record (which has `id` and `created_at`)
      // — using the response is more correct than constructing a fake row
      // locally, since the server is the source of truth for both fields.
      setMessages((m) => [...m, data])
      setBody('')
    } catch (err) {
      // Network-level failure (DNS, CORS, server down). Use the `base` key so
      // the error renderer below treats it the same as a record-level error.
      setSendErrors({ base: [err.message] })
    } finally {
      setSending(false)
    }
  }

  // Enter sends; Shift+Enter inserts a newline (the standard chat-UX
  // convention). preventDefault on plain Enter stops the textarea from
  // inserting a newline before we submit.
  function onBodyKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(e)
    }
  }

  return (
    <main className="chat">
      <header className="chat__header">
        <h1># general</h1>
      </header>

      <ol className="messages">
        {loading && <li className="messages__state">Loading…</li>}
        {loadError && <li className="messages__state messages__state--error">{loadError}</li>}
        {!loading && messages.length === 0 && <li className="messages__state">No messages yet.</li>}
        {messages.map((m) => (
          <li key={m.id} className="message">
            <div className="message__meta">
              <span className="message__author">{m.author}</span>
              <time className="message__time">{formatTime(m.created_at)}</time>
            </div>
            <div className="message__body">{m.body}</div>
          </li>
        ))}
        {/* Empty sentinel for scrollIntoView. aria-hidden because it carries no info. */}
        <li ref={listEndRef} aria-hidden />
      </ol>

      <form className="composer" onSubmit={send}>
        <input
          className="composer__author"
          placeholder="your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <textarea
          className="composer__body"
          placeholder="Message #general"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={onBodyKeyDown}
          rows={2}
          required
        />
        <button className="composer__send" type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send'}
        </button>
        {sendErrors && (
          // Flatten `{ field: [msgs] }` into a single list. For the `base` key
          // (network/unknown errors) we render the message as-is; for field
          // errors we prefix with the field name so "body can't be blank" reads
          // naturally.
          <ul className="composer__errors">
            {Object.entries(sendErrors).flatMap(([field, msgs]) =>
              msgs.map((msg, i) => (
                <li key={`${field}-${i}`}>
                  {field === 'base' ? msg : `${field} ${msg}`}
                </li>
              ))
            )}
          </ul>
        )}
      </form>
    </main>
  )
}

export default App
