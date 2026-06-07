import { useEffect, useRef, useState } from 'react'
import './App.css'

// Six preset emojis for the picker. Could be configurable, but a small fixed
// set is the right scope for an interview exercise.
const PRESETS = ['👍', '❤️', '😂', '🎉', '😮', '😢']

// Generates a stable per-browser user id on first load and reuses it after.
// In a real app this would be the authenticated user; here it's just an
// opaque identifier so the server can attribute reactions to a "person".
// crypto.randomUUID() is built-in in modern browsers, no dependency needed.
function getUserId() {
  let id = localStorage.getItem('user_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('user_id', id)
  }
  return id
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function App() {
  // Hold the user id in a ref. We only ever read it; it never changes during
  // the component's lifetime, so there's no point making it state (state
  // would just trigger a needless re-render if we ever set it).
  const userIdRef = useRef(getUserId())
  const userId = userIdRef.current

  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)
  // null when no picker is open, otherwise the id of the message whose picker
  // is open. Single-source-of-truth so opening one closes any others.
  const [pickerFor, setPickerFor] = useState(null)

  useEffect(() => {
    fetch(`/api/messages?user_id=${encodeURIComponent(userId)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setMessages)
      .catch((e) => setError(e.message))
  }, [userId])

  // Close the picker when you click anywhere outside it (or outside the +
  // button that opened it). The classic "click-outside" pattern done with a
  // global mousedown listener. We use `mousedown` (not `click`) so it fires
  // BEFORE focus changes, which avoids one-frame visual hiccups.
  useEffect(() => {
    if (pickerFor == null) return
    function onClick(e) {
      if (!e.target.closest('.picker') && !e.target.closest('.reactions__add')) {
        setPickerFor(null)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [pickerFor])

  async function toggle(messageId, emoji) {
    setError(null)
    try {
      const res = await fetch(`/api/messages/${messageId}/reactions/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, user_id: userId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const updated = await res.json()
      // The server returns the message with its FULL updated reactions list,
      // so we just swap it in — no need to mutate `reactions` ourselves.
      // This means a chip that hit count 0 disappears naturally (the server
      // doesn't include zero-count entries in the summary).
      setMessages((cur) => cur.map((m) => (m.id === messageId ? updated : m)))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app">
      <h1># general</h1>
      {error && <p className="error">{error}</p>}

      <ol className="messages">
        {messages.map((m) => (
          <li key={m.id} className="message">
            <div className="message__meta">
              <span className="message__author">{m.author}</span>
              <time className="message__time">{formatTime(m.created_at)}</time>
            </div>
            <div className="message__body">{m.body}</div>

            <div className="reactions">
              {m.reactions.map((r) => (
                <button
                  key={r.emoji}
                  type="button"
                  // `chip--mine` highlights chips the current user has reacted
                  // to. The server tells us this via reacted_by_me — we don't
                  // re-derive it on the client.
                  className={`chip${r.reacted_by_me ? ' chip--mine' : ''}`}
                  onClick={() => toggle(m.id, r.emoji)}
                  title={`${r.count} ${r.count === 1 ? 'reaction' : 'reactions'}`}
                >
                  <span className="chip__emoji">{r.emoji}</span>
                  <span className="chip__count">{r.count}</span>
                </button>
              ))}

              <div className="reactions__add-wrap">
                <button
                  type="button"
                  className="reactions__add"
                  // Click on an already-open picker closes it (toggle semantics).
                  onClick={() => setPickerFor(pickerFor === m.id ? null : m.id)}
                  aria-label="add reaction"
                >
                  +
                </button>
                {pickerFor === m.id && (
                  <div className="picker">
                    {PRESETS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        className="picker__btn"
                        onClick={() => {
                          toggle(m.id, e)
                          // Close the picker after a selection — both feels
                          // more natural and prevents accidental double-toggles.
                          setPickerFor(null)
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}

export default App
