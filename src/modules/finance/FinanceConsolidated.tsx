import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Filter, TrendingUp, TrendingDown, 
  Wallet, DollarSign, Activity, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Gestão Financeira Operacional - Protocolo FAHUB
 * Lógica injetada sem alteração de layout ou CSS.
 */
const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para funcionalidade real (Ligação dos botões)
  const [isFiltering, setIsFiltering] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating'>('idle');

  // Dados dinâmicos prontos para injeção de banco
  const financialSummary = {
    receitas: "6.250,00",
    despesas: "800,00",
    saldo: "5.450,00"
  };

  const transactions = [
    { cat: 'Mensalidades Base', date: '2026-01-01', ent: 'TACKLE', entColor: 'bg-blue-50 text-blue-600', val: '+ R$ 1.250,00', valColor: 'text-emerald-500', status: 'EFETIVADO', statusColor: 'bg-emerald-50 text-emerald-600' },
    { cat: 'Patrocínio Master', date: '2026-01-05', ent: 'ASSOCIAÇÃO', entColor: 'bg-slate-50 text-slate-600', val: '+ R$ 5.000,00', valColor: 'text-emerald-500', status: 'AGUARDANDO', statusColor: 'bg-orange-50 text-orange-600' },
    { cat: 'Aluguel de Campo', date: '2026-01-02', ent: 'FLAG', entColor: 'bg-orange-50 text-orange-600', val: '- R$ 800,00', valColor: 'text-rose-500', status: 'EFETIVADO', statusColor: 'bg-emerald-50 text-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      {/* Header HUD - Operacional */}
      <nav className="bg-white p-6 flex items-center justify-between shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic flex items-center gap-2">
              Gestão <span className="text-emerald-500">Financeira</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Consolidado das Entidades</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFiltering(!isFiltering)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${isFiltering ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            <Filter size={16} /> {isFiltering ? 'Fechando Filtros' : 'Filtrar'}
          </button>
          <button 
            onClick={() => setDownloadStatus('generating')}
            disabled={downloadStatus === 'generating'}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all disabled:opacity-50"
          >
            {downloadStatus === 'generating' ? <Activity className="animate-spin" size={16} /> : <Download size={16} />}
            {downloadStatus === 'generating' ? 'Gerando...' : 'Relatório'}
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 space-y-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center gap-3 text-emerald-500">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><TrendingUp size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Total Receitas</span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">R$ {financialSummary.receitas}</h2>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center"><TrendingDown size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Total Despesas</span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">R$ {financialSummary.despesas}</h2>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between min-h-[180px] relative overflow-hidden group">
            <div className="flex items-center gap-3 text-blue-400 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Wallet size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Saldo em Caixa</span>
            </div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter relative z-10">R$ {financialSummary.saldo}</h2>
            <DollarSign size={120} className="absolute -right-8 -bottom-8 text