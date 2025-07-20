import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [diagnosisCounts, setDiagnosisCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndCounts = async () => {
      setLoading(true);

      try {
        // Ambil session dan token pengguna saat ini
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          throw new Error('Tidak ada session aktif');
        }

        const token = session.access_token;

        // Ambil data users dari edge function
        const response = await fetch(
          'https://kcgnduwofdbfmscyoccw.functions.supabase.co/list-users',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(errorBody?.error || 'Gagal mengambil data pengguna');
        }

        const result = await response.json();
        setUsers(result.users || []);
      } catch (error) {
        console.error('Error mengambil users dari edge function:', error.message);
        setUsers([]);
      }

      // Hitung jumlah diagnosis berdasarkan user_id
      try {
        const { data: diagnoses, error: diagnosisError } = await supabase
          .from('diagnoses')
          .select('user_id');

        if (diagnosisError) {
          throw new Error(diagnosisError.message);
        }

        const counts = {};
        diagnoses.forEach((d) => {
          counts[d.user_id] = (counts[d.user_id] || 0) + 1;
        });
        setDiagnosisCounts(counts);
      } catch (error) {
        console.error('Gagal ambil data diagnosis:', error.message);
      }

      setLoading(false);
    };

    fetchUsersAndCounts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Memuat data pengguna...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">Daftar Pengguna</h1>
      <div className="overflow-auto rounded-lg shadow bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Tanggal Daftar</th>
              <th className="px-4 py-3 text-center">Jumlah Diagnosis</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    {user.user_metadata?.full_name || user.user_metadata?.name || '—'}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">{diagnosisCounts[user.id] || 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => navigate(`/admin/user/${user.id}`)}
                      className="px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                    >
                      Lihat Riwayat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
