import { useState } from 'react';
import type { Athlete } from './types';

// Dados fictícios para teste (Mock Data)
const MOCK_ATHLETES: Athlete[] = [
  { id: '1', name: 'João Silva', position: 'Quarterback', number: 12, status: 'ACTIVE', height: '1.85m', weight: '90kg' },
  { id: '2', name: 'Marcos Oliveira', position: 'Linebacker', number: 54, status: 'INJURED', height: '1.92m', weight: '105kg' },
  { id: '3', name: 'Pedro Santos', position: 'Wide Receiver', number: 88, status: 'ACTIVE', height: '1.80m', weight: '82kg' },
];

export const useAthletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>(MOCK_ATHLETES);
  const [loading, setLoading] = useState(false);

  const addAthlete = (athlete: Omit<Athlete, 'id'>) => {
    const newAthlete = { ...athlete, id: Math.random().toString() };
    setAthletes([...athletes, newAthlete]);
  };

  return {
    athletes,
    loading,
    addAthlete
  };
};