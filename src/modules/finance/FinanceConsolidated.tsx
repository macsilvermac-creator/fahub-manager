import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Landmark, Settings, FileSearch, 
  Download, PieChart, Sparkles
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * CONTROLADORIA MASTER - PROTOCOLO FAHUB
 * Dashboard de Perspectiva com 4 Containers Ativos e Sidebar Master.
 */

const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();

  const masterContainers = [
    { id: 'cashflow', title: 'Fluxo de Caixa', value: 'R$ 42.150,00', detail: 'Conciliação Ativa', path: '/financeiro/fluxo', color: 'border-emerald-500/30' },
    { id: 'receivables', title: 'Contas a Receber', value: 'R$ 12.800,00', detail: 'Gestão de Mensalidades', path: '/financeiro/receber', color: 'border-blue-500/30' },
    { id: 'payables', title: 'Contas a Pagar', value: 'R$ 4.320,00', detail: 'Autorização Tesouraria', path: '/financeiro/pagar', color: 'border-red-500/30' },
    { id: 'patrimony', title: 'Patrimônio & Bens', value: 'R$ 158.000,00', detail: 'Inventário de Ativos', path: '/financeiro/patrimonio', color: 'border-purple-500/30' }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
            <Landmark size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest italic text-slate-500">Módulo Financeiro</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => navigate('/financeiro/factory')} 
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 font-black italic text-xs uppercase hover:bg-blue-600/20 transition-all mb-4"
          >
            <Sparkles size={18} /> Billing Factory
          </button>
          
          <div className="pt-2 pb-2 px-4 text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Consultivo</div>
          <SidebarItem icon={FileSearch} label="Auditoria" />
          <SidebarItem icon={PieChart} label="Relatórios" />
          <SidebarItem icon={Download} label="Exportar" />
          <SidebarItem icon={Settings} label="Configurações" />
        </nav>
        <div className="p-6 border-t border-white/5 font-black italic uppercase text-xs">
           <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white transition-colors">← Nexus Portal</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 shrink-0">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Controladoria <span className="text-emerald-500">Master</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1 font-sans">Perspectiva: Diretora Financeira</p>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {masterContainers.map((container) => (
              <div 
                key={container.id}
                onClick={() => navigate(container.path)}
                className={`relative min-h-[200px] bg-[#0a0f1e] border ${container.color} rounded-[2.5rem] p-8 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer group shadow-2xl`}
              >
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">{container.title}</p>
                  <h2 className="text-4xl font-black italic tracking-tighter text-white group-hover:text-emerald-500 transition-colors">{container.value}</h2>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic bg-white/5 w-fit px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {container.detail}
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

// COMPONENTE AUXILIAR ESSENCIAL (TS2304 FIX)
const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all group">
    <Icon size={18} className="group-hover:text-emerald-500 transition-colors" />
    <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

export default FinanceConsolidated;