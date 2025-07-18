// src/data/rules.js
// ====================================
// Rule Base untuk Forward Chaining NutriKids‑Expert
// Menangani 28 kombinasi HAZ & WHZ → diagnosis + rekomendasi
// Istilah ramah pengguna dan berbasis standar WHO

export const rules = [
  // === 1–7: HAZ: Stunting Berat ===
  {
    id: 1,
    conditions: { HAZ: 'Stunting Berat', WHZ: 'Gizi Buruk Akut (Kurus Berat)' },
    diagnosis: 'Stunting Berat dengan Gizi Buruk Akut',
    recommendation: [
      'Segera bawa anak ke fasilitas kesehatan (RS/puskesmas) untuk penanganan darurat dan rawat inap.',
      'Ikuti terapi makanan terapeutik siap saji (RUTF) sesuai anjuran dokter.',
      'Pantau tanda-tanda dehidrasi, infeksi, dan komplikasi lain setiap hari.',
      'Lakukan pemantauan berat dan tinggi badan minimal 2 kali seminggu.',
      'Pastikan anak mendapat imunisasi dasar lengkap dan suplementasi vitamin A.',
      'Libatkan keluarga dalam edukasi pola makan dan kebersihan lingkungan.',
      'Konsultasi rutin ke dokter spesialis anak/gizi klinik untuk evaluasi lanjutan.',
      'Jaga kebersihan tangan dan alat makan untuk mencegah infeksi berulang.',
      'Pastikan anak tetap mendapat stimulasi psikososial dan kasih sayang.'
    ]
  },
  {
    id: 2,
    conditions: { HAZ: 'Stunting Berat', WHZ: 'Gizi Buruk (Kurus Sedang)' },
    diagnosis: 'Stunting Berat dengan Gizi Buruk',
    recommendation: [
      'Segera konsultasi ke dokter atau ahli gizi untuk penanganan gizi buruk dan stunting secara bersamaan.',
      'Berikan makanan tinggi kalori dan protein (misal: telur, daging, ikan, susu, kacang-kacangan).',
      'Tingkatkan frekuensi makan menjadi 5–6 kali sehari (3 utama, 2–3 camilan sehat).',
      'Pantau berat dan tinggi badan anak setiap minggu.',
      'Berikan suplementasi zat besi, zinc, dan vitamin A sesuai anjuran medis.',
      'Perhatikan tanda-tanda infeksi (batuk, diare, demam) dan segera bawa ke fasilitas kesehatan jika muncul.',
      'Libatkan keluarga dalam edukasi pola asuh makan dan kebersihan lingkungan.',
      'Pastikan anak tetap aktif dan mendapat stimulasi perkembangan motorik serta sosial.'
    ]
  },
  {
    id: 3,
    conditions: { HAZ: 'Stunting Berat', WHZ: 'Risiko Kurus' },
    diagnosis: 'Stunting Berat dengan Risiko Kurus',
    recommendation: [
      'Tingkatkan asupan protein hewani (telur, ayam, ikan) dan lemak sehat (minyak kelapa, zaitun).',
      'Berikan makanan padat energi dan gizi seimbang setiap kali makan.',
      'Cek berat dan tinggi badan anak minimal setiap minggu.',
      'Berikan camilan sehat 2–3 kali sehari (misal: pisang, ubi, tahu, tempe).',
      'Pantau nafsu makan dan aktivitas fisik anak.',
      'Konsultasi ke ahli gizi untuk rencana makan individual.',
      'Pastikan anak mendapat imunisasi dan suplementasi vitamin A.',
      'Libatkan keluarga dalam stimulasi perkembangan anak di rumah.'
    ]
  },
  {
    id: 4,
    conditions: { HAZ: 'Stunting Berat', WHZ: 'Normal' },
    diagnosis: 'Stunting Berat',
    recommendation: [
      'Berikan makanan beragam, tinggi energi, dan kaya protein setiap hari.',
      'Pastikan konsumsi protein hewani minimal 2 kali sehari.',
      'Stimulasi perkembangan motorik dan interaksi sosial anak secara rutin.',
      'Pantau tinggi dan berat badan anak setiap bulan.',
      'Konsultasi tumbuh kembang ke puskesmas/dokter anak secara berkala.',
      'Berikan suplementasi zat besi dan vitamin A sesuai jadwal.',
      'Libatkan keluarga dalam pola asuh makan dan kebersihan lingkungan.',
      'Pastikan anak cukup tidur dan aktif bermain.'
    ]
  },
  {
    id: 5,
    conditions: { HAZ: 'Stunting Berat', WHZ: 'Risiko Berat Badan Lebih' },
    diagnosis: 'Stunting Berat dengan Risiko Berat Badan Lebih',
    recommendation: [
      'Perhatikan keseimbangan nutrisi anak, hindari pemberian makanan tinggi gula dan lemak jenuh.',
      'Berikan makanan tinggi protein dan serat (sayur, buah) untuk mendukung pertumbuhan.',
      'Pantau perkembangan tinggi badan dan lemak tubuh secara berkala.',
      'Konsultasi ke ahli gizi untuk pengaturan pola makan yang seimbang.',
      'Batasi konsumsi makanan olahan dan minuman manis.',
      'Dorong aktivitas fisik harian yang sesuai usia.',
      'Libatkan keluarga dalam edukasi pola makan sehat dan aktif.'
    ]
  },
  {
    id: 6,
    conditions: { HAZ: 'Stunting Berat', WHZ: 'Berat Badan Lebih' },
    diagnosis: 'Stunting Berat dengan Berat Badan Lebih',
    recommendation: [
      'Terapkan pola makan sehat dan seimbang, bukan hanya tinggi kalori.',
      'Hindari camilan tinggi gula, makanan cepat saji, dan minuman kemasan.',
      'Berikan makanan kaya protein dan serat untuk mendukung pertumbuhan.',
      'Pantau berat dan tinggi badan anak setiap bulan.',
      'Konsultasi tumbuh kembang lanjutan ke dokter/ahli gizi.',
      'Dorong aktivitas fisik rutin dan batasi waktu layar (screen time).',
      'Libatkan keluarga dalam perubahan pola makan dan gaya hidup sehat.'
    ]
  },
  {
    id: 7,
    conditions: { HAZ: 'Stunting Berat', WHZ: 'Obesitas' },
    diagnosis: 'Stunting Berat dengan Obesitas',
    recommendation: [
      'Kombinasikan terapi gizi stunting dengan pengendalian berat badan secara ketat.',
      'Lakukan evaluasi metabolik (gula darah, lipid) dan pola makan menyeluruh.',
      'Buat rencana makan sehat bersama ahli gizi, fokus pada protein, serat, dan batasi gula/lemak.',
      'Libatkan keluarga dalam perubahan pola asuh dan makan.',
      'Pantau berat dan tinggi badan setiap bulan.',
      'Tingkatkan aktivitas fisik harian, kurangi screen time.',
      'Konsultasi rutin ke dokter anak/gizi klinik untuk evaluasi lanjutan.'
    ]
  },

  // === 8–14: HAZ: Stunting Sedang ===
  {
    id: 8,
    conditions: { HAZ: 'Stunting Sedang', WHZ: 'Gizi Buruk Akut (Kurus Berat)' },
    diagnosis: 'Stunting Sedang + Gizi Buruk Akut',
    recommendation: [
      'Segera bawa anak ke fasilitas kesehatan untuk penanganan gizi buruk akut.',
      'Mulai dengan makanan padat energi sesuai anjuran tenaga medis.',
      'Pantau tanda-tanda infeksi dan dehidrasi setiap hari.',
      'Pemantauan ketat oleh tenaga gizi dan dokter.',
      'Berikan suplementasi vitamin dan mineral sesuai rekomendasi.',
      'Libatkan keluarga dalam edukasi pola makan dan kebersihan.',
      'Pastikan anak mendapat stimulasi psikososial.'
    ]
  },
  {
    id: 9,
    conditions: { HAZ: 'Stunting Sedang', WHZ: 'Gizi Buruk (Kurus Sedang)' },
    diagnosis: 'Stunting Sedang dengan Gizi Buruk',
    recommendation: [
      'Tingkatkan asupan energi harian minimal 120–150 kkal/kg berat badan.',
      'Berikan makanan padat gizi tinggi protein dan lemak sehat.',
      'Konsultasi gizi setiap 2 minggu untuk evaluasi kemajuan.',
      'Pantau berat dan tinggi badan anak secara rutin.',
      'Berikan camilan sehat 2–3 kali sehari.',
      'Pastikan anak mendapat imunisasi dan suplementasi vitamin A.',
      'Libatkan keluarga dalam edukasi pola makan dan kebersihan.'
    ]
  },
  {
    id: 10,
    conditions: { HAZ: 'Stunting Sedang', WHZ: 'Risiko Kurus' },
    diagnosis: 'Stunting Sedang dan Risiko Kurus',
    recommendation: [
      'Pantau secara rutin asupan makan dan berat badan anak.',
      'Berikan makanan protein tinggi seperti telur, daging, susu setiap hari.',
      'Cek tumbuh kembang bulanan di posyandu/puskesmas.',
      'Berikan camilan sehat dan padat energi.',
      'Konsultasi ke ahli gizi untuk rencana makan individual.',
      'Pastikan anak cukup tidur dan aktif bermain.'
    ]
  },
  {
    id: 11,
    conditions: { HAZ: 'Stunting Sedang', WHZ: 'Normal' },
    diagnosis: 'Stunting Sedang',
    recommendation: [
      'Kombinasikan makanan pokok dengan lauk hewani dan sayur setiap hari.',
      'Berikan makanan tinggi protein 3 kali sehari.',
      'Cek tinggi badan dan berat badan setiap bulan.',
      'Stimulasi perkembangan motorik dan sosial anak.',
      'Konsultasi tumbuh kembang ke puskesmas/dokter anak secara berkala.',
      'Pastikan anak mendapat suplementasi vitamin A dan zat besi.'
    ]
  },
  {
    id: 12,
    conditions: { HAZ: 'Stunting Sedang', WHZ: 'Risiko Berat Badan Lebih' },
    diagnosis: 'Stunting Sedang dengan Risiko Berat Badan Lebih',
    recommendation: [
      'Perhatikan kualitas gizi, hindari makanan tinggi gula dan lemak jenuh.',
      'Pantau indeks massa tubuh dan aktivitas harian anak.',
      'Konsultasi gizi untuk pemantauan khusus dan rencana makan seimbang.',
      'Berikan makanan kaya protein dan serat.',
      'Batasi konsumsi makanan olahan dan minuman manis.',
      'Dorong aktivitas fisik harian yang sesuai usia.'
    ]
  },
  {
    id: 13,
    conditions: { HAZ: 'Stunting Sedang', WHZ: 'Berat Badan Lebih' },
    diagnosis: 'Stunting Sedang dan Berat Badan Lebih',
    recommendation: [
      'Jaga keseimbangan gizi agar tidak memicu obesitas.',
      'Berikan makanan berkualitas, bukan hanya banyak.',
      'Pantau aktivitas fisik harian anak dan batasi screen time.',
      'Konsultasi ke ahli gizi untuk pola makan sehat.',
      'Libatkan keluarga dalam perubahan pola makan dan gaya hidup.'
    ]
  },
  {
    id: 14,
    conditions: { HAZ: 'Stunting Sedang', WHZ: 'Obesitas' },
    diagnosis: 'Stunting Sedang dan Obesitas',
    recommendation: [
      'Fokus pada intervensi gizi seimbang dan edukasi keluarga.',
      'Kendalikan porsi makan dan aktivitas duduk anak.',
      'Konsultasi rutin ke ahli gizi untuk evaluasi dan rencana makan.',
      'Tingkatkan aktivitas fisik harian dan kurangi konsumsi gula/lemak.',
      'Pantau berat dan tinggi badan setiap bulan.'
    ]
  },

  // === 15–21: HAZ: Risiko Stunting ===
  {
    id: 15,
    conditions: { HAZ: 'Risiko Stunting', WHZ: 'Gizi Buruk Akut (Kurus Berat)' },
    diagnosis: 'Risiko Stunting + Gizi Buruk Akut',
    recommendation: [
      'Pantau gizi ketat dan segera konsultasi medis di fasilitas kesehatan.',
      'Pemberian makanan tinggi energi dan mikronutrien penting (protein, vitamin, mineral).',
      'Monitoring harian di puskesmas jika perlu.',
      'Berikan suplementasi vitamin A dan zat besi.',
      'Pantau berat dan tinggi badan setiap minggu.',
      'Libatkan keluarga dalam edukasi pola makan dan kebersihan.'
    ]
  },
  {
    id: 16,
    conditions: { HAZ: 'Risiko Stunting', WHZ: 'Gizi Buruk (Kurus Sedang)' },
    diagnosis: 'Risiko Stunting + Gizi Buruk',
    recommendation: [
      'Cegah perkembangan ke arah stunting dengan gizi optimal.',
      'Kombinasikan protein hewani dan nabati setiap makan.',
      'Pantau berat badan mingguan dan tinggi badan bulanan.',
      'Berikan camilan sehat 2–3 kali sehari.',
      'Konsultasi ke ahli gizi untuk rencana makan individual.',
      'Pastikan anak mendapat imunisasi dan suplementasi vitamin.'
    ]
  },
  {
    id: 17,
    conditions: { HAZ: 'Risiko Stunting', WHZ: 'Risiko Kurus' },
    diagnosis: 'Risiko Stunting dan Risiko Kurus',
    recommendation: [
      'Berikan camilan padat gizi dan makanan utama lebih sering.',
      'Kegiatan fisik aktif harus tetap didorong.',
      'Pantau berat dan tinggi setiap 2 minggu.',
      'Konsultasi ke posyandu/puskesmas untuk pemantauan tumbuh kembang.',
      'Pastikan anak mendapat protein hewani setiap hari.'
    ]
  },
  {
    id: 18,
    conditions: { HAZ: 'Risiko Stunting', WHZ: 'Normal' },
    diagnosis: 'Risiko Stunting',
    recommendation: [
      'Pastikan anak mendapatkan asupan protein hewani harian.',
      'Berikan camilan sehat 2x/hari seperti telur atau tahu.',
      'Pantau tumbuh kembang setiap bulan.',
      'Konsultasi tumbuh kembang ke puskesmas/dokter anak.',
      'Stimulasi perkembangan motorik dan sosial anak.'
    ]
  },
  {
    id: 19,
    conditions: { HAZ: 'Risiko Stunting', WHZ: 'Risiko Berat Badan Lebih' },
    diagnosis: 'Risiko Stunting dan Risiko BB Lebih',
    recommendation: [
      'Kendalikan porsi makanan dan perhatikan kualitasnya.',
      'Ajarkan anak pola makan dan kebiasaan sehat sejak dini.',
      'Konsultasi gizi berkala sangat dianjurkan.',
      'Batasi makanan olahan dan minuman manis.',
      'Pantau berat dan tinggi badan setiap bulan.'
    ]
  },
  {
    id: 20,
    conditions: { HAZ: 'Risiko Stunting', WHZ: 'Berat Badan Lebih' },
    diagnosis: 'Risiko Stunting dan Berat Badan Lebih',
    recommendation: [
      'Jangan abaikan tingginya berat badan meskipun tinggi belum sesuai.',
      'Kombinasikan makanan sehat dengan kontrol kalori.',
      'Konsultasi dengan tenaga gizi untuk program seimbang.',
      'Pantau berat dan tinggi badan setiap bulan.',
      'Tingkatkan aktivitas fisik harian dan batasi screen time.'
    ]
  },
  {
    id: 21,
    conditions: { HAZ: 'Risiko Stunting', WHZ: 'Obesitas' },
    diagnosis: 'Risiko Stunting dan Obesitas',
    recommendation: [
      'Pantau gizi dan aktivitas secara seimbang.',
      'Kurangi makanan manis dan minuman kemasan.',
      'Ajak anak aktif bergerak dan bermain fisik setiap hari.',
      'Konsultasi ke ahli gizi untuk evaluasi dan rencana makan.',
      'Libatkan keluarga dalam perubahan pola makan dan gaya hidup.'
    ]
  },

  // === 22–28: HAZ: Normal ===
  {
    id: 22,
    conditions: { HAZ: 'Normal', WHZ: 'Gizi Buruk Akut (Kurus Berat)' },
    diagnosis: 'Gizi Buruk Akut (Kurus Berat)',
    recommendation: [
      'Segera konsultasi dokter untuk terapi gizi lanjutan dan pemantauan ketat.',
      'Berikan makanan tinggi kalori dan lemak sehat (minyak, santan, alpukat).',
      'Perhatikan tanda dehidrasi dan penyakit infeksi, segera bawa ke fasilitas kesehatan jika muncul.',
      'Pantau berat badan dan tinggi badan setiap minggu.',
      'Berikan suplementasi vitamin dan mineral sesuai anjuran medis.',
      'Libatkan keluarga dalam edukasi pola makan dan kebersihan.'
    ]
  },
  {
    id: 23,
    conditions: { HAZ: 'Normal', WHZ: 'Gizi Buruk (Kurus Sedang)' },
    diagnosis: 'Underweight (Berat Badan Rendah)',
    recommendation: [
      'Tambah frekuensi makan hingga 5–6 kali sehari (3 utama, 2–3 camilan sehat).',
      'Gunakan minyak sehat pada makanan (kelapa, zaitun, canola).',
      'Cek berat badan mingguan dan tinggi badan bulanan.',
      'Berikan makanan tinggi protein dan energi.',
      'Konsultasi ke ahli gizi untuk rencana makan individual.',
      'Pastikan anak mendapat imunisasi dan suplementasi vitamin.'
    ]
  },
  {
    id: 24,
    conditions: { HAZ: 'Normal', WHZ: 'Risiko Kurus' },
    diagnosis: 'Risiko Underweight',
    recommendation: [
      'Berikan makanan tinggi energi seperti kentang, telur, susu, daging.',
      'Camilan sehat 2 kali sehari sangat disarankan.',
      'Pantau berat badan anak 2 minggu sekali.',
      'Konsultasi ke posyandu/puskesmas untuk pemantauan tumbuh kembang.',
      'Pastikan anak mendapat protein hewani setiap hari.'
    ]
  },
  {
    id: 25,
    conditions: { HAZ: 'Normal', WHZ: 'Normal' },
    diagnosis: 'Status Gizi Normal',
    recommendation: [
      'Pertahankan pola makan seimbang: karbohidrat, protein, lemak, sayur, dan buah.',
      'Ajarkan anak kebiasaan makan sehat dan aktif bermain setiap hari.',
      'Lakukan pemeriksaan tumbuh kembang berkala tiap 3 bulan.',
      'Pastikan anak mendapat imunisasi dan suplementasi vitamin sesuai jadwal.',
      'Libatkan keluarga dalam pola hidup sehat.'
    ]
  },
  {
    id: 26,
    conditions: { HAZ: 'Normal', WHZ: 'Risiko Berat Badan Lebih' },
    diagnosis: 'Risiko Berat Badan Lebih',
    recommendation: [
      'Kurangi makanan manis/berlemak, hindari minuman kemasan dan makanan cepat saji.',
      'Dorong aktivitas fisik rutin seperti bermain di luar rumah.',
      'Cek berat badan setiap bulan dan tinggi badan setiap 3 bulan.',
      'Konsultasi ke ahli gizi untuk pemantauan dan edukasi pola makan.',
      'Batasi screen time dan ajak anak aktif bergerak.'
    ]
  },
  {
    id: 27,
    conditions: { HAZ: 'Normal', WHZ: 'Berat Badan Lebih' },
    diagnosis: 'Berat Badan Lebih',
    recommendation: [
      'Batasi konsumsi kalori tinggi & makanan cepat saji.',
      'Konsultasi ke ahli gizi untuk pola makan sehat dan seimbang.',
      'Ajak anak aktif bergerak dan berolahraga setiap hari.',
      'Pantau berat dan tinggi badan secara berkala.',
      'Libatkan keluarga dalam perubahan pola makan dan gaya hidup sehat.'
    ]
  },
  {
    id: 28,
    conditions: { HAZ: 'Normal', WHZ: 'Obesitas' },
    diagnosis: 'Obesitas',
    recommendation: [
      'Buat rencana makan sehat bersama ahli gizi, fokus pada protein, serat, dan batasi gula/lemak.',
      'Kurangi screen time dan tingkatkan aktivitas fisik harian.',
      'Libatkan keluarga dalam perubahan gaya hidup sehat.',
      'Pantau berat dan tinggi badan setiap bulan.',
      'Konsultasi rutin ke dokter anak/gizi klinik untuk evaluasi lanjutan.'
    ]
  }
];

export default rules;
