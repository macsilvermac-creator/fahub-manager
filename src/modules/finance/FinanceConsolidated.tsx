import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet,
  Activity // Adicionado para corrigir o erro TS2304
} from 'lucide-react';

/**
 * Interface para garantir consistência nos lançamentos financeiros
 * Estruturada para suportar múltiplas entidades sob a mesma associação
 */
interface FinancialRecord {
  id: string;
  category: string;
  entity: 'Tackle' | 'Flag' | 'Associação';
  amount: number;
  type: 'income' | 'expense';
  status: 'paid' | 'pending';
  date: string;
}

const FinanceConsolidated: React.FC = () => {
  // Simulação de base de dados consolidada para a Persona Master
  const [records] = useState<FinancialRecord[]>([
    { id: '1', category: 'Mensalidades Base', entity: 'Tackle', amount: 1250.00, type: 'income', status: 'paid', date: '2026-01-01' },
    { id: '2', category: 'Patrocínio Master', entity: 'Associação', amount: 5000.00, type: 'income', status: 'pending', date: '2026-01-05' },
    { id: '3', category: 'Aluguel de Campo', entity: 'Flag', amount: 800.00, type: 'expense', status: 'paid', date: '2026-01-02' },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8">
      {/* Header Estratégico com Navegação de Retorno */}
      <nav className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 transition-all shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic leading-none">
              GESTÃO <span className="text-emerald-600">FINANCEIRA</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Consolidado das Entidades
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <Filter size={16} /> FILTRAR
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 px-4 py-2.5 rounded-xl text-xs font-black text-white shadow-lg shadow-emerald-900/20">
            <Download size={16} /> RELATÓRIO
          </button>
        </div>
      </nav>

      {/* Cards de Resumo Consolidado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><TrendingUp size={20} /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Receitas</span>
          </div>
          <p className="text-3xl font-black text-slate-800 tracking-tighter">R$ 6.250,00</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><TrendingDown size={20} /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Despesas</span>
          </div>
          <p className="text-3xl font-black text-slate-800 tracking-tighter">R$ 800,00</p>
        </div>

        <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Wallet size={20} /></div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Saldo em Caixa</span>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter">R$ 5.450,00</p>
        </div>
      </div>

      {/* Seção de Tabela com Scroll Horizontal para Mobile */}
      <section className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
            <DollarSign size={18} className="text-blue-600" /> Fluxo Recente
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Entidade</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Valor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{item.category}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{item.date}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black px-2 py-1 rounded border ${
                      item.entity === 'Tackle' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      item.entity === 'Flag' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.entity.toUpperCase()}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-black text-sm ${item.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.type === 'income' ? '+' : '-'} R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${
                      item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'paid' ? 'Efetivado' : 'Aguardando'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assistente Jules Analítico - Decisão do Humano solicitada */}
      <div className="bg-blue-600 rounded-[2rem] p-6 text-white flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-blue-900/20 border border-blue-500">
        <div className="bg-white/20 p-4 rounded-3xl backdrop-blur-sm">
          <Activity size={32} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Jules / Análise de Caixa</p>
          <p className="text-lg font-bold leading-tight">
            "Identifiquei que o Tackle está com 15% de inadimplência em relação ao mês anterior. Deseja que eu gere uma lista de cobrança automática para os atletas?"
          </p>
        </div>
        <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95 whitespace-nowrap">
          GERAR COBRANÇA
        </button>
      </div>
    </div>
  );
};

export default FinanceConsolidated;