// src/pages/Dashboard.tsx
import React from 'react';
import MetricCard from '../components/MetricCard'; // Importa o componente MetricCard
import Header from '../components/Header'; // Assumimos que o Header já existe
import Sidebar from '../components/Sidebar'; // Assumimos que o Sidebar já existe

const Dashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar /> {/* Componente Sidebar existente */}
      <div className="flex-1 flex flex-col">
        <Header /> {/* Componente Header existente */}
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total de Atletas"
              value="150"
              description="Atletas cadastrados"
            />
            <MetricCard
              title="Eventos Próximos"
              value="4"
              description="Eventos nos próximos 30 dias"
            />
            <MetricCard
              title="Receita Mensal"
              value="R$ 12.500,00"
              description="Faturamento do mês atual"
              isCurrency={true}
            />
          </div>

          {/* Você pode adicionar mais seções aqui, como gráficos, tabelas, etc. */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;