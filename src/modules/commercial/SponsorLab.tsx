import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Beaker, Send, Library, 
  Sparkles, ChevronRight
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * SPONSOR LAB - PROTOCOLO FAHUB
 * Estação de Inteligência Comercial e Prospecção por IA.
 */

const SponsorLab: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden italic">
      
      <aside className="w-20 bg-[#0a0f1e] border-r border-white/5 flex flex-col items-center py-8 shrink-0">
        <button onClick={() => navigate('/comercial')} className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all mb-8 shadow-sm">
          <ArrowLeft size={24} />
        </button>
        <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
          <Beaker size={24} />
        </div>
      </aside>

      <main className="flex-1 flex gap-4 p-4">
        
        {/* ZONA 1 & 2: PROMPT E ANÁLISE */}
        <div className="flex-[2] flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
              <Sparkles size={12} /> Prospector Agent Online
            </div>
            
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
               <Beaker size={64} className="mb-6 text-blue-500" />
               <h3 className="text-xl font-black uppercase tracking-tighter italic">Sponsor Lab Ready</h3>
               <p className="max-w-xs text-[10px] font-bold uppercase text-slate-500 tracking-widest mt-2 leading-relaxed">
                 Interrogue o sistema para descobrir oportunidades de patrocínio ou analisar o comportamento de sócios.
               </p>
            </div>
          </div>

          <div className="h-40 bg-[#0f172a] border border-blue-500/30 rounded-[2.5rem] p-6 flex items-center gap-4 shadow-2xl shadow-blue-900/10">
            <div className="flex-1 relative font-sans">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Sugira 5 empresas de tecnologia em Joinville para a Cota Prata..."
                className="w-full bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-600 italic pr-12 text-white"
              />
              <div className="absolute top-[-40px] left-0 flex gap-2">
                 <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase hover:bg-white/10 transition-all">Cotas de Venda</button>
                 <button className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase hover:bg-white/10 transition-all">Empresas Locais</button>
              </div>
            </div>
            <button className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
              <Send size={28} />
            </button>
          </div>
        </div>

        {/* ZONA 3: BIBLIOTECA (MEMÓRIA) */}
        <div className="flex-1 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
             <Library size={18} className="text-blue-500" />
             <h3 className="text-[10px] font-black uppercase tracking-widest italic">Intelligence Library</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             {[1, 2, 3].map((i) => (
               <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-blue-500/30 cursor-pointer transition-all group italic">
                  <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Consulta #00{i}</p>
                  <p className="text-[10px] font-black uppercase text-white group-hover:text-blue-400">Análise de ROI: Mercado Têxtil</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[8px] text-slate-600 font-bold">12/01/2026</span>
                    <ChevronRight size={12} className="text-slate-600" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </main>

      <JulesAgent context="DASHBOARD" />
    </div>
  );
};

export default SponsorLab;