import React from 'react';
import { ArrowLeft, Download, Filter, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();

  // Função para simular download de relatório
  const handleDownload = () => {
    alert("Gerando Relatório Consolidado em PDF...");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HUD Superior - Link de Retorno Ativado */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 flex items-center justify-between shadow-2xl">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-400 transition-all"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-300">Saúde Financeira</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert("Abrindo Filtros Avançados...")}
            className="p-2 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all"
          >
            <Filter size={18} />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-all"
          >
            <Download size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
        {/* Card Master HUD */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl relative overflow-hidden group">
          <TrendingUp size={300} className="absolute -right-20 -bottom-20 opacity-[0.02] text-emerald-900" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Saldo Consolidado</p>
            <h1 className="text-5xl font-black text-slate-900 italic tracking-tighter">R$ 45.200,00</h1>
          </div>
        </div>

        {/* Listagem de Exemplo para Validação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-emerald-700 uppercase mb-1">Entradas (Mês)</p>
              <p className="text-2xl font-black text-emerald-900">R$ 12.450</p>
            </div>
            <TrendingUp className="text-emerald-500" size={32} />
          </div>
          <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-rose-700 uppercase mb-1">Saídas (Mês)</p>
              <p className="text-2xl font-black text-rose-900">R$ 4.120</p>
            </div>
            <TrendingDown className="text-rose-500" size={32} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceConsolidated;