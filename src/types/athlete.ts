export type AthleteStatus = 'Active' | 'Inactive' | 'Injured' | 'Suspended';

export interface Athlete {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string; // Adicionado para corrigir o erro TS2339
  status: AthleteStatus;
  position?: string;
  imageUrl?: string;
  birthDate?: string;
}