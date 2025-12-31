import { useState } from 'react';
import type { Athlete } from './types';

const MOCK_ATHLETES: Athlete[] = [
  { id: '1', name: 'João Silva', position: 'QB', number: 12, status: 'ACTIVE', height: '1.85m', weight: '90kg' },
  { id: '2', name: 'Marcos Oliveira', position: 'LB', number: 54, status: 'INJURED', height: '1.92m', weight: '105kg' },
];

export const useAthletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>(MOCK_ATHLETES);

  // Criar
  const addAthlete = (data: Omit<Athlete, 'id'>) => {
    const newAthlete = { ...data, id: Math.random().toString() };
    setAthletes([...athletes, newAthlete]);
  };

  // Editar
  const updateAthlete = (id: string, data: Partial<Athlete>) => {
    setAthletes((prev) => 
      prev.map((athlete) => (athlete.id === id ? { ...athlete, ...data } : athlete))
    );
  };

  // Excluir
  const deleteAthlete = (id: string) => {
    setAthletes((prev) => prev.filter((athlete) => athlete.id !== id));
  };

  return {
    athletes,
    addAthlete,
    updateAthlete,
    deleteAthlete
  };
};