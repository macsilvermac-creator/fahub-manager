export type AthleteStatus = 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'INACTIVE';

export interface Athlete {
  id: string;
  name: string;
  position: string;
  number: number;
  status: AthleteStatus;
  height?: string;
  weight?: string;
}