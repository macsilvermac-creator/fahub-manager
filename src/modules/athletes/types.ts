export interface Athlete {
  id: string;
  full_name: string;
  birth_date: string;
  position: string;
  status: 'active' | 'inactive';
  created_at?: string;
}