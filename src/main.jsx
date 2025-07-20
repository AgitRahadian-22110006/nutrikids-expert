import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DiagnosisForward from './pages/DiagnosisForward.jsx'
import History from './pages/History.jsx';


import './index.css'

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/diagnosis-forward" element={<DiagnosisForward />} />
        <Route path="/history" element={<History />} />
        {/* Tambahkan lebih banyak route di sini sesuai kebutuhan */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
