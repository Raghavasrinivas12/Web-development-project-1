import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Signin from './pages/Signin'
import Home from './pages/Home'
function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/signin' element={<Signin/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
