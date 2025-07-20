import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDiagnoses } from '../services/diagnosisService';
import MiniHAZChart from '../components/miniHAZChart';
import { FaDownload } from 'react-icons/fa';
import { supabase } from '../utils/supabaseClient';
import { handleDownloadPDF } from '../utils/pdfUtils';

export default function History() {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [records, setRecords] = useState([]);
  const [userId, setUserId] = useState(null);

  // Ambil user ID saat mount
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

  // Load data saat userId atau filter berubah
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Riwayat Diagnosa</h2>

      {/* Filter Tanggal */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Tabel Riwayat */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Tanggal</th>
            <th className="p-2 border">Nama Anak</th>
            <th className="p-2 border">Diagnosis</th>
            <th className="p-2 border">Chart</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {records.map(rec => (
            <tr key={rec.id}>
              <td className="p-2 border">
                {new Date(rec.created_at).toLocaleDateString('id-ID')}
              </td>
              <td className="p-2 border">{rec.child_name}</td>
              <td className="p-2 border">{rec.diagnosis}</td>
              <td className="p-2 border">
                <MiniHAZChart
                  age={rec.age_months}
                  height={rec.height_cm}
                  gender={rec.gender}
                />
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleDownloadPDF(rec)}
                  className="text-green-600 hover:text-green-800"
                >
                  <FaDownload />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
