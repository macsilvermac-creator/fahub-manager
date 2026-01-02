import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, Landmark, Settings, FileSearch, 
  Download, PieChart, ArrowRight, TrendingUp, 
  AlertCircle, Wallet
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();

  const masterContainers = [
    { 
      id: 'cashflow', 
      title: 'Fluxo de Caixa', 
      icon: DollarSign, 
      value: 'R$ 42.150,00', 
      detail: 'Conciliação Ativa', 
      path: '/financeiro/fluxo', // Caminho Ativado
      color: 'border-emerald-500/30' 
    },
    { 
      id: 'receivables', 
      title: 'Contas a Receber', 
      icon: TrendingUp, 
      value: 'R$ 12.800,00', 
      detail: 'Gestão de Mensalidades', 
      path: '/financeiro/receber', 
      color: 'border-blue-500/30' 
    },
    { 
      id: 'payables', 
      title: 'Contas a Pagar', 
      icon: AlertCircle, 
      value: 'R$ 4.320,00', 
      detail: 'Autorização Tesouraria', 
      path: '/financeiro/pagar', 
      color: 'border-red-500/30' 
    },
    { 
      id: 'patrimony', 
      title: 'Patrimônio & Bens', 
      icon: Wallet, 
      value: 'R$ 158.000,00', 
      detail: 'Inventário de Ativos', 
      path: '/financeiro/patrimonio', // Caminho Ativado
      color: 'border-purple-500/30' 
    }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
            <Landmark size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-500">Módulo Financeiro</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 font-black italic uppercase">
          <SidebarItem icon={FileSearch} label="Auditoria" />
          <SidebarItem icon={PieChart} label="Relatórios" />
          <SidebarItem icon={Download} label="Exportar" />
          <SidebarItem icon={Settings} label="Configurações" />
        </nav>
        <div className="p-6 border-t border-white/5">
           <button onClick={() => navigate('/')} className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group">
              <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:text-emerald-500 transition-colors">← Nexus Portal</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="p-8 shrink-0 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Controladoria <span className="text-emerald-500">Master</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1 font-sans">Gestão Consolidada de Ativos e Passivos</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {masterContainers.map((container) => (
              <div 
                key={container.id}
                onClick={() => navigate(container.path)} // EXECUÇÃO DA NAVEGAÇÃO
                className={`relative min-h-[220px] bg-[#0a0f1e] border ${container.color} rounded-[2.5rem] p-8 flex flex-col justify-between hover:scale-[1.01] hover:bg-white/[0.02] transition-all cursor-pointer group shadow-2xl overflow-hidden`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <container.icon size={28} className="text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <span className="text-[10px] font-black uppercase italic text-emerald-500">Acessar Subpágina</span>
                    <ArrowRight size={18} className="text-emerald-500" />
                  </div>
                </div>
                
                <div className="mt-8">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{container.title}</p>
                  <h2 className="text-4xl font-black italic tracking-tighter text-white group-hover:text-emerald-500 transition-colors">{container.value}</h2>
                  <div className="flex items-center gap-2 mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic bg-white/5 w-fit px-3 py-1 rounded-full border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {container.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <JulesAgent context="FINANCE" />
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all group">
    <Icon size={18} className="group-hover:text-emerald-500 transition-colors" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default FinanceConsolidated;