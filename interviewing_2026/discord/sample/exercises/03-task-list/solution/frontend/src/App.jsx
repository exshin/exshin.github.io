import { useEffect, useRef, useState } from 'react'
import './App.css'

// Filter predicates. Keeping them in a const map keyed by the filter name
// makes the JSX terser (one .map over the keys) and centralises the logic.
const FILTERS = {
  all: () => true,
  active: (t) => !t.done,
  done: (t) => t.done,
}

function App() {
  // One useState per concern: tasks / new-task input / filter / error. We
  // don't reach for a reducer or context — at this scale, multiple useStates
  // are clearer than a single state object with spread updates everywhere.
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    fetch('/api/tasks')
      .then((r) => r.json())
      .then(setTasks)
      .catch((e) => setError(e.message))
  }, [])

  async function addTask(e) {
    e.preventDefault()
    const trimmed = title.trim()
    // Don't even send empty submissions — the server would reject them, but
    // catching it client-side avoids a needless round-trip and an error flash.
    if (!trimmed) return
    setError(null)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { title: trimmed } }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(formatErrors(data.errors))
        return
      }
      // Prepend because the API returns newest-first; appending would put the
      // new task at the bottom of a desc-ordered list, which would look wrong.
      setTasks((cur) => [data, ...cur])
      setTitle('')
      // Refocus so you can keep adding without grabbing the mouse.
      inputRef.current?.focus()
    } catch (err) {
      setError(err.message)
    }
  }

  // Optimistic toggle: flip the checkbox in local state immediately, then
  // PATCH. If the request fails, revert. The user sees the new state with
  // zero perceived latency in the happy path.
  async function toggle(task) {
    const previous = task.done
    setTasks((cur) => cur.map((t) => (t.id === task.id ? { ...t, done: !previous } : t)))
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { done: !previous } }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      // Roll back to `previous`. Note we capture `previous` from before the
      // optimistic write, not from `tasks` (which is stale inside this async
      // function due to closure semantics).
      setTasks((cur) => cur.map((t) => (t.id === task.id ? { ...t, done: previous } : t)))
      setError(err.message)
    }
  }

  // Optimistic delete: remove the row first, restore the full previous list
  // on failure. We snapshot the whole array rather than just the deleted task
  // so the restored order is exact.
  async function remove(task) {
    const previous = tasks
    setTasks((cur) => cur.filter((t) => t.id !== task.id))
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      // 204 has no body and `res.ok` is true for it, but the explicit check
      // is harmless and self-documenting.
      if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`)
    } catch (err) {
      setTasks(previous)
      setError(err.message)
    }
  }

  // Derived state — computed on every render. Cheap for small lists; don't
  // reach for useMemo until you've measured a perf problem.
  const visible = tasks.filter(FILTERS[filter])
  const doneCount = tasks.filter((t) => t.done).length

  return (
    <main className="app">
      <h1>Tasks</h1>

      <form className="composer" onSubmit={addTask}>
        <input
          ref={inputRef}
          className="composer__input"
          placeholder="Add a task and press Enter"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <button className="composer__add" type="submit">
          Add
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <nav className="filters">
        {Object.keys(FILTERS).map((key) => (
          <button
            key={key}
            type="button"
            className={`filters__btn${filter === key ? ' filters__btn--active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {key}
          </button>
        ))}
      </nav>

      <ul className="tasks">
        {visible.length === 0 && <li className="tasks__empty">Nothing here.</li>}
        {visible.map((t) => (
          <li key={t.id} className="task">
            {/* Wrapping the checkbox + title in a <label> makes both clickable
                — clicking the title text toggles the checkbox. Native HTML
                behaviour, no extra handlers needed. */}
            <label className="task__check">
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t)}
              />
              <span className={`task__title${t.done ? ' task__title--done' : ''}`}>
                {t.title}
              </span>
            </label>
            <button
              type="button"
              className="task__delete"
              aria-label={`delete ${t.title}`}
              onClick={() => remove(t)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <footer className="footer">
        {/* Footer shows the total against ALL tasks, not the filtered view,
            so the count is stable as the user toggles filters. */}
        {doneCount} of {tasks.length} done
      </footer>
    </main>
  )
}

// Flatten Rails' `{ field: ["msg", ...] }` errors into a single string. Good
// enough for an exercise; a real app would render them inline per-field.
function formatErrors(errors) {
  if (!errors) return 'Something went wrong'
  return Object.entries(errors)
    .flatMap(([k, vs]) => vs.map((v) => `${k} ${v}`))
    .join(', ')
}

export default App
