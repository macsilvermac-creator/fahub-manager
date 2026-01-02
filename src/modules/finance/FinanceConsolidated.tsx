import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, Landmark, CreditCard, Receipt, 
  Settings, FileSearch, Download, PieChart,
  ArrowRight, TrendingUp, AlertCircle, Wallet
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * DIRETORIA FINANCEIRA - PROTOCOLO FAHUB MASTER
 * 4 Containers Simétricos com Sub-navegação e Sidebar de Apoio.
 */

const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();

  // Estrutura dos 4 Containers Mestres (Mesmo tamanho e peso visual)
  const masterContainers = [
    {
      id: 'cashflow',
      title: 'Fluxo de Caixa',
      icon: DollarSign,
      value: 'R$ 42.150,00',
      detail: 'Saldo Real em Conta',
      path: '/financeiro/fluxo',
      color: 'border-emerald-500/30'
    },
    {
      id: 'receivables',
      title: 'Contas a Receber',
      icon: TrendingUp,
      value: 'R$ 12.800,00',
      detail: 'Previsão Janeiro/26',
      path: '/financeiro/receber',
      color: 'border-blue-500/30'
    },
    {
      id: 'payables',
      title: 'Contas a Pagar',
      icon: AlertCircle,
      value: 'R$ 4.320,00',
      detail: '7 pendências críticas',
      path: '/financeiro/pagar',
      color: 'border-red-500/30'
    },
    {
      id: 'patrimony',
      title: 'Patrimônio & Bens',
      icon: Wallet,
      value: 'R$ 158.000,00',
      detail: 'Equipamentos e Ativos',
      path: '/financeiro/patrimonio',
      color: 'border-purple-500/30'
    }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR DE APOIO (Funcionalidades Secundárias) */}
      <aside className="w-20 hover:w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col transition-all duration-300 group z-50">
        <div className="p-6 flex items-center justify-center group-hover:justify-start gap-4">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex-shrink-0"></div>
          <span className="font-black italic text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity">Financeiro Dir.</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-8">
          <SidebarItem icon={FileSearch} label="Auditoria de Logs" />
          <SidebarItem icon={PieChart} label="Relatórios Anuais" />
          <SidebarItem icon={Download} label="Exportar XML/CSV" />
          <SidebarItem icon={Settings} label="Config. Taxas" />
        </nav>

        <div className="p-6 border-t border-white/5">
           <button onClick={() => navigate('/')} className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors">
              <Landmark size={20} />
              <span className="text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">Nexus Portal</span>
           </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL (Canvas HUD) */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header HUD */}
        <header className="p-8 flex justify-between items-center bg-gradient-to-b from-[#0a0f1e] to-transparent">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Controladoria <span className="text-emerald-500">Master</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1 italic">
              Visão de Perspectiva: Diretora Financeira
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Live Database Link</span>
          </div>
        </header>

        {/* GRID SIMÉTRICO DE 4 CONTAINERS */}
        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1600px] mx-auto w-full content-center">
          {masterContainers.map((container) => (
            <div 
              key={container.id}
              onClick={() => navigate(container.path)}
              className={`
                relative bg-[#0a0f1e] border ${container.color} rounded-[2.5rem] p-10 
                flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer 
                group shadow-2xl hover:bg-[#0d1428]
              `}
            >
              <div className="flex justify-between items-start">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                  <container.icon size={32} className="text-emerald-400" />
                </div>
                <button className="p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>

              <div className="mt-8">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 italic">
                  {container.title}
                </p>
                <h2 className="text-4xl font-black italic tracking-tighter text-white">
                  {container.value}
                </h2>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {container.detail}
                </div>
              </div>

              {/* Elemento Decorativo HUD */}
              <div className="absolute bottom-6 right-6 opacity-5 font-black text-8xl italic uppercase pointer-events-none select-none">
                {container.id.slice(0, 4)}
              </div>
            </div>
          ))}
        </div>
      </main>

      <JulesAgent context="FINANCE" />
    </div>
  );
};

// Componente Auxiliar Sidebar
const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all group/item">
    <Icon size={20} className="flex-shrink-0" />
    <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      {label}
    </span>
  </button>
);

export default FinanceConsolidated;