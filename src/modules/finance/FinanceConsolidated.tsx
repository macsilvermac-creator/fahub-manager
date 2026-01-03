import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Landmark, Settings, FileSearch, 
  Download, PieChart, Sparkles,
  ArrowUpRight
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** 
 * CONTROLADORIA MASTER - CONTEÚDO PURO
 * Refatorado para rodar dentro do DashboardLayout.
 */
const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();

  // MOCK DATA (Em breve vira chamada Supabase)
  const masterContainers = [
    { id: 'cashflow', title: 'Fluxo de Caixa', value: 'R$ 42.150,00', detail: 'Conciliação Ativa', path: '/financeiro/fluxo', color: 'border-emerald-500/30' },
    { id: 'receivables', title: 'Contas a Receber', value: 'R$ 12.800,00', detail: 'Gestão de Mensalidades', path: '/financeiro/receber', color: 'border-blue-500/30' },
    { id: 'payables', title: 'Contas a Pagar', value: 'R$ 4.320,00', detail: 'Autorização Tesouraria', path: '/financeiro/pagar', color: 'border-red-500/30' },
    { id: 'patrimony', title: 'Patrimônio & Bens', value: 'R$ 158.000,00', detail: 'Inventário de Ativos', path: '/financeiro/patrimonio', color: 'border-purple-500/30' }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      
      {/* HEADER ESPECÍFICO DO MÓDULO */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center p-4 bg-[#0a0f1e]/50 border border-white/5 rounded-3xl backdrop-blur-sm">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Landmark size={20} className="text-emerald-500" />
             </div>
             <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                Controladoria <span className="text-emerald-500">Master</span>
             </h1>
           </div>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic ml-1">
             Perspectiva: Diretora Financeira & Presidência
           </p>
        </div>

        {/* BOTÃO DE AÇÃO RÁPIDA (FACTORY) */}
        <button 
           onClick={() => navigate('/financeiro/factory')} 
           className="mt-4 md:mt-0 flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black italic text-xs uppercase shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all"
        >
           <Sparkles size={16} /> Billing Factory
        </button>
      </div>

      {/* GRID DE CARDS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {masterContainers.map((container) => (
          <div 
            key={container.id}
            onClick={() => navigate(container.path)}
            className={`relative min-h-[200px] bg-[#0a0f1e]/60 border ${container.color} rounded-[2.5rem] p-8 flex flex-col justify-between hover:bg-[#0a0f1e] hover:scale-[1.01] transition-all duration-300 cursor-pointer group shadow-xl backdrop-blur-md`}
          >
            {/* Ícone de Flecha no Hover */}
            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white/5 rounded-xl text-emerald-400">
               <ArrowUpRight size={20} />
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${container.id === 'payables' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                {container.title}
              </p>
              <h2 className="text-4xl font-black italic tracking-tighter text-white group-hover:text-emerald-400 transition-colors">
                {container.value}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest italic bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5 group-hover:border-emerald-500/30 transition-colors">
              {container.detail}
            </div>
          </div>
        ))}
      </div>

      <JulesAgent context="FINANCE" />
    </div>
  );
};

export default FinanceConsolidated;