import React from 'react';
import DashboardLayout from './shared/components/layouts/DashboardLayout';

// Um componente temporário só para testar o Layout
const DashboardHome = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Bem-vindo ao FAHUB</h1>
      <p className="mt-2 text-gray-600">O sistema está rodando perfeitamente.</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <h3 className="font-bold text-blue-600">Status</h3>
          <p className="text-2xl font-bold">Online 🟢</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DashboardLayout pageTitle="Visão Geral">
      <DashboardHome />
    </DashboardLayout>
  );
};

export default App;