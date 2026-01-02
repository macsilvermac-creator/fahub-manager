import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sparkles, Send, Archive, 
  Users, Clock, Trash2, Search, User, 
  ChevronRight
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * BILLING FACTORY - PROTOCOLO NEXUS
 * Geração de Lotes com Seleção Granular de Destinatários.
 */

const BillingFactory: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetType, setTargetType] = useState<'GROUP' | 'INDIVIDUAL'>('GROUP');

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
          <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center shadow-blue-500/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-500">Billing Factory</h2>
        </div>
        <nav className="flex-1 px-4">
          <button 
            onClick={() => navigate('/financeiro')} 
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-white font-black italic text-xs uppercase border border-white/5 hover:bg-white/10 transition-all shadow-sm"
          >
            <ArrowLeft size={18} /> Dashboard Master
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="p-8 border-b border-white/5 bg-[#0a0f1e]/50 backdrop-blur-md">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Billing <span className="text-blue-500">Factory</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1">Módulo de Segmentação e Geração de Ativos</p>
        </header>

        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-hidden">
          
          {/* CONTAINER 1: O GERADOR (INPUT) */}
          <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">1. Configuração do Destinatário</h3>
            </div>
            
            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar font-sans">
              
              {/* SELETOR DE MODO DE ENVIO */}
              <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
                <button 
                  onClick={() => setTargetType('GROUP')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${targetType === 'GROUP' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  <Users size={14} /> Lotes / Grupos
                </button>
                <button 
                  onClick={() => setTargetType('INDIVIDUAL')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${targetType === 'INDIVIDUAL' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                >
                  <User size={14} /> Individual
                </button>
              </div>

              {/* OPÇÕES DINÂMICAS */}
              {targetType === 'GROUP' ? (
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-slate-600 ml-1 italic">Selecionar Segmentação</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Todos Atletas Tackle', 'Todos Atletas Flag', 'Comissão Técnica', 'Diretoria Executiva'].map((label) => (
                      <button key={label} className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-left text-[10px] font-bold uppercase hover:border-blue-500/30 transition-all flex justify-between items-center group italic">
                        {label}
                        <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-500" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase text-slate-600 ml-1 italic">Localizar Membro</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Nome, CPF ou Registro..." 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-xs font-bold outline-none focus:border-blue-500 transition-all italic text-white"
                    />
                  </div>
                </div>
              )}

              {/* DADOS FINANCEIROS */}
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 ml-1 italic">Valor Unitário</label>
                    <input type="text" placeholder="R$ 150,00" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold outline-none focus:border-blue-500 transition-colors text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-500 ml-1 italic">Vencimento</label>
                    <input type="text" placeholder="10/01/2026" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-bold outline-none focus:border-blue-500 transition-colors text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.02]">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black italic uppercase tracking-widest text-xs transition-all shadow-lg shadow-blue-500/20"
              >
                {isGenerating ? 'Gerando Ativos...' : 'Gerar e Arquivar'}
              </button>
            </div>
          </div>

          {/* CONTAINER 2: ARQUIVO E ENVIO (OUTPUT) */}
          <div className="bg-[#0f172a] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic font-sans">2. Fila de Distribuição</h3>
              <Archive size={16} className="text-slate-500" />
            </div>

            <div className="p-6 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 group hover:border-blue-500/50 transition-all relative overflow-hidden italic">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-tight text-white">{draft.target}</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">{draft.type} • {draft.qty} Membros</p>
                    </div>
                    <p className="text-xl font-black text-blue-400 leading-none">{draft.value}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[9px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10">
                      <Send size={14} /> Disparar Lote
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-slate-600 hover:text-red-500 border border-white/5 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center opacity-30">
                <Clock size={32} className="mb-2" />
                <p className="text-[8px] font-black uppercase tracking-widest italic">Fila de saída vazia</p>
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