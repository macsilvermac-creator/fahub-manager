import React, { useState } from 'react';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import JulesAgent from '../shared/components/Jules';

const FinanceConsolidated: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dados Mockados
  const transactions = [
    { id: 1, desc: 'Mensalidades Base (Tackle)', entity: 'Tackle', date: '01/01/2026', amount: 1250.00, type: 'in', status: 'Efetivado' },
    { id: 2, desc: 'Patrocínio Master', entity: 'Associação', date: '28/12/2025', amount: 5000.00, type: 'in', status: 'Efetivado' },
    { id: 3, desc: 'Compra Equipamentos (Cones)', entity: 'Flag', date: '20/12/2025', amount: -450.00, type: 'out', status: 'Pendente' },
    { id: 4, desc: 'Manutenção do Campo', entity: 'Associação', date: '15/12/2025', amount: -350.00, type: 'out', status: 'Efetivado' },
    { id: 5, desc: 'Venda de Kits Torcedor', entity: 'Comercial', date: '10/12/2025', amount: 800.00, type: 'in', status: 'Efetivado' },
  ];

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 1. NAVEGAÇÃO LATERAL */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. ÁREA DE CONTEÚDO */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER */}
        <header className="p-4 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg"
            >
              ☰
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">💎</span> GESTÃO FINANCEIRA
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Consolidado das Entidades</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition">
              Filtros
            </button>
            <button className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded hover:bg-emerald-500 transition shadow-lg shadow-emerald-500/20">
              + Nova Receita
            </button>
          </div>
        </header>

        <main className="p-4 max-w-7xl mx-auto w-full pb-24">
          
          {/* KPIS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="bg-[#1e293b]/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Receitas</p>
                <h3 className="text-2xl font-bold text-emerald-400">R$ 6.250,00</h3>
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">↗</div>
            </div>
            <div className="bg-[#1e293b]/40 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Total Despesas</p>
                <h3 className="text-2xl font-bold text-rose-400">R$ 800,00</h3>
              </div>
              <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">↘</div>
            </div>
             <div className="bg-gradient-to-r from-indigo-900/40 to-[#1e293b]/40 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs text-indigo-300 font-bold uppercase mb-1">Saldo em Caixa</p>
                <h3 className="text-2xl font-bold text-white">R$ 5.450,00</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 border border-indigo-500/50">$</div>
            </div>
          </div>

          {/* LISTA */}
          <div className="bg-[#1e293b]/30 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]/50">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fluxo Recente</h3>
              <span className="text-[10px] text-slate-500">Últimos 30 dias</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase text-slate-500 bg-[#0f172a]/30">
                    <th className="p-3 font-semibold">Descrição</th>
                    <th className="p-3 font-semibold hidden md:table-cell">Entidade</th>
                    <th className="p-3 font-semibold hidden md:table-cell">Data</th>
                    <th className="p-3 font-semibold text-right">Valor</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm">
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-200">{t.desc}</div>
                        <div className="md:hidden text-[10px] text-slate-500">{t.date} • {t.entity}</div>
                      </td>
                      <td className="p-3 text-slate-400 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">{t.entity}</span>
                      </td>
                      <td className="p-3 text-slate-400 hidden md:table-cell">{t.date}</td>
                      <td className={`p-3 text-right font-mono font-bold ${t.type === 'in' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.type === 'in' ? '+' : '-'} R$ {Math.abs(t.amount).toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[9px] uppercase px-2 py-1 rounded-full font-bold border ${t.status === 'Efetivado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-2 text-center border-t border-slate-800">
               <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold transition">Ver Extrato Completo ↓</button>
            </div>
          </div>
        </main>

        {/* JULES AGENT */}
        <JulesAgent context="FINANCE" />

      </div>
    </div>
  );
};

export default FinanceConsolidated;