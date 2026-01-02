export type AthleteStatus = 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'INACTIVE';

export interface Athlete {
  id: string;
  name: string;
  position: string;
  number: number;
  status: AthleteStatus;
  
  // Campos Opcionais (podem estar vazios)
  height?: string;
  weight?: string;
  category?: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  created_at?: string;
}