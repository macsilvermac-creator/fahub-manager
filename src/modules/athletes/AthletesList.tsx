import React, { useState } from 'react';
import { AthleteTable } from './AthleteTable';
import { Athlete } from './types';

// Mock Data: Simulando resposta da API
const MOCK_ATHLETES: Athlete[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    position: 'Quarterback',
    status: 'Active',
    height: 188,
    weight: 95,
  },
  {
    id: '2',
    name: 'Marcos Oliveira',
    position: 'Wide Receiver',
    status: 'Injured',
    height: 182,
    weight: 88,
  },
  {
    id: '3',
    name: 'André Santos',
    position: 'Linebacker',
    status: 'Active',
    height: 190,
    weight: 105,
  },
  {
    id: '4',
    name: 'Felipe Costa',
    position: 'Safety',
    status: 'Suspended',
    height: 180,
    weight: 92,
  },
  {
    id: '5',
    name: 'João Pedro',
    position: 'Running Back',
    status: 'Active',
    height: 178,
    weight: 90,
  },
];

const AthletesList: React.FC = () => {
  // Estado local para futura integração com API
  const [athletes] = useState<Athlete[]>(MOCK_ATHLETES);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Atletas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualize e gerencie o elenco do time.
          </p>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2">
          <span>+</span> Novo Atleta
        </button>
      </div>

      {/* Tabela de Dados */}
      <AthleteTable data={athletes} />
    </div>
  );
};

export default AthletesList;