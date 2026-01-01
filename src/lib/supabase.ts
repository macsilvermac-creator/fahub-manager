import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log para debug (vai aparecer no console do navegador antes do erro)
console.log("Tentando conectar Supabase...");
console.log("URL existe?", !!supabaseUrl); // Vai imprimir true ou false
console.log("Key existe?", !!supabaseKey); // Vai imprimir true ou false

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase (.env)');
}

export const supabase = createClient(supabaseUrl, supabaseKey);