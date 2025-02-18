import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Login } from './components/Login'
import { Route, Routes } from 'react-router-dom'
import { SignUp } from './components/SignUp'
import { NavBar } from './components/NavBar'

function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default App
