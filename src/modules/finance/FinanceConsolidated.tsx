import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, Target, Download, ArrowUpRight, 
  ArrowDownRight, CreditCard, Landmark, Search
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * DIRETORIA FINANCEIRA - PROTOCOLO FAHUB
 * Interface de Alta Performance para Gestão de Caixa e Projeções sem Sidebar.
 */

const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // MOCK DATA: Fluxo de Caixa Crucial
  const stats = [
    { label: "Saldo Consolidado", value: "R$ 42.150,00", trend: "+12%", color: "text-emerald-400" },
    { label: "Receitas Previstas", value: "R$ 12.800,00", trend: "Mensal", color: "text-blue-400" },
    { label: "Despesas Pendentes", value: "R$ 4.320,00", trend: "Venc. 48h", color: "text-red-400" },
    { label: "Burn Rate (Mensal)", value: "R$ 8.150,00", trend: "-5%", color: "text-orange-400" }
  ];

  const recentTransactions = [
    { id: 1, type: 'IN', title: 'Mensalidades Tackle', value: 'R$ 2.450,00', category: 'Membership', status: 'COMPLETED', date: '01/01/2026' },
    { id: 2, type: 'OUT', title: 'Aluguel Campo', value: 'R$ 1.200,00', category: 'Infra', status: 'PENDING', date: '05/01/2026' },
    { id: 3, type: 'IN', title: 'Patrocínio Red Zone', value: 'R$ 5.000,00', category: 'Marketing', status: 'COMPLETED', date: '28/12/2025' },
    { id: 4, type: 'OUT', title: 'Equipamento Importado', value: 'R$ 3.800,00', category: 'Material', status: 'COMPLETED', date: '20/12/2025' }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">
      
      {/* HEADER GESTÃO FINANCEIRA (Protocolo Nexus) */}
      <header className="p-6 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest italic">← Nexus Portal</button>
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <DollarSign className="text-emerald-500" size={24} />
              Gestão <span className="text-emerald-500">Financeira</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Diretoria de Tesouraria & Investimentos</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-all"><Download size={18} /></button>
          <button className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2 rounded-xl font-black italic text-xs uppercase shadow-lg shadow-emerald-500/20">Novo Lançamento</button>
        </div>
      </header>

      {/* GRID DE 4 CONTAINERS */}
      <main className="p-6 max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pb-24">
        
        {/* CONTAINER 1: VISÃO GERAL DE CAIXA */}
        <div className="lg:col-span-8 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">1. Snapshot de Performance</h3>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-bold italic">CAIXA POSITIVO</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">{stat.label}</p>
                <h4 className={`text-xl font-black italic ${stat.color}`}>{stat.value}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-2">{stat.trend}</p>
              </div>
            ))}
          </div>

          <div className="flex-1 bg-black/40 rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
             <div className="flex justify-between items-end h-32 gap-2">
                {[40, 70, 45, 90, 65, 80, 50, 60, 95, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-lg relative">
                     <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm"></div>
                  </div>
                ))}
             </div>
             <p className="text-[9px] text-center text-slate-600 font-bold uppercase tracking-widest">Projeção de Fluxo de Caixa - 2026</p>
          </div>
        </div>

        {/* CONTAINER 2: RESERVAS & METAS */}
        <div className="lg:col-span-4 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">2. Reservas & Metas</h3>
           <div className="space-y-6">
              <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                 <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">Fundo de Emergência</span>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-widest">85%</span>
                 </div>
                 <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 w-[85%] h-full"></div>
                 </div>
              </div>
           </div>
           <div className="mt-auto bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-2">
                 <Target className="text-emerald-400" size={20} />
                 <span className="text-xs font-black italic uppercase text-white">Objetivo Trimestral</span>
              </div>
              <p className="text-[10px] text-emerald-200/50 leading-relaxed italic">Atingir saldo em conta de R$ 60.000,00 para aquisições técnicas.</p>
           </div>
        </div>

        {/* CONTAINER 3: MOVIMENTAÇÕES */}
        <div className="lg:col-span-8 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl overflow-hidden">
           <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">3. Movimentações Recentes</h3>
              <div className="flex bg-black/40 border border-white/5 rounded-xl px-3 py-1 items-center gap-2">
                 <Search size={14} className="text-slate-600" />
                 <input 
                   placeholder="Filtrar..." 
                   className="bg-transparent border-none outline-none text-[10px] font-bold w-32"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-3">
                 <thead>
                    <tr className="text-[9px] font-black uppercase text-slate-600 tracking-widest italic">
                       <th className="px-4">Data</th>
                       <th className="px-4">Descrição</th>
                       <th className="px-4 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="text-xs">
                    {recentTransactions.map(tx => (
                       <tr key={tx.id} className="bg-white/5 hover:bg-white/10 transition-colors">
                          <td className="px-4 py-4 first:rounded-l-2xl font-mono text-slate-500 text-[10px]">{tx.date}</td>
                          <td className="px-4 py-4 font-bold italic uppercase tracking-tight flex items-center gap-2">
                             {tx.type === 'IN' ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
                             {tx.title}
                          </td>
                          <td className="px-4 py-4 last:rounded-r-2xl text-right">
                             <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${tx.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                {tx.status}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* CONTAINER 4: CONTAS */}
        <div className="lg:col-span-4 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-2xl">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">4. Contas Cadastradas</h3>
           <div className="space-y-4 flex-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl relative overflow-hidden group shadow-lg">
                 <div className="relative z-10 flex flex-col justify-between min-h-[100px]">
                    <div className="flex justify-between items-start">
                       <Landmark size={24} className="text-white/30" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/50 italic">Master Account</span>
                    </div>
                    <h5 className="text-xl font-black italic text-white">R$ 38.420,00</h5>
                 </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl flex justify-between items-center">
                 <CreditCard size={18} className="text-slate-500" />
                 <span className="text-sm font-black italic text-white">R$ 3.730,00</span>
              </div>
           </div>
           <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest italic text-slate-400 hover:text-white transition-all">
              Gestão Patrimonial
           </button>
        </div>
      </main>

      <JulesAgent context="FINANCE" />

      {/* FOOTER STATUS */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0f1e]/80 backdrop-blur border border-white/10 px-6 py-2 rounded-full flex items-center gap-4 z-50">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 italic">Financial Mode Active</span>
      </div>
    </div>
  );
};

export default FinanceConsolidated;