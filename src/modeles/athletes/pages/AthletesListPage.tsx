// src/modules/athletes/pages/AthletesListPage.tsx
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { Athlete } from '../types';
import { AthleteTable } from '../components/AthleteTable';

// Dados fictícios para simular a busca de atletas
const mockAthletes: Athlete[] = [
  { id: '1', name: 'João Silva', position: 'QB', jerseyNumber: 12, status: 'active', lastActivity: '2025-12-25' },
  { id: '2', name: 'Pedro Souza', position: 'RB', jerseyNumber: 28, status: 'injured', lastActivity: '2025-12-20' },
  { id: '3', name: 'Lucas Santos', position: 'WR', jerseyNumber: 88, status: 'active', lastActivity: '2025-12-26' },
  { id: '4', name: 'Gabriel Costa', position: 'DB', jerseyNumber: 21, status: 'suspended', lastActivity: '2025-12-15' },
  { id: '5', name: 'Rafael Pereira', position: 'OL', jerseyNumber: 77, status: 'active', lastActivity: '2025-12-24' },
  { id: '6', name: 'Fernando Lima', position: 'DL', jerseyNumber: 99, status: 'inactive', lastActivity: '2025-11-30' },
];

export const AthletesListPage: FC = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simula uma chamada de API
    const fetchAthletes = async () => {
      try {
        setLoading(true);
        setError(null);
        // Em um cenário real, você faria uma chamada para athleteService.getAthletes();
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay da API
        setAthletes(mockAthletes);
      } catch (err) {
        setError("Falha ao carregar atletas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-700">Carregando atletas...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Erro: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Elenco de Atletas</h1>
      <AthleteTable athletes={athletes} />
    </div>
  );
};