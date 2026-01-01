import React from 'react';
import { 
  ArrowLeft, Download, Filter, TrendingUp, TrendingDown, 
  DollarSign, PieChart, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Saúde Financeira - Protocolo FAHUB
 * Visual Original Restaurado com Navegação Ativa.
 */
const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HUD Superior - Navegação Ativada mantendo a Estética Master */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 flex items-center justify-between shadow-2xl">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-400 transition-all outline-none"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-300">Saúde Financeira</span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all">
            <Filter size={18} />
          </button>
          <button className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all">
            <Download size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-10">
        <header>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            Consolidado <span className="text-emerald-600">Financeiro</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-4 italic">
            Joinville Gladiators / Ciclo Jan 2026
          </p>
        </header>

        {/* Card Master de Saldo - Restaurado com Fundo Escuro e Marca d'água */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl">
          <DollarSign size={400} strokeWidth={1} className="absolute -right-20 -bottom-20 opacity-[0.03] text-white group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 italic">Saldo Disponível em Caixa</p>
              <h2 className="text-6xl font-black italic tracking-tighter leading-none">R$ 45.200,00</h2>
              <div className="flex items-center gap-4 mt-8">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-2xl text-[10px] font-black uppercase italic">
                  +12% vs mês anterior
                </span>
              </div>
            </div>
            
            {/* Gráfico HUD de Distribuição */}
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl min-w-[320px]">
               <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-center w-full">Distribuição de Receita</span>
               </div>
               <div className="flex justify-center">
                  <PieChart size={80} className="text-emerald-500 opacity-30" />
               </div>
            </div>
          </div>
        </div>

        {/* Grid de Métricas Master - Restaurado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><ArrowUpRight size={24} /></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Entradas</span>
            </div>
            <p className="text-4xl font-black text-slate-800 italic leading-none tracking-tighter">R$ 12.450</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl group hover:border-rose-500/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-rose-50 rounded-2xl text-rose-600"><ArrowDownRight size={24} /></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Saídas</span>
            </div>
            <p className="text-4xl font-black text-slate-800 italic leading-none tracking-tighter">R$ 4.120</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><TrendingUp size={24} /></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Projeção Fev</span>
            </div>
            <p className="text-4xl font-black text-slate-800 italic leading-none tracking-tighter">R$ 52.800</p>
          </div>
        </div>

        {/* Mensagem do Agente Jules - Persistência de Funcionalidade */}
        <div className="bg-slate-950 rounded-[3rem] p-8 text-white shadow-2xl border border-slate-800 flex items-center gap-8 group">
          <div className="w-14 h-14 bg-emerald-600 rounded-[1.8rem] flex items-center justify-center font-black italic shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">J</div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2 italic">Jules / Auditoria Master</p>
            <p className="text-lg font-medium leading-tight italic text-slate-300">
              "Fluxo de caixa saudável. A retenção de sócios gerou um <span className="text-white font-bold underline">excesso de R$ 8.000</span>. Sugiro alocação estratégica em infraestrutura."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceConsolidated;