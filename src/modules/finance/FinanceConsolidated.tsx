import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, Landmark, Settings, FileSearch, 
  Download, PieChart, ArrowRight, TrendingUp, 
  AlertCircle, Wallet
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * DIRETORIA FINANCEIRA - DASHBOARD ATIVO
 * 4 Containers Simétricos configurados como portais operacionais.
 */

const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();

  const masterContainers = [
    {
      id: 'cashflow',
      title: 'Fluxo de Caixa',
      icon: DollarSign,
      value: 'R$ 42.150,00',
      detail: 'Conciliação Bancária Ativa',
      path: '/financeiro/fluxo', // Caminho para a subpágina
      color: 'border-emerald-500/30'
    },
    {
      id: 'receivables',
      title: 'Contas a Receber',
      icon: TrendingUp,
      value: 'R$ 12.800,00',
      detail: 'Gestão de Mensalidades',
      path: '/financeiro/receber', // Caminho para a subpágina
      color: 'border-blue-500/30'
    },
    {
      id: 'payables',
      title: 'Contas a Pagar',
      icon: AlertCircle,
      value: 'R$ 4.320,00',
      detail: 'Autorização de Tesouraria',
      path: '/financeiro/pagar', // Caminho para a subpágina (FinancePayables)
      color: 'border-red-500/30'
    },
    {
      id: 'patrimony',
      title: 'Patrimônio & Bens',
      icon: Wallet,
      value: 'R$ 158.000,00',
      detail: 'Inventário de Ativos',
      path: '/financeiro/patrimonio', // Caminho para a subpágina
      color: 'border-purple-500/30'
    }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR PADRÃO RESTAURADA */}
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col">
        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4"></div>
          <h2 className="text-xs font-black uppercase tracking-[0.3em] italic text-slate-500">Módulo Financeiro</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={FileSearch} label="Auditoria de Logs" />
          <SidebarItem icon={PieChart} label="Relatórios Anuais" />
          <SidebarItem icon={Download} label="Exportar Dados" />
          <SidebarItem icon={Settings} label="Configurações" />
        </nav>
        <div className="p-6 border-t border-white/5">
           <button onClick={() => navigate('/')} className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors">
              <Landmark size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Nexus Portal</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 flex justify-between items-center bg-gradient-to-b from-[#0a0f1e] to-transparent">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Controladoria <span className="text-emerald-500">Master</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1 italic italic">Gestão por Perspectiva: Dir. Financeiro</p>
          </div>
        </header>

        {/* GRID ATIVO */}
        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1600px] mx-auto w-full content-center">
          {masterContainers.map((container) => (
            <div 
              key={container.id}
              onClick={() => navigate(container.path)} // Ação de clique para abrir a funcionalidade
              className={`relative bg-[#0a0f1e] border ${container.color} rounded-[2.5rem] p-10 flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer group shadow-2xl`}
            >
              <div className="flex justify-between items-start">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                  <container.icon size={32} className="text-emerald-400" />
                </div>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 transition-all text-emerald-500" />
              </div>

              <div className="mt-8">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 italic">{container.title}</p>
                <h2 className="text-4xl font-black italic tracking-tighter text-white">{container.value}</h2>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {container.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <JulesAgent context="FINANCE" />
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all group">
    <Icon size={20} className="flex-shrink-0" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default FinanceConsolidated;