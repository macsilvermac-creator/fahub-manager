// src/pages/Dashboard/Dashboard.tsx
import React from 'react';
import MetricCard from '../../components/MetricCard/MetricCard'; // Ajuste o caminho conforme sua estrutura

const Dashboard: React.FC = () => {
  // Dados de exemplo para as métricas
  const totalAthletes = 150;
  const upcomingEvents = 4;
  const monthlyRevenue = "R$ 12.500,00"; // Formato como string para exibição

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total de Atletas"
          value={totalAthletes}
          description="Atletas cadastrados na plataforma"
        />
        <MetricCard
          title="Eventos Próximos"
          value={upcomingEvents}
          description="Próximos eventos agendados"
        />
        <MetricCard
          title="Receita Mensal"
          value={monthlyRevenue}
          description="Receita total do mês atual"
        />
      </div>

      {/* Você pode adicionar mais seções do dashboard aqui */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Visão Geral</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Bem-vindo ao painel de controle do FAHUB Manager. Aqui você encontra um resumo rápido das principais métricas da sua gestão esportiva.
        </p>
        {/* Mais conteúdo como gráficos, tabelas recentes, etc. */}
      </div>
    </div>
  );
};

export default Dashboard;
