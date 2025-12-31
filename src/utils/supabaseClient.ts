import { createClient } from '@supabase/supabase-js'

// Recupera as variáveis de ambiente do .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Cria e exporta o cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)