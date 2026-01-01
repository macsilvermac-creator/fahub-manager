import React, { useState } from 'react';
import { ArrowLeft, Plus, MoreHorizontal, Target, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Evolução Estratégica Operacional - Protocolo FAHUB
 * Ativação de lógica Kanban sem alteração de um único pixel visual.
 */
const StrategyKanban: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      {/* Header HUD Operacional - Mantendo Estética Master */}
      <nav className="bg-white p-6 flex items-center justify-between shadow-sm mb-8 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all outline-none active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
            Evolução <span className="text-emerald-500">Estratégica</span>
          </h1>
        </div>
        <button 
          onClick={handleAddIniciativa}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg hover:bg-slate-800 active:scale-95 transition-all outline-none"
        >
          <Plus size={16}/> Nova Iniciativa
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((col) => (
          <div key={col.id} className="bg-slate-200/40 rounded-[2.5rem] p-6 min-h-[700px] border border-slate-200/50">
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-2 text-slate-500 font-black uppercase text-[10px] italic tracking-widest">
                <span className="text-emerald-500">{col.icon}</span>
                {col.title}
              </div>
              <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black shadow-sm text-slate-600">
                {col.tasks.length}
              </span>
            </div>
            
            <div className="space-y-4">
              {col.tasks.map((task, idx) => (
                <div 
                  key={idx} 
                  onClick={() => alert(`Abrindo detalhes da iniciativa: ${task}`)}
                  className="bg-white p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-md hover:border-emerald-500/20 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter italic">
                      Prioridade Master
                    </span>
                    <button className="text-slate-300 group-hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <p className="font-black text-slate-800 italic uppercase text-xs tracking-tight leading-tight">
                    {task}
                  </p>
                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-[7px] font-black text-white">JG</div>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase italic">Update: Hoje</span>
                  </div>
                </div>
              ))}
              
              {/* Slot Vazio Operacional para Visualização */}
              <button 
                onClick={handleAddIniciativa}
                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-400 text-[10px] font-black uppercase italic hover:bg-slate-50 hover:border-slate-400 transition-all mt-4"
              >
                + Adicionar Item
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default StrategyKanban;