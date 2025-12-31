import React, { useEffect, useState } from 'react';
import StatCard from '../components/dashboard/StatCard';
// Ícones sugeridos (assumindo heroicons ou lucide-react, ou use placeholders SVG)
import { Users, Calendar, DollarSign } from 'lucide-react'; 

// Interface para os dados da Dashboard
interface DashboardMetrics {
  totalAthletes: number;
  upcomingEvents: number;
  monthlyRevenue: number;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulação de Fetch de Dados (Substituir por chamada API real futuramente)
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulating API latency
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock Data
        setMetrics({
          totalAthletes: 150,
          upcomingEvents: 4,
          monthlyRevenue: 12500.00
        });
      } catch (error) {
        console.error("Erro ao carregar métricas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Visão geral do FAHUB Manager</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Total de Atletas */}
          <StatCard 
            title="Total de Atletas" 
            value={metrics.totalAthletes}
            icon={<Users size={24} />}
            color="blue"
          />

          {/* Card: Eventos Próximos */}
          <StatCard 
            title="Eventos Próximos" 
            value={metrics.upcomingEvents}
            icon={<Calendar size={24} />}
            color="orange"
          />

          {/* Card: Receita Mensal */}
          <StatCard 
            title="Receita Mensal" 
            value={formatCurrency(metrics.monthlyRevenue)}
            icon={<DollarSign size={24} />}
            color="green"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;