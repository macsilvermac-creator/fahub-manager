// src/pages/Dashboard.tsx
import React from 'react';
import MetricCard from '../components/MetricCard'; // Assumindo que MetricCard está no mesmo nível de pastas ou um nível acima.

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard FAHUB Manager</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total de Atletas"
          value={150}
          description="Número total de atletas cadastrados."
        />
        <MetricCard
          title="Eventos Próximos"
          value={4}
          description="Total de eventos agendados para as próximas semanas."
        />
        <MetricCard
          title="Receita Mensal"
          value="12.500,00"
          currency="R$"
          description="Receita bruta total do mês corrente."
        />
        {/* Você pode adicionar mais MetricCards aqui conforme necessário */}
      </div>

      {/* Adicione outras seções do dashboard aqui, como gráficos, tabelas, etc. */}
    </div>
  );
};

export default Dashboard;