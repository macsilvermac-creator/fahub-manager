export interface Athlete {
  id: string;
  full_name: string;
  birth_date: string;
  position: string;
  status: 'active' | 'inactive';
  created_at?: string;
  entity_id?: string; // Vinculação com a tabela entities que vimos no seu Supabase
}