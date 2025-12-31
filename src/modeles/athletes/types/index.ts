// src/modules/athletes/types/index.ts

export interface Athlete {
  id: string;
  name: string;
  position: string;
  jerseyNumber: number;
  status: 'active' | 'inactive' | 'injured' | 'suspended';
  lastActivity: string; // Ex: '2025-12-25'
}