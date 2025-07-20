// ✅ File: src/hooks/useUsers.js atau hook.js
import { supabase } from '../utils/supabaseClient';

export const fetchUsers = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error("Token tidak tersedia. Pengguna belum login?");
  }

  const res = await fetch("https://kcgnduwofdbfmscyoccw.functions.supabase.co/list-users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data pengguna");
  }

  const result = await res.json();
  return result.users;
};
