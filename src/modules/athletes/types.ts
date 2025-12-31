export type AthleteStatus = 'Active' | 'Injured' | 'Suspended' | 'Inactive';

export interface Athlete {
  id: string;
  name: string;
  position: string;
  status: AthleteStatus;
  height: number; // em cm
  weight: number; // em kg
  avatarUrl?: string; // Opcional, para uso futuro
}