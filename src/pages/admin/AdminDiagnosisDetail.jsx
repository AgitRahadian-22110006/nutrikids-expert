import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { handleDownloadPDF } from "../../utils/pdfUtils.js";

export default function AdminDiagnosisDetail() {
  const { id } = useParams(); // gunakan nama param "id", bukan "diagnosisId"
  const [diagnosis, setDiagnosis] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      console.error("Diagnosis ID tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchUserAndDiagnosis = async () => {
      try {
        const { data: diagnosisData, error: diagnosisError } = await supabase
          .from('diagnoses')
          .select('*')
          .eq('id', id)
          .single();

        if (diagnosisError || !diagnosisData) {
          console.error('Gagal ambil diagnosis:', diagnosisError?.message);
          return;
        }

        setDiagnosis(diagnosisData);

        const userId = diagnosisData.user_id;
        const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(userId);
        if (!isValidUUID) {
          console.error("user_id bukan UUID valid:", userId);
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', userId)
          .single();

        if (userError || !userData) {
          console.error('Gagal ambil profil:', userError?.message);
          return;
        }

        setUser(userData);
      } catch (err) {
        console.error('Terjadi kesalahan saat fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDiagnosis();
  }, [id]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Memuat data...</p>;

  if (!diagnosis || !user) return (
    <div className="text-center mt-10 text-red-500">
      Data tidak ditemukan atau terjadi kesalahan.
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-emerald-700 underline mb-4"
      >
        ← Kembali
      </button>

      <h1 className="text-2xl font-bold text-emerald-800 mb-2">Detail Diagnosis</h1>
      <p className="text-gray-700 mb-6">
        <strong>Nama:</strong> {user.full_name} <br />
        <strong>Email:</strong> {user.email}
      </p>

      <div className="overflow-hidden rounded-lg shadow bg-white p-6">
        <table className="table-auto w-full text-sm text-left text-gray-700">
          <tbody>
            <tr><td className="py-2 font-semibold">Tanggal</td><td>{new Date(diagnosis.created_at).toLocaleDateString('id-ID')}</td></tr>
            <tr><td className="py-2 font-semibold">Nama Anak</td><td>{diagnosis.child_name}</td></tr>
            <tr><td className="py-2 font-semibold">Usia</td><td>{diagnosis.age_months} bulan</td></tr>
            <tr><td className="py-2 font-semibold">Berat Badan</td><td>{diagnosis.weight_kg} kg</td></tr>
            <tr><td className="py-2 font-semibold">Tinggi Badan</td><td>{diagnosis.height_cm} cm</td></tr>
            <tr><td className="py-2 font-semibold">Kategori HAZ</td><td>{diagnosis.haz_category}</td></tr>
            <tr><td className="py-2 font-semibold">Kategori WHZ</td><td>{diagnosis.whz_category}</td></tr>
            <tr><td className="py-2 font-semibold">Diagnosis</td><td>{diagnosis.diagnosis}</td></tr>
          </tbody>
        </table>

        <div className="mt-6 text-center">
          <button
            onClick={() => handleDownloadPDF(diagnosis)}
            className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
