import { Users, UserCheck, Calendar, DollarSign } from 'lucide-react';
import { useDashboardStats } from './useDashboardStats';
import StatCard from '../../shared/components/StatCard';

const Dashboard = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-500">Carregando estatísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">Visão geral do Joinville Gladiators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Atletas"
          value={stats.totalAthletes}
          icon={Users}
          description="registrados no sistema"
        />
        <StatCard
          title="Atletas Ativos"
          value={stats.activeAthletes}
          icon={UserCheck}
          color="green"
          description="aptos para treino"
        />
        <StatCard
          title="Próximos Eventos"
          value={stats.upcomingEvents}
          icon={Calendar}
          color="purple"
          description="nos próximos dias"
        />
        <StatCard
          title="Receita Mensal"
          value={`R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="yellow"
          description="mensalidades pagas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Frequência nos Treinos</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <span className="text-slate-400">Gráfico de Frequência (Em Breve)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Financeiro Anual</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
            <span className="text-slate-400">Gráfico Financeiro (Em Breve)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;