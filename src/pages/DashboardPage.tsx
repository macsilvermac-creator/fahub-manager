import { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Users, 
  Activity, 
  AlertTriangle,
  Menu
} from 'lucide-react';

// --- COMPONENTE 1: AGENDA TICKER (A Barra de Ação) ---
const AgendaTicker = () => {
  return (
    <div className="w-full bg-slate-100 border-b border-slate-200 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-slate-700">
        <Calendar className="h-5 w-5 text-indigo-600" />
        <span className="font-semibold text-sm">PRÓXIMO:</span>
        <span className="text-sm">Treino Tático (Hoje, 19:30)</span>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded shadow-sm transition-all">
          <CheckCircle2 className="h-3 w-3" /> CONFIRMAR
        </button>
        <button className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded shadow-sm transition-all">
          <XCircle className="h-3 w-3" /> JUSTIFICAR
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE 2: WIDGET PADRÃO (O Card do Grid) ---
const StatCard = ({ title, value, sub, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-40 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10`}>
        <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
      {sub}
    </p>
  </div>
);

// --- TELA PRINCIPAL ---
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER SIMPLES */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-lg lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-6 w-6 text-slate-600" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">FAHUB <span className="text-indigo-600">MANAGER</span></h1>
        </div>
        <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
          JD
        </div>
      </header>

      {/* BARRA DE AGENDA */}
      <AgendaTicker />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Visão Geral</h2>
        
        {/* O GRID 2x2 (BENTO GRID) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* SLOT 1: FINANCEIRO */}
          <StatCard 
            title="Caixa do Time" 
            value="R$ 12.450" 
            sub="+15% vs mês passado" 
            icon={TrendingUp} 
            colorClass="bg-green-600 text-green-600" 
          />

          {/* SLOT 2: ATLETAS */}
          <StatCard 
            title="Elenco Ativo" 
            value="48 Atletas" 
            sub="3 novos inscritos pendentes" 
            icon={Users} 
            colorClass="bg-blue-600 text-blue-600" 
          />

          {/* SLOT 3: SAÚDE */}
          <StatCard 
            title="Dept. Médico" 
            value="2 Lesionados" 
            sub="Retorno previsto: 15 dias" 
            icon={Activity} 
            colorClass="bg-red-500 text-red-500" 
          />

          {/* SLOT 4: ALERTA / TAREFAS */}
          <StatCard 
            title="Pendências" 
            value="5 Boletos" 
            sub="Vencimento próximo: Federação" 
            icon={AlertTriangle} 
            colorClass="bg-yellow-500 text-yellow-500" 
          />
          
        </div>
      </main>
    </div>
  );
}