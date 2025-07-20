// src/pages/admin/AdminDashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-amber-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-rose-600 mb-6 text-center">
          Dashboard Admin
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Navigasi ke daftar pengguna */}
          <div
            onClick={() => navigate('/admin-users')}
            className="cursor-pointer bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl p-6 shadow-md transition duration-300"
          >
            <h2 className="text-xl font-semibold text-rose-700 mb-2">Kelola Pengguna</h2>
            <p className="text-sm text-gray-600">
              Lihat dan kelola data semua pengguna yang terdaftar dalam sistem.
            </p>
          </div>

          {/* Navigasi ke diagnosis pengguna tertentu */}
          <div
            onClick={() => navigate('/admin/diagnosis')}
            className="cursor-pointer bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl p-6 shadow-md transition duration-300"
          >
            <h2 className="text-xl font-semibold text-amber-700 mb-2">Lihat Diagnosis</h2>
            <p className="text-sm text-gray-600">
              Akses detail diagnosis pengguna berdasarkan ID.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
