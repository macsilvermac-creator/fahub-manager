import { Users, Activity, AlertTriangle, DollarSign } from 'lucide-react';
import StatCard from './components/StatCard';
import { useAthletes } from '../athletes/useAthletes';

const Dashboard = () => {
  const { athletes } = useAthletes();

  // Cálculos baseados no array de atletas
  const totalAthletes = athletes.length;
  // O TypeScript agora vai entender que 'a' é um Atleta porque importamos corretamente
  const activeAthletes = athletes.filter(a => a.status === 'ACTIVE').length;
  const injuredAthletes = athletes.filter(a => a.status === 'INJURED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Temporada 2026
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Elenco" 
          value={totalAthletes} 
          icon={Users} 
          color="bg-blue-600"
          trend="+2"
          trendColor="text-green-600"
        />
        
        <StatCard 
          label="Ativos" 
          value={activeAthletes} 
          icon={Activity} 
          color="bg-green-500"
        />

        <StatCard 
          label="Lesionados" 
          value={injuredAthletes} 
          icon={AlertTriangle} 
          color="bg-red-500"
          trend="-1"
          trendColor="text-green-600"
        />

        <StatCard 
          label="Caixa (Simulado)" 
          value="R$ 1.2k" 
          icon={DollarSign} 
          color="bg-yellow-500"
          trend="+15%"
          trendColor="text-green-600"
        />
      </div>
      
      {/* Placeholders Visuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400">
          Gráfico de Frequência (Em breve)
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400">
          Próximos Jogos (Em breve)
        </div>
      </div>
    </div>
  );
};

export default Dashboard;