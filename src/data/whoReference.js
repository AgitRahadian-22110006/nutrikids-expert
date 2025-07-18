// src/data/whoReference.js
// ====================================
// Loader untuk WHO Growth Standards (LMS parameters)
// Menggunakan keenam file JSON di folder src/data:
// - hfa_boys.json, hfa_girls.json
// - wfa_boys.json, wfa_girls.json
// - wfh_boys.json, wfh_girls.json

import hfaBoys from './hfa_boys.json';
import hfaGirls from './hfa_girls.json';
import wfaBoys from './wfa_boys.json';
import wfaGirls from './wfa_girls.json';
import wfhBoys from './wfh_boys.json';
import wfhGirls from './wfh_girls.json';

// Transform array JSON ke lookup maps
const hazLookup = {
  male: Object.fromEntries(hfaBoys.map(e => [e.umur, { L: e.L, M: e.M, S: e.S }])),
  female: Object.fromEntries(hfaGirls.map(e => [e.umur, { L: e.L, M: e.M, S: e.S }]))
};

const wfaLookup = {
  male: Object.fromEntries(wfaBoys.map(e => [e.umur, { L: e.L, M: e.M, S: e.S }])),
  female: Object.fromEntries(wfaGirls.map(e => [e.umur, { L: e.L, M: e.M, S: e.S }]))
};

const whzLookup = {
  male: Object.fromEntries(wfhBoys.map(e => [e.Height, { L: e.L, M: e.M, S: e.S }])),
  female: Object.fromEntries(wfhGirls.map(e => [e.Height, { L: e.L, M: e.M, S: e.S }]))
};

/**
 * Mendapatkan parameter LMS untuk HAZ (Height-for-Age)
 * @param {number} ageMonths - usia anak dalam bulan (0–60)
 * @param {'male'|'female'} gender
 * @returns {{L:number, M:number, S:number}}
 */
export function getHAZReference(ageMonths, gender) {
  const ref = hazLookup[gender]?.[ageMonths];
  if (!ref) throw new Error(`HAZ reference tidak ditemukan untuk umur ${ageMonths} bulan dan gender ${gender}`);
  return ref;
}

/**
 * Mendapatkan parameter LMS untuk WFA (Weight-for-Age)
 * @param {number} ageMonths - usia anak dalam bulan (0–60)
 * @param {'male'|'female'} gender
 * @returns {{L:number, M:number, S:number}}
 */
export function getWFAReference(ageMonths, gender) {
  const ref = wfaLookup[gender]?.[ageMonths];
  if (!ref) throw new Error(`WFA reference tidak ditemukan untuk umur ${ageMonths} bulan dan gender ${gender}`);
  return ref;
}

/**
 * Mendapatkan parameter LMS untuk WHZ (Weight-for-Height)
 * @param {number} heightCm - tinggi badan dalam cm (45.0–110.0, step 0.5)
 * @param {'male'|'female'} gender
 * @returns {{L:number, M:number, S:number}}
 */
export function getWHZReference(heightCm, gender) {
  const key = parseFloat(heightCm.toFixed(1));
  const ref = whzLookup[gender]?.[key];
  if (!ref) throw new Error(`WHZ reference tidak ditemukan untuk tinggi ${key} cm dan gender ${gender}`);
  return ref;
}

// Eksport lookup maps jika diperlukan langsung
export const whoReference = { hazLookup, wfaLookup, whzLookup };

export default null;
