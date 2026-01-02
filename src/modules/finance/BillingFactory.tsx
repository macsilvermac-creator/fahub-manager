import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, Send, Archive, 
  Users, Calendar, Clock, Trash2, Filter
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * BILLING FACTORY - PROTOCOLO NEXUS
 * Geração de Lotes de Cobrança com Visual de Máquina de Geração.
 */

const BillingFactory: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const [drafts] = useState([
    { id: 1, target: 'Ataque (Tackle)', type: 'Mensalidade', value: 'R$ 150,00', qty: 22 },
    { id: 2, target: 'Staff Técnico', type: 'Ajuda de Custo', value: 'R$ 200,00', qty: 8 },
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR PADRÃO FAHUB */}
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest italic text-slate-500">Billing Factory</h2>
        </div>
        <nav className="flex-1 px-4">
          <button 
            onClick={() => navigate('/financeiro')} 
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white font-black italic text-xs uppercase border border-white/5 hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} /> Dashboard Master
          </button>
        </nav>
      </aside>

      {/* ÁREA DE OPERAÇÃO (2 CONTAINERS SIMÉTRICOS) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 border-b border-white/5 bg-[#0a0f1e]/50 backdrop-blur-md">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Billing <span className="text-blue-500">Factory</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1 font-sans">Geração de Lotes e Cobrança em Massa</p>
        </header>

        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
          
          {/* CONTAINER 1: O GERADOR (INPUT) */}
          <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">1. Parâmetros de Geração</h3>
            </div>
            
            <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-white/5 rounded-xl border border-blue-500/30 text-[10px] font-bold uppercase flex items-center gap-2">
                  <Users size={14} className="text-blue-400" /> Todos Atletas
                </button>
                <button className="p-3 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold uppercase flex items-center gap-2 opacity-50">
                  <Filter size={14} /> Por Categoria
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Valor Unitário</label>
                  <input type="text" placeholder="R$ 150,00" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Data de Vencimento</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" placeholder="10/01/2026" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pl-10 text-xs font-bold outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black italic uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20"
              >
                {isGenerating ? 'Processando Lote...' : 'Gerar Títulos em Massa'}
              </button>
            </div>
          </div>

          {/* CONTAINER 2: ARQUIVO E ENVIO (OUTPUT) */}
          <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl italic">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center font-sans">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">2. Fila de Distribuição</h3>
              <Archive size={16} className="text-slate-500" />
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar font-sans">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:border-blue-500/50 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-sm font-black italic uppercase tracking-tight text-white">{draft.target}</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{draft.type} • {draft.qty} Títulos</p>
                    </div>
                    <p className="text-lg font-black text-blue-400 italic leading-none">{draft.value}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center justify-center gap-2 transition-all">
                      <Send size={12} /> Disparar Lote
                    </button>
                    <button className="p-2 bg-white/5 rounded-lg text-slate-600 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center opacity-30">
                <Clock size={32} className="mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest">Aguardando Novas Gerações</p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <JulesAgent context="FINANCE" />
    </div>
  );
};

export default BillingFactory;