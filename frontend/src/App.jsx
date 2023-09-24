import { useState } from 'react'
import './App.css'
import Title from './components/Title'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Title />
    </>
  )
}

export default App
