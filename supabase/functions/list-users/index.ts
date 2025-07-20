import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}

serve(async (req) => {
  // Tangani preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing access token' }), {
      status: 401,
      headers: corsHeaders
    })
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token)

  if (error || !user || !user.email) {
    return new Response(JSON.stringify({ error: 'Invalid user token or email missing' }), {
      status: 401,
      headers: corsHeaders
    })
  }

  // Validasi hanya admin tertentu
  const allowedAdminEmails = ['admin@gmail.com'] // Ganti dengan email kamu
  if (!allowedAdminEmails.includes(user.email)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 403,
      headers: corsHeaders
    })
  }

  const { data, error: listError } = await supabase.auth.admin.listUsers()

  if (listError) {
    return new Response(JSON.stringify({ error: listError.message }), {
      status: 500,
      headers: corsHeaders
    })
  }

  return new Response(JSON.stringify({ users: data.users }), {
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
})
