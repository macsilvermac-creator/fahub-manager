import React from 'react';
import { useNavigate } from 'react-router-dom';

const NexusPortal: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-center font-sans">
      <h1 className="text-3xl font-bold mb-4">Protocolo Nexus</h1>
      <h2 className="text-xl text-gray-600 mb-8">Portal de Acesso e Seleção de Personas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cartão de Acesso Rápido - Dashboard */}
        <div 
          onClick={() => handleNavigation('/dashboard')}
          className="p-6 border rounded cursor-pointer hover:bg-gray-50 shadow-sm transition"
        >
          <h3 className="font-bold text-lg">Dashboard Executivo</h3>
          <p className="text-sm text-gray-500">Visão macro dos indicadores</p>
        </div>

        {/* Cartão de Acesso Rápido - Financeiro */}
        <div 
          onClick={() => handleNavigation('/financeiro')}
          className="p-6 border rounded cursor-pointer hover:bg-gray-50 shadow-sm transition"
        >
          <h3 className="font-bold text-lg">Módulo Financeiro</h3>
          <p className="text-sm text-gray-500">Gestão consolidada</p>
        </div>

        {/* Cartão de Acesso Rápido - RH */}
        <div 
          onClick={() => handleNavigation('/human-capital')}
          className="p-6 border rounded cursor-pointer hover:bg-gray-50 shadow-sm transition"
        >
          <h3 className="font-bold text-lg">Capital Humano</h3>
          <p className="text-sm text-gray-500">Gestão de membros e perfis</p>
        </div>
      </div>
    </div>
  );
};

export default NexusPortal;