import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHAZReference, getWHZReference, whoReference } from '../data/whoReference';
import { calculateZScore, categorizeHAZ, categorizeWHZ } from '../utils/calculateZScore';
import { forwardChaining, explainRuleTrace } from '../utils/forwardChaining';
import { supabase } from '../utils/supabaseClient';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { saveDiagnosis } from '../services/diagnosisService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function DiagnosisForward() {
  const navigate = useNavigate();
  const hasilRef = useRef(null);

  useEffect(() => {
    const checkLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
    };
    checkLogin();
  }, [navigate]);

  const [form, setForm] = useState({
    parentName: '',
    childName: '',
    ageMonths: '',
    gender: 'male',
    weight: '',
    height: ''
  });

  const [result, setResult] = useState(null);
  const [trace, setTrace] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { parentName, childName, ageMonths, gender, weight, height } = form;

    if (!parentName || !childName || !ageMonths || !weight || !height) {
      alert('Semua kolom harus diisi.');
      return;
    }

    const age = parseInt(ageMonths);
    const heightCm = parseFloat(height);
    const weightKg = parseFloat(weight);

    if (age <= 0 || heightCm <= 0 || weightKg <= 0) {
      alert('Usia, tinggi, dan berat harus lebih dari 0.');
      return;
    }

    try {
      const hazRef = getHAZReference(age, gender);
      const whzRef = getWHZReference(parseFloat(heightCm.toFixed(1)), gender);

      if (!hazRef || !whzRef) {
        alert('Data referensi WHO tidak ditemukan untuk usia/tinggi/gender tersebut.');
        return;
      }

      const hazZ = calculateZScore(heightCm, hazRef);
      const whzZ = calculateZScore(weightKg, whzRef);

      const hazCategory = categorizeHAZ(hazZ);
      const whzCategory = categorizeWHZ(whzZ);

      const facts = { HAZ: hazCategory, WHZ: whzCategory };
      const diagnosisResult = forwardChaining(facts);
      const explanation = explainRuleTrace(facts);

      setResult({
        parentName,
        childName,
        age,
        gender,
        weight: weightKg,
        height: heightCm,
        hazZ,
        whzZ,
        hazCategory,
        whzCategory,
        ...diagnosisResult
      });

      setTrace(explanation);

      // Simpan record diagnosa
      const { data: { user }, error: userErr } = await supabase.auth.getUser ();
      if (userErr) throw userErr;

      await saveDiagnosis({
        user_id: user.id,
        parent_name: parentName,
        child_name: childName,
        age_months: age,
        gender,
        weight_kg: weightKg,
        height_cm: heightCm,
        haz_z: hazZ,
        whz_z: whzZ,
        haz_category: hazCategory,
        whz_category: whzCategory,
        diagnosis: diagnosisResult.diagnosis,
        recommendation: diagnosisResult.recommendation,
        rule_id: diagnosisResult.ruleId
      });
      console.log('Diagnosa tersimpan ke riwayat.');

    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
    }
  };

  // Siapkan data grafik HAZ
  const prepareHAZData = () => {
    const ref = whoReference.hazLookup[form.gender] || {};
    return Object.entries(ref).map(([age, { L, M, S }]) => {
      const d = { age: Number(age) };
      for (let z of [-3, -2, -1, 0, 1, 2, 3]) {
        d[`sd${z}`] = L
          ? parseFloat((M * Math.pow(1 + L * S * z, 1 / L)).toFixed(1))
          : parseFloat((M * Math.exp(S * z)).toFixed(1));
      }
      if (result && Number(age) === result.age) d.child = result.height;
      return d;
    }).sort((a, b) => a.age - b.age);
  };

  // Siapkan data grafik WHZ
  const prepareWHZData = () => {
    const ref = whoReference.whzLookup[form.gender] || {};
    return Object.entries(ref).map(([h, { L, M, S }]) => {
      const d = { height: Number(h) };
      for (let z of [-3, -2, -1, 0, 1, 2, 3]) {
        d[`sd${z}`] = L
          ? parseFloat((M * Math.pow(1 + L * S * z, 1 / L)).toFixed(1))
          : parseFloat((M * Math.exp(S * z)).toFixed(1));
      }
      if (result && Number(h).toFixed(1) === result.height.toFixed(1)) d.child = result.weight;
      return d;
    }).sort((a, b) => a.height - b.height);
  };

  const handleDownloadPDF = async () => {
    try {
      if (!hasilRef.current) {
        alert('Hasil diagnosa belum tersedia!');
        return;
      }

      const element = hasilRef.current;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#f0fdf4"
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);

      // Hitung ukuran gambar agar tinggi pas dengan halaman
      const pdfHeight = pageHeight;
      const pdfWidth = (imgProps.width * pdfHeight) / imgProps.height;

      const x = (pageWidth - pdfWidth) / 2; // agar center
      const y = 0;

      pdf.addImage(
        imgData,
        'JPEG',
        x,
        y,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );

      pdf.save(
        `NutriKids_Expert_Hasil_Diagnosa_${result?.childName?.replace(/\s+/g, '_') || 'Anak'}.pdf`
      );

    } catch (err) {
      alert('Gagal membuat PDF: ' + err.message);
      console.error('PDF Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-2 py-4 sm:px-4 sm:py-8">
      <div className="max-w-3xl mx-auto bg-white p-3 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center mb-6 gap-3">
          <img src="/assets/logo-expert.png" alt="NutriKids Logo" className="h-12 sm:h-14 mr-0 sm:mr-4" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 text-center sm:text-left">
            Diagnosis Gizi Anak - Forward Chaining
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <input type="text" name="parentName" placeholder="Nama Orang Tua" value={form.parentName} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md focus:ring text-sm" />
          <input type="text" name="childName" placeholder="Nama Anak" value={form.childName} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md text-sm" />
          <input type="number" name="ageMonths" placeholder="Usia (0 - 60 bulan)" value={form.ageMonths} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md text-sm" />
          <select name="gender" value={form.gender} onChange={handleChange} className="p-2 border border-emerald-300 rounded-md text-sm">
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          <input type="number" name="weight" step="0.1" placeholder="Berat Badan (kg)" value={form.weight} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md text-sm" />
          <input type="number" name="height" step="0.1" placeholder="Tinggi Badan (45 - 120 cm) sesuai usia" value={form.height} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md text-sm" />
          <div className="sm:col-span-2 flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
            <a href="/" className="text-emerald-600 hover:underline flex items-center space-x-1 text-sm">
              <FaArrowLeft /> <span>Kembali ke Beranda</span>
            </a>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow text-sm w-full sm:w-auto">
              Diagnosa
            </button>
          </div>
        </form>

        {result && (
          <>
            <div className="flex justify-end mt-4 z-50 relative">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow text-sm"
                aria-label="Download PDF"
                style={{ zIndex: 1000, position: "relative" }}
              >
                <FaDownload /> Download PDF
              </button>
            </div>
            <div
              ref={hasilRef}
              style={{
                background: "#f0fdf4",
                borderRadius: "12px",
                padding: "24px",
                marginTop: "32px",
                boxShadow: "0 2px 8px 0 rgba(16,185,129,0.08)",
                border: "1px solid #bbf7d0",
                color: "#374151",
                fontFamily: "Arial, sans-serif",
                maxWidth: "800px",
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <h2 style={{ color: "#047857", fontWeight: 600, fontSize: "1.25rem", marginBottom: "1rem" }}>
                Hasil Diagnosa
              </h2>
              {/* Data hasil */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.95rem" }}>
                <p><strong>Nama Anak:</strong> {result.childName}</p>
                <p><strong>Nama Orang Tua:</strong> {result.parentName}</p>
                <p><strong>Usia:</strong> {result.age} bulan</p>
                <p><strong>Jenis Kelamin:</strong> {result.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                <p><strong>Berat:</strong> {result.weight} kg</p>
                <p><strong>Tinggi:</strong> {result.height} cm</p>
                <p><strong>Z-Score HAZ:</strong> {result.hazZ.toFixed(2)} → <strong>{result.hazCategory}</strong></p>
                <p><strong>Z-Score WHZ:</strong> {result.whzZ.toFixed(2)} → <strong>{result.whzCategory}</strong></p>
              </div>
              {/* Diagnosis & rekomendasi */}
              {result.diagnosis ? (
                <div style={{ marginTop: "24px" }}>
                  <p style={{ fontWeight: "bold", color: "#047857", marginBottom: "8px" }}>
                    Diagnosis: {result.diagnosis}
                  </p>
                  <ul style={{ marginLeft: "20px", fontSize: "0.95rem" }}>
                    {/* Tambahkan safe‑guard di sini */}
                    {(result.recommendation ?? []).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: "8px" }}>Rule ID: {result.ruleId}</p>
                </div>
              ) : (
                <p style={{ color: "#dc2626", fontWeight: 500, marginTop: "24px" }}>Tidak ditemukan rule yang cocok.</p>
              )}

              {/* Grafik HAZ */}
              <div style={{ marginTop: "32px", overflow: "hidden" }}>
                <h3 style={{ color: "#047857", fontWeight: 600, fontSize: "1.1rem", marginBottom: "8px" }}>
                  Grafik Tinggi per Usia (HAZ)
                </h3>
                <div style={{
                  width: "100%",
                  height: "250px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px 0 rgba(16,185,129,0.08)",
                  border: "1px solid #bbf7d0",
                  padding: "16px",
                  overflow: "hidden"
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareHAZData() || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="age"
                        label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                        fontSize={10}
                      />
                      <YAxis
                        label={{ value: 'Tinggi (cm)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                        fontSize={10}
                      />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
                      {[-3, -2, -1, 0, 1, 2, 3].map(z => (
                        <Line
                          key={z}
                          dataKey={`sd${z}`}
                          stroke={z === 0 ? '#2d6a4f' : '#74c69d'}
                          strokeWidth={z === 0 ? 3 : 1}
                          dot={false}
                          name={`SD ${z}`}
                        />
                      ))}
                      <Line
                        type="monotone"
                        dataKey="child"
                        stroke="#1b4332"
                        strokeWidth={4}
                        dot={{ r: 5, fill: '#1b4332' }}
                        name="Anak Anda"
                        label={
                          result
                            ? {
                                position: 'top',
                                value: `Z: ${result.hazZ.toFixed(2)} (${result.hazCategory})`,
                                fill: '#1b4332',
                                fontSize: 10,
                              }
                            : undefined
                        }
                      />
                      {result && (
                        <ReferenceLine
                          x={result.age}
                          stroke="#1b4332"
                          strokeDasharray="4 4"
                          label={{
                            value: `Usia: ${result.age} bln`,
                            position: 'top',
                            fill: '#1b4332',
                            fontSize: 10,
                          }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grafik WHZ */}
              <div style={{ marginTop: "32px", overflow: "hidden" }}>
                <h3 style={{ color: "#047857", fontWeight: 600, fontSize: "1.1rem", marginBottom: "8px" }}>
                  Grafik Berat per Tinggi (WHZ)
                </h3>
                <div style={{
                  width: "100%",
                  height: "250px",
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px 0 rgba(16,185,129,0.08)",
                  border: "1px solid #bbf7d0",
                  padding: "16px",
                  overflow: "hidden"
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareWHZData() || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="height"
                        label={{ value: 'Tinggi (cm)', position: 'insideBottom', offset: -5, fontSize: 10 }}
                        fontSize={10}
                      />
                      <YAxis
                        label={{ value: 'Berat (kg)', angle: -90, position: 'insideLeft', fontSize: 10 }}
                        fontSize={10}
                      />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 10 }} />
                        {[-3, -2, -1, 0, 1, 2, 3].map(z => (
                        <Line
                          key={z}
                          dataKey={`sd${z}`}
                          stroke={z === 0 ? '#1b4332' : '#40916c'}
                          strokeWidth={z === 0 ? 3 : 1}
                          dot={false}
                          name={`SD ${z}`}
                        />
                      ))}
                      <Line
                        type="monotone"
                        dataKey="child"
                        stroke="#081c15"
                        strokeWidth={4}
                        dot={{ r: 5, fill: '#081c15' }}
                        name="Anak Anda"
                        label={
                          result
                            ? {
                                position: 'top',
                                value: `Z: ${result.whzZ.toFixed(2)} (${result.whzCategory})`,
                                fill: '#081c15',
                                fontSize: 10,
                              }
                            : undefined
                        }
                      />
                      {result && (
                        <ReferenceLine
                          x={parseFloat(result.height.toFixed(1))}
                          stroke="#081c15"
                          strokeDasharray="4 4"
                          label={{
                            value: `Tinggi: ${result.height} cm`,
                            position: 'top',
                            fill: '#081c15',
                            fontSize: 10,
                          }}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Jejak inferensi */}
              <details style={{ marginTop: "32px", fontSize: "0.95rem" }}>
                <summary style={{ color: "#059669", cursor: "pointer" }}>Lihat jejak inferensi</summary>
                <pre style={{
                  background: "#f3f4f6",
                  padding: "12px",
                  marginTop: "8px",
                  borderRadius: "8px",
                  overflowX: "auto",
                  wordBreak: "break-word",
                  maxWidth: "100%"
                }}>{trace}</pre>
              </details>
            </div>
          </>
        )}

        {/* Deskripsi sistem pakar */}
        <section className="mt-10 sm:mt-16 bg-gradient-to-b from-white to-emerald-50 p-3 sm:p-8 rounded-xl shadow-md border border-emerald-200">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-emerald-700 mb-3 sm:mb-6 text-center">
            🧠 Tentang Sistem Pakar <span className="text-emerald-600">NutriKids Expert</span>
          </h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-3 sm:mb-6 text-justify">
            <strong>NutriKids Expert</strong> adalah <strong>sistem pakar gizi anak berbasis web</strong> yang membantu orang tua dan tenaga medis mendiagnosis status gizi balita secara cepat dan akurat. Sistem ini menggunakan <strong>metode Forward Chaining</strong> (penelusuran fakta ke kesimpulan) dan seluruh acuan diagnosa merujuk pada <strong>standar WHO</strong>.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 text-sm sm:text-base text-gray-700">
            {/* Box 1 - Metode */}
            <div className="bg-emerald-100 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col h-full">
              <h4 className="text-emerald-700 font-semibold text-base sm:text-lg mb-1">📌 Metode Diagnosa</h4>
              <p className="leading-relaxed text-justify">
                Forward Chaining merupakan metode penalaran berbasis fakta → aturan → kesimpulan. Sistem akan menganalisis data awal (usia, berat, tinggi, dan jenis kelamin) dan menghitung <strong>Z-score HAZ & WHZ</strong>. Hasil ini kemudian digunakan untuk menelusuri basis pengetahuan dan menemukan <strong>diagnosa yang sesuai</strong> berdasarkan aturan pakar.
              </p>
            </div>
            
            {/* Box 2 - Input */}
            <div className="bg-emerald-100 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col h-full">
              <h4 className="text-emerald-700 font-semibold text-base sm:text-lg mb-1">📝 Data yang Diperlukan</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Nama lengkap orang tua & anak</li>
                <li>Usia anak (bulan, 0–60)</li>
                <li>Jenis kelamin anak</li>
                <li>Berat badan (kg)</li>
                <li>Tinggi badan (cm)</li>
              </ul>
            </div>
            
            {/* Box 3 - Output */}
            <div className="bg-emerald-100 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col h-full">
              <h4 className="text-emerald-700 font-semibold text-base sm:text-lg mb-1">📈 Hasil Diagnosa</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Nilai Z-score HAZ (Height-for-Age)</li>
                <li>Nilai Z-score WHZ (Weight-for-Height)</li>
                <li>Kategori status gizi menurut WHO</li>
                <li>Diagnosis & rekomendasi</li>
                <li>Jejak aturan (rule tracing)</li>
                <li>Visualisasi grafik HAZ & WHZ</li>
              </ul>
            </div>
            
            {/* Box 4 - Klasifikasi */}
            <div className="bg-emerald-100 rounded-lg p-3 sm:p-4 shadow-sm flex flex-col h-full">
              <h4 className="text-emerald-700 font-semibold text-base sm:text-lg mb-1">🔍 Kategori Status Gizi Anak (WHO)</h4>
              <p className="mb-1">Kategori status gizi anak yang digunakan pada sistem ini:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Stunting Berat / Gizi Buruk Akut</li>
                <li>Stunting Berat / Gizi Buruk</li>
                <li>Stunting Berat / Risiko Kurus</li>
                <li>Stunting Berat</li>
                <li>Stunting Berat / Risiko BB Lebih</li>
                <li>Stunting Berat / BB Lebih</li>
                <li>Stunting Berat / Obesitas</li>
                <li>Stunting Sedang / Gizi Buruk Akut</li>
                <li>Stunting Sedang / Gizi Buruk</li>
                <li>Stunting Sedang / Risiko Kurus</li>
                <li>Stunting Sedang</li>
                <li>Stunting Sedang / Risiko BB Lebih</li>
                <li>Stunting Sedang / BB Lebih</li>
                <li>Stunting Sedang / Obesitas</li>
                <li>Risiko Stunting / Gizi Buruk Akut</li>
                <li>Risiko Stunting / Gizi Buruk</li>
                <li>Risiko Stunting / Risiko Kurus</li>
                <li>Risiko Stunting</li>
                <li>Risiko Stunting / Risiko BB Lebih</li>
                <li>Risiko Stunting / BB Lebih</li>
                <li>Risiko Stunting / Obesitas</li>
                <li>Gizi Buruk Akut</li>
                <li>Underweight</li>
                <li>Risiko Underweight</li>
                <li>Gizi Normal</li>
                <li>Risiko BB Lebih</li>
                <li>BB Lebih</li>
                <li>Obesitas</li>
              </ul>
              <div className="mt-2 text-xs text-gray-500">
                <span className="block">Keterangan:</span>
                <span className="block">HAZ = Height-for-Age Z-score</span>
                <span className="block">WHZ = Weight-for-Height Z-score</span>
                <span className="block">Kategori diambil dari kombinasi HAZ & WHZ sesuai standar WHO dan basis aturan NutriKids Expert.</span>
              </div>
            </div>
          </div>
          
          {/* Penutup */}
          <div className="mt-5 sm:mt-8 text-xs sm:text-sm text-gray-600 border-t pt-3 sm:pt-4">
            ⚠️ <strong>Disclaimer:</strong> NutriKids Expert bukan pengganti konsultasi langsung dengan dokter atau ahli gizi. Sistem ini hanya memberikan <strong>diagnosa awal berbasis data WHO</strong> dan <strong>aturan pakar</strong> sebagai alat bantu edukatif.
          </div>
        </section>
      </div>
    </div>
  );
}

export default DiagnosisForward;
