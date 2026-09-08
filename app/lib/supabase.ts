import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For Customer Website (Public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For Admin (Server - Secure)
export const getSupabaseAdmin = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) throw new Error("Missing Service Role Key")
  return createClient(supabaseUrl, serviceKey)
}
