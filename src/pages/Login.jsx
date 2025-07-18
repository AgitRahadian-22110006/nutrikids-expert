import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      if (profileData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/'); // kembali ke App.jsx
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-rose-100 to-pink-200 px-4">
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-rose-600 drop-shadow">
          Selamat Datang 👋
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-center bg-red-100 px-3 py-2 rounded-md text-sm">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 font-semibold rounded-lg shadow-lg transition"
          >
            Masuk
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="text-rose-600 hover:underline font-medium">
            Daftar di sini
          </a>
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-gray-600 hover:text-rose-600 transition"
          >
            <FaArrowLeft className="mr-2" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
