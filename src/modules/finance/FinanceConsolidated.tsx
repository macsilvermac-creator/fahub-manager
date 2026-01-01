import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Filter, TrendingUp, TrendingDown, 
  Wallet, DollarSign, Activity 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Gestão Financeira Operacional - Protocolo FAHUB
 * Restauração visual absoluta com tags JSX auditadas e corrigidas.
 */
const FinanceConsolidated: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para funcionalidade real (Ligação dos botões)
  const [isFiltering, setIsFiltering] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'generating'>('idle');

  // Dados para validação visual
  const transactions = [
    { cat: 'Mensalidades Base', date: '2026-01-01', ent: 'TACKLE', entColor: 'bg-blue-50 text-blue-600', val: '+ R$ 1.250,00', valColor: 'text-emerald-500', status: 'EFETIVADO', statusColor: 'bg-emerald-50 text-emerald-600' },
    { cat: 'Patrocínio Master', date: '2026-01-05', ent: 'ASSOCIAÇÃO', entColor: 'bg-slate-50 text-slate-600', val: '+ R$ 5.000,00', valColor: 'text-emerald-500', status: 'AGUARDANDO', statusColor: 'bg-orange-50 text-orange-600' },
    { cat: 'Aluguel de Campo', date: '2026-01-02', ent: 'FLAG', entColor: 'bg-orange-50 text-orange-600', val: '- R$ 800,00', valColor: 'text-rose-500', status: 'EFETIVADO', statusColor: 'bg-emerald-50 text-emerald-600' }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      {/* Header HUD */}
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all outline-none"
          >
            <Filter size={16} /> {isFiltering ? 'Ativo' : 'Filtrar'}
          </button>
          <button 
            onClick={() => setDownloadStatus('generating')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all outline-none"
          >
            {downloadStatus === 'generating' ? <Activity className="animate-spin" size={16} /> : <Download size={16} />}
            Relatório
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
            <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">R$ 6.250,00</h2>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-white flex flex-col justify-between min-h-[180px]">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center"><TrendingDown size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Total Despesas</span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 italic tracking-tighter">R$ 800,00</h2>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between min-h-[180px] relative overflow-hidden group">
            <div className="flex items-center gap-3 text-blue-400 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Wallet size={20} /></div>
              <span className="text-[10px] font-black uppercase tracking-widest">Saldo em Caixa</span>
            </div>
            <h2 className="text-4xl font-black text-white italic tracking-tighter relative z-10">R$ 5.450,00</h2>
            <DollarSign size={120} className="absolute -right-8 -bottom-8 text-white/5 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>

        {/* Fluxo Recente */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center gap-3">
            <DollarSign size={18} className="text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 italic">Fluxo Recente</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                  <th className="px-8 py-6">Categoria</th>
                  <th className="px-8 py-6 text-center">Entidade</th>
                  <th className="px-8 py-6 text-right">Valor</th>
                  <th className="px-8 py-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <p className="text-[11px] font-black text-slate-800 italic uppercase leading-none">{item.cat}</p>
                      <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{item.date}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase border border-current/10 ${item.entColor}`}>
                        {item.ent}
                      </span>
                    </td>
                    <td className={`px-8 py-6 text-right font-black text-xs italic ${item.valColor}`}>
                      {item.val}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight Jules */}
        <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <Activity size={100} className="absolute -left-5 -bottom-5 text-white/10" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Activity size={24} />
            </div>
            <div className="max-w-2xl">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-200 mb-2 italic">Jules / Análise de Caixa</p>
              <p className="text-sm font-bold italic leading-tight">
                "Identifiquei que o Tackle está com 15% de inadimplência em relação ao mês anterior. Deseja que eu gere uma lista de cobrança automática para os atletas?"
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert("Gerando lista de cobrança...")}
            className="bg-white text-blue-600 px-10 py-4 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-slate-50 transition-all relative z-10 outline-none active:scale-95"
          >
            Gerar Cobrança
          </button>
        </div>
      </main>
    </div>
  );
};

export default FinanceConsolidated;         