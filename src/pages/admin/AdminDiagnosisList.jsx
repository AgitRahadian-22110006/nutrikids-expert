import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const AdminDiagnosisList = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiagnoses = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('diagnoses')
      .select(`
        id,
        parent_name,
        child_name,
        age_months,
        gender,
        weight_kg,
        height_cm,
        haz_z,
        whz_z,
        haz_category,
        whz_category,
        diagnosis,
        recommendation,
        rule_id,
        created_at,
        profiles (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching diagnoses:', error);
      setError(error.message);
    } else {
      setDiagnoses(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  if (loading) return <div className="text-center py-10 text-blue-500 text-lg animate-pulse">Memuat data diagnosis...</div>;
  if (error) return <div className="text-red-600 text-center py-4">Terjadi kesalahan: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">📋 Daftar Diagnosis</h1>

      {diagnoses.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">Belum ada data diagnosis yang tersedia.</div>
      ) : (
        <div className="overflow-auto rounded-lg shadow-md border border-gray-200 bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-blue-100 text-xs uppercase font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Nama Orang Tua</th>
                <th className="px-4 py-3">Nama Anak</th>
                <th className="px-4 py-3">Usia (bulan)</th>
                <th className="px-4 py-3">Jenis Kelamin</th>
                <th className="px-4 py-3">Berat (kg)</th>
                <th className="px-4 py-3">Tinggi (cm)</th>
                <th className="px-4 py-3">HAZ</th>
                <th className="px-4 py-3">WHZ</th>
                <th className="px-4 py-3">Kategori HAZ</th>
                <th className="px-4 py-3">Kategori WHZ</th>
                <th className="px-4 py-3">Diagnosis</th>
                <th className="px-4 py-3">Rule ID</th>
                <th className="px-4 py-3">Didiagnosis Oleh</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {diagnoses.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50 transition duration-200 border-t border-gray-100 text-center"
                >
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{item.parent_name}</td>
                  <td className="px-3 py-2">{item.child_name}</td>
                  <td className="px-3 py-2">{item.age_months}</td>
                  <td className="px-3 py-2">{item.gender}</td>
                  <td className="px-3 py-2">{item.weight_kg}</td>
                  <td className="px-3 py-2">{item.height_cm}</td>
                  <td className="px-3 py-2">{item.haz_z}</td>
                  <td className="px-3 py-2">{item.whz_z}</td>
                  <td className="px-3 py-2">{item.haz_category}</td>
                  <td className="px-3 py-2">{item.whz_category}</td>
                  <td className="px-3 py-2 font-semibold text-blue-600">{item.diagnosis}</td>
                  <td className="px-3 py-2">{item.rule_id}</td>
                  <td className="px-3 py-2">{item.profiles?.full_name || 'Tidak diketahui'}</td>
                  <td className="px-3 py-2">{item.profiles?.email || '-'}</td>
                  <td className="px-3 py-2 text-xs">{new Date(item.created_at).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDiagnosisList;
