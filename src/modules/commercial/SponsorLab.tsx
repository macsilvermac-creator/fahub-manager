import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Beaker, Send, Library, 
  Sparkles, ChevronRight, Database, Target
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

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
        
        {/* ZONA 1 & 2: INTERROGAÇÃO E PROCESSAMENTO */}
        <div className="flex-[2] flex flex-col gap-4 overflow-hidden">
          
          {/* ZONA DE PROCESSAMENTO (CARDS DE VIABILIDADE) */}
          <div className="flex-1 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] p-8 overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest">
              <Sparkles size={12} /> Agente Prospector Online
            </div>
            
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
               <Target size={48} className="mb-4 text-blue-500" />
               <h3 className="text-xl font-black uppercase tracking-tighter">Zona de Processamento</h3>
               <p className="max-w-xs text-[10px] font-bold uppercase text-slate-500 tracking-widest mt-2">
                 Aguardando entrada para análise profunda de ROI e conexões de marca.
               </p>
            </div>
          </div>

          {/* ZONA DE INTERROGAÇÃO (MÁQUINA DE PROMPTS + NÓDULOS) */}
          <div className="h-44 bg-[#0f172a] border border-blue-500/30 rounded-[2.5rem] p-6 flex flex-col justify-center relative shadow-2xl">
            <div className="flex gap-2 mb-4">
               <button className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/40 rounded-full text-[8px] font-black uppercase text-blue-400"><Database size={10}/> Cota Prata</button>
               <button className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase text-slate-400 hover:bg-white/10 transition-all cursor-move"><Database size={10}/> Tech Joinville</button>
            </div>
            <div className="flex items-center gap-4">
              <input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Arraste os nódulos ou provoque o sistema aqui..."
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-600 italic text-white"
              />
              <button className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
                <Send size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* ZONA 3: BIBLIOTECA (MEMÓRIA) */}
        <div className="flex-1 bg-[#0a0f1e] border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
             <Library size={18} className="text-blue-500" />
             <h3 className="text-[10px] font-black uppercase tracking-widest">Biblioteca de Inteligência</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
             <div className="p-4 bg-white/5 border border-blue-500/20 rounded-2xl italic group cursor-pointer">
                <p className="text-[8px] text-slate-500 font-bold uppercase mb-1">Há 3 meses</p>
                <p className="text-[10px] font-black uppercase text-white group-hover:text-blue-400 transition-colors">Análise: Mercado Têxtil</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest tracking-widest uppercase italic">Histórico Ativo</span>
                  <ChevronRight size={12} className="text-slate-600" />
                </div>
             </div>
          </div>
        </div>
      </main>

      <JulesAgent context="DASHBOARD" />
    </div>
  );
};

export default SponsorLab;