import { createClient } from '@supabase/supabase-js'

// O código agora lê as chaves de um local seguro, e não diretamente do código
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)