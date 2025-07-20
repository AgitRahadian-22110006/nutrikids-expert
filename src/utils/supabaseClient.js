// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Ambil dari environment variable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validasi agar tidak error jika .env belum diset
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL dan/atau Anon Key tidak ditemukan di environment variables");
}

// Export supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
