import { createClient } from '@supabase/supabase-js';

// Importa as chaves do arquivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as chaves existem para não dar erro silencioso
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Faltam as variáveis de ambiente do Supabase (.env)');
}

// Cria e exporta a conexão
export const supabase = createClient(supabaseUrl, supabaseKey);