import { supabase } from '../utils/supabaseClient';

/**
 * Simpan satu record diagnosa ke tabel diagnoses.
 */
export async function saveDiagnosis(record) {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert([record]);
  if (error) throw error;
  return data[0];
}

/**
 * Ambil daftar diagnosa berdasarkan user dan rentang tanggal.
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} [params.fromDate]  // format 'YYYY-MM-DD'
 * @param {string} [params.toDate]    // format 'YYYY-MM-DD'
 */
export async function fetchDiagnoses({ userId, fromDate, toDate }) {
  let query = supabase
    .from('diagnoses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (fromDate) query = query.gte('created_at', fromDate);
  if (toDate)   query = query.lte('created_at', toDate);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
