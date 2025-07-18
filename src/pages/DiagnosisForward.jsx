import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHAZReference, getWHZReference, whoReference } from '../data/whoReference';
import { calculateZScore, categorizeHAZ, categorizeWHZ } from '../utils/calculateZScore';
import { forwardChaining, explainRuleTrace } from '../utils/forwardChaining';
import { supabase } from '../utils/supabaseClient';
import { FaArrowLeft } from 'react-icons/fa';
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
  Label,
} from 'recharts';

function DiagnosisForward() {
  const navigate = useNavigate();

  // Cek login user
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

  const handleSubmit = e => {
    e.preventDefault();
    const { parentName, childName, ageMonths, gender, weight, height } = form;

    // Validasi angka
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
    } catch (err) {
      alert('Terjadi kesalahan: ' + err.message);
    }
  };

  // Siapkan data grafik HAZ
  const prepareHAZData = () => {
    const ref = whoReference.hazLookup[form.gender];
    return Object.entries(ref).map(([age, { L, M, S }]) => {
      const data = { age: Number(age) };
      for (let z of [-3, -2, -1, 0, 1, 2, 3]) {
        // Inverse LMS: X = M * (1 + L*S*z)^(1/L)
        data[`sd${z}`] = L !== 0
          ? parseFloat((M * Math.pow(1 + L * S * z, 1 / L)).toFixed(1))
          : parseFloat((M * Math.exp(S * z)).toFixed(1));
      }
      if (result && Number(age) === result.age) {
        data.child = result.height;
      }
      return data;
    }).sort((a, b) => a.age - b.age);
  };

  // Siapkan data grafik WHZ
  const prepareWHZData = () => {
    const ref = whoReference.whzLookup[form.gender];
    return Object.entries(ref).map(([h, { L, M, S }]) => {
      const data = { height: Number(h) };
      for (let z of [-3, -2, -1, 0, 1, 2, 3]) {
        data[`sd${z}`] = L !== 0
          ? parseFloat((M * Math.pow(1 + L * S * z, 1 / L)).toFixed(1))
          : parseFloat((M * Math.exp(S * z)).toFixed(1));
      }
      if (result && Number(h).toFixed(1) === result.height.toFixed(1)) {
        data.child = result.weight;
      }
      return data;
    }).sort((a, b) => a.height - b.height);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <img src="/assets/logo-expert.png" alt="NutriKids Logo" className="h-14 mr-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">Diagnosis Gizi Anak - Forward Chaining</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <input type="text" name="parentName" placeholder="Nama Orang Tua" value={form.parentName} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md focus:ring" />
          <input type="text" name="childName" placeholder="Nama Anak" value={form.childName} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md" />
          <input type="number" name="ageMonths" placeholder="Usia (bulan)" value={form.ageMonths} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md" />
          <select name="gender" value={form.gender} onChange={handleChange} className="p-2 border border-emerald-300 rounded-md">
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
          <input type="number" name="weight" step="0.1" placeholder="Berat Badan (kg)" value={form.weight} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md" />
          <input type="number" name="height" step="0.1" placeholder="Tinggi Badan (cm)" value={form.height} onChange={handleChange} required className="p-2 border border-emerald-300 rounded-md" />
          <div className="md:col-span-2 flex justify-between items-center mt-4">
            <a href="/" className="text-emerald-600 hover:underline flex items-center space-x-1">
              <FaArrowLeft /> <span>Kembali ke Beranda</span>
            </a>
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md shadow">
              Diagnosa
            </button>
          </div>
        </form>

        {result && (
          <>
            <div className="mt-8 bg-emerald-50 border border-emerald-200 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-emerald-700 mb-3">Hasil Diagnosa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
                <p><strong>Nama Anak:</strong> {result.childName}</p>
                <p><strong>Nama Orang Tua:</strong> {result.parentName}</p>
                <p><strong>Usia:</strong> {result.age} bulan</p>
                <p><strong>Jenis Kelamin:</strong> {result.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</p>
                <p><strong>Berat:</strong> {result.weight} kg</p>
                <p><strong>Tinggi:</strong> {result.height} cm</p>
                <p><strong>Z-Score HAZ:</strong> {result.hazZ.toFixed(2)} → <strong>{result.hazCategory}</strong></p>
                <p><strong>Z-Score WHZ:</strong> {result.whzZ.toFixed(2)} → <strong>{result.whzCategory}</strong></p>
              </div>

              {result.diagnosis ? (
                <div className="mt-4">
                  <p className="font-bold text-emerald-700 mb-2">Diagnosis: {result.diagnosis}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {result.recommendation.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">Rule ID: {result.ruleId}</p>
                  <details className="mt-3 text-sm">
                    <summary className="text-emerald-600 cursor-pointer">Lihat jejak inferensi</summary>
                    <pre className="bg-gray-100 p-2 mt-1 rounded overflow-x-auto">{trace}</pre>
                  </details>
                </div>
              ) : (
                <p className="text-red-600 font-medium mt-4">Tidak ditemukan rule yang cocok.</p>
              )}
            </div>

            {/* Grafik HAZ */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">Grafik Tinggi per Usia (HAZ)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareHAZData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Tinggi (cm)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  {[-3,-2,-1,0,1,2,3].map(z => (
                    <Line
                      key={z}
                      dataKey={`sd${z}`}
                      stroke={z===0?'#2d6a4f':'#74c69d'}
                      strokeWidth={z===0?3:1}
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
                    label={result ? {
                      position: "top",
                      value: `Z: ${result.hazZ} (${result.hazCategory})`,
                      fill: "#1b4332",
                      fontSize: 12,
                    } : undefined}
                  />
                  {/* Garis vertikal pada usia anak */}
                  {result && (
                    <ReferenceLine
                      x={result.age}
                      stroke="#1b4332"
                      strokeDasharray="4 4"
                      label={
                        <Label
                          value={`Usia: ${result.age} bln`}
                          position="top"
                          fill="#1b4332"
                          fontSize={12}
                        />
                      }
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Grafik WHZ */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">Grafik Berat per Tinggi (WHZ)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prepareWHZData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="height" label={{ value: 'Tinggi (cm)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Berat (kg)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  {[-3,-2,-1,0,1,2,3].map(z => (
                    <Line
                      key={z}
                      dataKey={`sd${z}`}
                      stroke={z===0?'#1b4332':'#40916c'}
                      strokeWidth={z===0?3:1}
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
                    label={result ? {
                      position: "top",
                      value: `Z: ${result.whzZ} (${result.whzCategory})`,
                      fill: "#081c15",
                      fontSize: 12,
                    } : undefined}
                  />
                  {/* Garis vertikal pada tinggi anak */}
                  {result && (
                    <ReferenceLine
                      x={parseFloat(result.height)}
                      stroke="#081c15"
                      strokeDasharray="4 4"
                      label={
                        <Label
                          value={`Tinggi: ${result.height} cm`}
                          position="top"
                          fill="#081c15"
                          fontSize={12}
                        />
                      }
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Deskripsi sistem pakar - versi profesional & keren */}
        <div className="mt-16 bg-gradient-to-b from-white to-emerald-50 p-8 rounded-xl shadow-md border border-emerald-200">
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-6 text-center">
            🧠 Tentang Sistem Pakar <span className="text-emerald-600">NutriKids Expert</span>
          </h2>

          <p className="text-gray-700 text-base leading-relaxed mb-6 text-justify">
            <strong>NutriKids Expert</strong> adalah sebuah <strong>sistem pakar gizi anak berbasis web</strong> yang dirancang untuk membantu orang tua dan tenaga medis mendiagnosis status gizi balita secara cepat dan akurat. Sistem ini menggunakan pendekatan <strong>kecerdasan buatan (AI)</strong> melalui <strong>metode inferensi Forward Chaining</strong>, dan seluruh acuan diagnosa merujuk pada <strong>standar WHO (World Health Organization)</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm md:text-base text-gray-700">
            {/* Box 1 - Metode */}
            <div>
              <h4 className="text-emerald-700 font-semibold text-lg mb-2">📌 Metode Diagnosa: <span className="text-emerald-600">Forward Chaining</span></h4>
              <p className="leading-relaxed text-justify">
                Forward Chaining merupakan metode penalaran berbasis fakta → aturan → kesimpulan. Sistem akan menganalisis data awal (usia, berat, tinggi, dan jenis kelamin) dan menghitung <strong>Z-score HAZ & WHZ</strong>. Hasil ini kemudian digunakan untuk menelusuri basis pengetahuan dan menemukan <strong>diagnosa yang sesuai</strong> berdasarkan aturan pakar.
              </p>
            </div>

            {/* Box 2 - Input */}
            <div>
              <h4 className="text-emerald-700 font-semibold text-lg mb-2">📝 Data yang Diperlukan</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Nama lengkap orang tua dan anak</li>
                <li>Usia anak (dalam bulan, 0–60)</li>
                <li>Jenis kelamin anak</li>
                <li>Berat badan anak (kg)</li>
                <li>Tinggi badan anak (cm)</li>
              </ul>
            </div>

            {/* Box 3 - Output */}
            <div>
              <h4 className="text-emerald-700 font-semibold text-lg mb-2">📈 Hasil Diagnosa yang Ditampilkan</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Nilai Z-score HAZ (Height-for-Age)</li>
                <li>Nilai Z-score WHZ (Weight-for-Height)</li>
                <li>Kategori status gizi berdasarkan WHO</li>
                <li>Diagnosis akhir dan rekomendasi</li>
                <li>Penelusuran jejak aturan (rule tracing)</li>
              </ul>
            </div>

            {/* Box 4 - Klasifikasi */}
            <div>
              <h4 className="text-emerald-700 font-semibold text-lg mb-2">🔍 Klasifikasi Status Gizi</h4>
              <p className="mb-2">Berdasarkan standar WHO, kategori gizi anak dibedakan sebagai berikut:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Normal</strong></li>
                <li><strong>Stunting</strong> & <strong>Stunting Berat</strong></li>
                <li><strong>Gizi Kurang</strong> & <strong>Gizi Buruk</strong></li>
                <li><strong>Wasting</strong> & <strong>Wasting Berat</strong></li>
                <li><strong>Overweight</strong> & <strong>Obesitas</strong></li>
              </ul>
            </div>
          </div>

          {/* Penutup */}
          <div className="mt-8 text-sm text-gray-600 border-t pt-4">
            ⚠️ <strong>Disclaimer:</strong> NutriKids Experti bukan pengganti konsultasi langsung dengan dokter atau ahli gizi. Sistem ini hanya memberikan <strong>diagnosa awal berbasis data WHO</strong> dan <strong>aturan pakar</strong> sebagai alat bantu edukatif.
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosisForward;
