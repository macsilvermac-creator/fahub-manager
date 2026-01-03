import React, { useState } from 'react';
import { Plus, MoreHorizontal, Target, Zap, Clock, ShieldCheck } from 'lucide-react';

/**
 * STRATEGY KANBAN - PROTOCOLO NEXUS
 * Módulo de Gestão de Iniciativas Estratégicas (Dark Mode)
 */
const StrategyKanban: React.FC = () => {

  // Estado operacional para simular a dinâmica de colunas
  const [columns, setColumns] = useState([
    { id: 1, title: 'Planejamento', icon: <Target size={16}/>, tasks: ['Campanha de Inverno', 'Novo Protocolo Tackle'] },
    { id: 2, title: 'Em Execução', icon: <Zap size={16}/>, tasks: ['Reforma do CT', 'Venda de Ingressos'] },
    { id: 3, title: 'Concluído', icon: <Clock size={16}/>, tasks: ['Draft 2026'] }
  ]);

  // Função para simular adição de iniciativa
  const handleAddIniciativa = () => {
    const newTask = prompt("Digite o nome da nova iniciativa estratégica:");
    if (newTask) {
      const newCols = [...columns];
      newCols[0].tasks.push(newTask);
      setColumns(newCols);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-20">
      
      {/* HEADER DO MÓDULO */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center p-6 bg-[#0a0f1e]/50 border border-white/5 rounded-[2rem] backdrop-blur-sm">
         <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                 <ShieldCheck size={20} className="text-purple-500" />
              </div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                 Evolução <span className="text-purple-500">Estratégica</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic ml-1">
              Diretrizes & OKRs da Gestão
            </p>
         </div>

         <button 
           onClick={handleAddIniciativa}
           className="mt-4 md:mt-0 flex items-center gap-3 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black italic text-xs uppercase shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all"
         >
           <Plus size={16}/> Nova Iniciativa
         </button>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div key={col.id} className="bg-[#0a0f1e]/40 rounded-[2.5rem] p-6 min-h-[600px] border border-white/5 backdrop-blur-sm">
            
            {/* Título da Coluna */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-3 text-slate-400 font-black uppercase text-[10px] italic tracking-widest">
                <span className={`p-1.5 rounded-lg ${
                    col.id === 1 ? 'bg-indigo-500/10 text-indigo-400' :
                    col.id === 2 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-emerald-500/10 text-emerald-400'
                }`}>
                    {col.icon}
                </span>
                {col.title}
              </div>
              <span className="bg-[#050510] border border-white/10 px-3 py-1 rounded-lg text-[9px] font-black text-slate-500">
                {col.tasks.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {col.tasks.map((task, idx) => (
                <div 
                  key={idx} 
                  onClick={() => alert(`Abrindo detalhes da iniciativa: ${task}`)}
                  className="bg-[#0a0f1e] p-6 rounded-[2rem] border border-white/5 hover:border-purple-500/30 hover:bg-[#1e1b4b]/20 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter italic">
                      Prioridade Master
                    </span>
                    <button className="text-slate-600 group-hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <p className="font-black text-slate-200 italic uppercase text-xs tracking-tight leading-tight relative z-10">
                    {task}
                  </p>
                  
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-[#0a0f1e] flex items-center justify-center text-[7px] font-black text-white">JG</div>
                    </div>
                    <span className="text-[8px] font-black text-slate-600 uppercase italic group-hover:text-purple-400 transition-colors">Update: Hoje</span>
                  </div>

                  {/* Glow Effect no Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
              
              {/* Botão Adicionar Item na Coluna */}
              <button 
                onClick={handleAddIniciativa}
                className="w-full py-4 border-2 border-dashed border-white/5 rounded-[2rem] text-slate-600 text-[10px] font-black uppercase italic hover:bg-white/5 hover:border-white/20 hover:text-slate-300 transition-all mt-4"
              >
                + Adicionar Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrategyKanban;