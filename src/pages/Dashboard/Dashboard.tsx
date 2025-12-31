import React from 'react';
import { 
  UserGroupIcon, 
  CalendarDaysIcon, 
  BanknotesIcon 
} from '@heroicons/react/24/outline';
import StatCard from '../../components/Dashboard/StatCard';

// Interface para os dados do Dashboard (Mock para o frontend)
interface DashboardMetrics {
  totalAthletes: number;
  upcomingEvents: number;
  monthlyRevenue: number;
}

export default function Dashboard() {
  // TODO: Substituir por chamada real à API (ex: useDashboardMetrics hook)
  const metrics: DashboardMetrics = {
    totalAthletes: 150,
    upcomingEvents: 4,
    monthlyRevenue: 12500.00,
  };

  // Helper para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral do seu clube.</p>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total de Atletas"
          value={metrics.totalAthletes}
          icon={UserGroupIcon}
          colorClass="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Eventos Próximos"
          value={metrics.upcomingEvents}
          icon={CalendarDaysIcon}
          colorClass="text-orange-600 bg-orange-50"
        />
        <StatCard
          title="Receita Mensal"
          value={formatCurrency(metrics.monthlyRevenue)}
          icon={BanknotesIcon}
          colorClass="text-green-600 bg-green-50"
        />
      </div>

      {/* Área para expansão futura (Gráficos ou Tabelas Recentes) */}
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400 border-dashed border-2 border-gray-200">
        <span className="text-sm">Área reservada para gráficos de desempenho ou atividades recentes.</span>
      </div>
    </div>
  );
}