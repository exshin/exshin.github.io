import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [rowInput, setRowInput] = useState()
  const labelNames = ["A", "B", "C", "D"]
  let valuesMap = {
    "A": "", "B": "", "C": "", "D": ""
  }

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
  }, [])


  function changeInput(inputValue, labelName) {
    const checkValue = parseInt(inputValue);
    console.log(isNaN(checkValue));
    console.log(inputValue);

    if (isNaN(checkValue)) { // string input so Add values together based on Vars
      calcValues(inputValue)
    } else { // number so output value
      console.log(inputValue)
      inputValue
    }

    valuesMap[labelName] = inputValue
  }

  function calcValues(inputValue) {
    let result = 0
    const strings = inputValue.split("")
 
    for (const letter of strings) {
      result += valuesMap[letter]
    }
  }

  const rows = Object.entries(labelNames).map((labelName) => 
    
    
    <div>
      <div id="label-">{labelName}</div>
      <div id="input">
        <input onChange={(e) => changeInput(e.target.value, labelName)}></input>
      </div>
      <div id="output">TEST</div>
    </div>
  )

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 640, margin: '0 auto' }}>
      {rows}
 
      
      
{/*       
      <h1>React + Rails scaffold</h1>
      <p>Frontend (Vite + React) talking to a Rails API.</p>

      <section style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>GET /api/hello</h2>
        {error && <pre style={{ color: 'crimson' }}>Error: {error}</pre>}
        {!error && !data && <p>Loading…</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </section> */}
    </main>
  )
}

export default App
