// src/utils/pdfUtils.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Wajib untuk enable doc.autoTable()

export const handleDownloadPDF = (record) => {
  const doc = new jsPDF();

  // Judul
  doc.setFontSize(16);
  doc.text('Laporan Diagnosa Gizi Anak', 14, 20);

  // Data Diagnosa dalam bentuk array
  const data = [
    ['Tanggal', new Date(record.created_at).toLocaleDateString('id-ID')],
    ['Nama Anak', record.child_name],
    ['Usia (bulan)', record.age_months],
    ['Jenis Kelamin', record.gender === 'L' ? 'Laki-laki' : 'Perempuan'],
    ['Tinggi Badan (cm)', record.height_cm],
    ['Berat Badan (kg)', record.weight_kg],
    ['Kategori HAZ', record.haz_category],
    ['Kategori WHZ', record.whz_category],
    ['Diagnosis', record.diagnosis],
    ['Rekomendasi', record.recommendation],
  ];

  // Tabel
  autoTable(doc, {
    startY: 30,
    head: [['Data', 'Nilai']],
    body: data,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [67, 160, 71] }, // Hijau
  });

  // Simpan file PDF
  doc.save(`Diagnosa-${record.child_name}.pdf`);
};
