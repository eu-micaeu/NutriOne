import { useState } from 'react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Calculator } from './pages/Calculator'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Calculator />
      </div>
      <Footer />
    </div>
  )
}

export default App
