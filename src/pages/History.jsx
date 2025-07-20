import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDiagnoses } from '../services/diagnosisService';
import MiniHAZChart from '../components/miniHAZChart';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';
import { handleDownloadPDF } from '../utils/pdfUtils';

export default function History() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [records, setRecords] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/login');
      } else {
        setUserId(user.id);
      }
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      try {
        const data = await fetchDiagnoses({ userId, fromDate, toDate });
        setRecords(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [userId, fromDate, toDate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#e7f7f6] to-[#ccf2f1] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-expert.png"
              alt="NutriKids Expert Logo"
              className="h-12 w-12"
            />
            <h1 className="text-3xl font-extrabold text-emerald-700">
              NutriKids Expert
            </h1>
          </div>
          <span className="text-gray-500 hidden sm:block">Riwayat Diagnosa Anak</span>
        </div>

        {/* Filter Tanggal */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <label className="text-gray-700 font-medium">
            Dari:
            <input
              type="date"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="block mt-1 border border-gray-300 rounded px-3 py-2 w-full sm:w-48 shadow-sm focus:ring-emerald-400 focus:border-emerald-500"
            />
          </label>
          <label className="text-gray-700 font-medium">
            Sampai:
            <input
              type="date"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="block mt-1 border border-gray-300 rounded px-3 py-2 w-full sm:w-48 shadow-sm focus:ring-emerald-400 focus:border-emerald-500"
            />
          </label>
        </div>

        {/* Tabel Riwayat */}
        <div className="overflow-auto rounded shadow-lg bg-white">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Nama Anak</th>
                <th className="p-3 text-left">Diagnosis</th>
                <th className="p-3 text-center">Chart</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    Tidak ada data diagnosa ditemukan.
                  </td>
                </tr>
              ) : (
                records.map(rec => (
                  <tr key={rec.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{new Date(rec.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="p-3">{rec.child_name}</td>
                    <td className="p-3">{rec.diagnosis}</td>
                    <td className="p-3 text-center">
                      <MiniHAZChart
                        age={rec.age_months}
                        height={rec.height_cm}
                        gender={rec.gender}
                      />
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDownloadPDF(rec)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-emerald-500 text-white rounded hover:bg-emerald-600 transition"
                      >
                        <FaDownload />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded bg-emerald-700 text-white font-semibold shadow hover:bg-emerald-800 transition"
          >
            <FaArrowLeft />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
