// src/pages/admin/AdminUserDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [diagnoses, setDiagnoses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Ambil data user
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .eq('id', id)
        .single();

      if (!userError) setUser(userData);

      // Ambil data diagnosis
      const { data: diagnosisData, error: diagnosisError } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (!diagnosisError) setDiagnoses(diagnosisData);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Detail Pengguna & Riwayat Diagnosis</h1>

      {loading ? (
        <p>Memuat...</p>
      ) : (
        <>
          {user ? (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3">Informasi Pengguna</h2>
              <div className="space-y-1 text-sm text-gray-800">
                <p><strong>Nama:</strong> {user.full_name || '-'}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p>
                  <strong>Role:</strong>{' '}
                  <span className={`inline-block px-2 py-0.5 text-white rounded text-xs ${user.role === 'admin' ? 'bg-blue-600' : 'bg-gray-500'}`}>
                    {user.role}
                  </span>
                </p>
                <p><strong>Bergabung:</strong> {new Date(user.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          ) : (
            <p className="text-red-600 mb-4">Data pengguna tidak ditemukan.</p>
          )}

          <div className="bg-white rounded shadow">
            <h2 className="text-lg font-semibold p-4 border-b">Riwayat Diagnosis</h2>
            {diagnoses.length === 0 ? (
              <p className="px-4 py-6">Tidak ada data diagnosis.</p>
            ) : (
              <table className="min-w-full text-sm text-left text-gray-700">
                <thead className="bg-emerald-600 text-white">
                  <tr>
                    <th className="px-4 py-3">Anak</th>
                    <th className="px-4 py-3">Usia (bulan)</th>
                    <th className="px-4 py-3">Diagnosa</th>
                    <th className="px-4 py-3">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="px-4 py-3">{d.child_name}</td>
                      <td className="px-4 py-3">{d.age_months}</td>
                      <td className="px-4 py-3">{d.diagnosis}</td>
                      <td className="px-4 py-3">
                        {new Date(d.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
