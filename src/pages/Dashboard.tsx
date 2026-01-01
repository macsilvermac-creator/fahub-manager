import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Operacional</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
        >
          Voltar ao Nexus
        </button>
      </div>
      
      <div className="p-10 border-2 border-dashed border-gray-300 rounded text-center text-gray-400">
        <p>Gráficos e KPIs serão carregados aqui.</p>
        <p className="text-xs mt-2">Status: Ambiente Real Validado</p>
      </div>
    </div>
  );
};

export default Dashboard;