// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DiagnosisForward from './pages/DiagnosisForward.jsx';
import History from './pages/History.jsx';

// src/main.jsx
import AdminDashboard from './pages/admin/AdminDashboard.jsx'; // ✅


import AdminUserList from './pages/admin/AdminUserList.jsx';
import AdminDiagnosisDetail from './pages/admin/AdminDiagnosisDetail.jsx';
import AdminDiagnosisList from './pages/admin/AdminDiagnosisList';
import AdminUserDetail from './pages/admin/AdminUserDetail'; 

import './index.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Halaman utama */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/diagnosis-forward" element={<DiagnosisForward />} />
        <Route path="/history" element={<History />} />

        {/* Admin area */}
        <Route path="/admin-users" element={<AdminUserList />} />
        <Route path="/admin/diagnosis/:id" element={<AdminDiagnosisDetail />} />
       <Route path="/admin/diagnosis" element={<AdminDiagnosisList />} />
       <Route path="/admin/user/:id" element={<AdminUserDetail />} />
       <Route path="/admin-dashboard" element={<AdminDashboard />} />
       

        {/* ↑ Pastikan path ini sama dengan URL yang kamu navigasikan */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
