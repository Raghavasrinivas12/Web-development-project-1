import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Register from './pages/Register'
import Signin from './pages/Signin'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Signin />
    </>
  )
}

export default App
