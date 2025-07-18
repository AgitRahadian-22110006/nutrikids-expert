// src/utils/calculateZScore.js
// ====================================
// Menghitung Z-Score berdasarkan parameter LMS (WHO standard)
// ====================================
// Formula WHO LMS:
// Jika L ≠ 0:
//   Z = [(X / M)^L − 1] / (L × S)
// Jika L = 0:
//   Z = ln(X / M) / S

/**
 * Menghitung Z‑Score berdasarkan metode LMS WHO
 * @param {number} measured - nilai ukur (berat, tinggi)
 * @param {{L:number, M:number, S:number}} ref - parameter referensi LMS
 * @returns {number} Z‑Score (dibulatkan 2 desimal)
 */
export function calculateZScore(measured, ref) {
  const { L, M, S } = ref;
  if (!L || L === 0) {
    return parseFloat((Math.log(measured / M) / S).toFixed(2));
  }
  const z = ((Math.pow(measured / M, L) - 1) / (L * S));
  return parseFloat(z.toFixed(2));
}

/**
 * Mengkategorikan Z‑Score HAZ ke label status gizi tinggi/umur
 * @param {number} z
 * @returns {string}
 */
export function categorizeHAZ(z) {
  if (z < -3) return 'Stunting Berat';
  if (z >= -3 && z < -2) return 'Stunting Sedang';
  if (z >= -2 && z < -1) return 'Risiko Stunting';
  if (z >= -1 && z <= 2) return 'Normal';
  return 'Tinggi Lebih';
}

/**
 * Mengkategorikan Z‑Score WHZ ke label status berat/tinggi
 * @param {number} z
 * @returns {string}
 */
export function categorizeWHZ(z) {
  if (z < -3) return 'Gizi Buruk Akut (Kurus Berat)';
  if (z >= -3 && z < -2) return 'Gizi Buruk (Kurus Sedang)';
  if (z >= -2 && z < -1) return 'Risiko Kurus';
  if (z >= -1 && z <= 1) return 'Normal';
  if (z > 1 && z <= 2) return 'Risiko Berat Badan Lebih';
  if (z > 2 && z <= 3) return 'Berat Badan Lebih';
  return 'Obesitas';
}
