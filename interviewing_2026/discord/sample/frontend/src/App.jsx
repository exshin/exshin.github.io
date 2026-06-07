import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      <h1>React + Rails scaffold</h1>
      <p>Frontend (Vite + React) talking to a Rails API.</p>

      <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>GET /api/hello</h2>
        {error && <pre style={{ color: 'crimson' }}>Error: {error}</pre>}
        {!error && !data && <p>Loading…</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </section>
    </main>
  )
}

export default App
