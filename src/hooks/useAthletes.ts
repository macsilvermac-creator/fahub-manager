import { useState, useCallback } from 'react';

// Assumindo que a interface Athlete já está definida em seus types
import { Athlete } from '../types'; 

export const useAthletes = () => {
  // Simulação de estado inicial (pode vir vazio ou com mocks)
  const [athletes, setAthletes] = useState<Athlete[]>([]);

  const addAthlete = useCallback((athlete: Athlete) => {
    setAthletes((prev) => [...prev, athlete]);
  }, []);

  /**
   * ATUALIZAÇÃO (AI-Ready):
   * Aceita Partial<Athlete>, permitindo que agentes externos atualizem
   * campos isolados (ex: status, medicalReport) sem tocar no resto.
   */
  const updateAthlete = useCallback((id: string, updatedFields: Partial<Athlete>) => {
    setAthletes((prev) => 
      prev.map((athlete) => 
        athlete.id === id ? { ...athlete, ...updatedFields } : athlete
      )
    );
  }, []);

  const deleteAthlete = useCallback((id: string) => {
    setAthletes((prev) => prev.filter((athlete) => athlete.id !== id));
  }, []);

  return {
    athletes,
    addAthlete,
    updateAthlete,
    deleteAthlete,
  };
};