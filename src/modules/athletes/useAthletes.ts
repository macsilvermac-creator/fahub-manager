import { useState, useEffect } from 'react';
import { Athlete } from '../../types/athlete';

export function useAthletes() {
  // Mock inicial de dados
  const [athletes, setAthletes] = useState<Athlete[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@fahub.com',
      phone: '(11) 99999-9999',
      category: 'Sub-20',
      status: 'Active',
      position: 'Atacante'
    },
    {
      id: '2',
      name: 'Maria Souza',
      email: 'maria@fahub.com',
      phone: '(11) 98888-8888',
      category: 'Profissional',
      status: 'Injured',
      position: 'Goleira'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const deleteAthlete = async (id: string) => {
    setIsLoading(true);
    // Simulação de API
    setTimeout(() => {
      setAthletes((prev) => prev.filter((a) => a.id !== id));
      setIsLoading(false);
    }, 500);
  };

  const createAthlete = async (data: Omit<Athlete, 'id'>) => {
    const newAthlete = { ...data, id: Math.random().toString(36).substr(2, 9) };
    setAthletes((prev) => [...prev, newAthlete]);
  };

  const updateAthlete = async (id: string, data: Partial<Athlete>) => {
    setAthletes((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
  };

  return {
    athletes,
    isLoading,
    deleteAthlete,
    createAthlete,
    updateAthlete
  };
}