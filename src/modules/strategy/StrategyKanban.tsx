import React from 'react';
import { ArrowLeft, Plus, MoreHorizontal, Target, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StrategyKanban: React.FC = () => {
  const navigate = useNavigate();

  const columns = [
    { title: 'Planejamento', icon: <Target size={16}/>, tasks: ['Campanha de Inverno', 'Novo Protocolo Tackle'] },
    { title: 'Em Execução', icon: <Zap size={16}/>, tasks: ['Reforma do CT', 'Venda de Ingressos'] },
    { title: 'Concluído', icon: <Clock size={16}/>, tasks: ['Draft 2026'] }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      <nav className="bg-white p-6 flex items-center justify-between shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all outline-none">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Evolução <span className="text-emerald-500">Estratégica</span></h1>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
          <Plus size={16}/> Nova Iniciativa
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((col, i) => (
          <div key={i} className="bg-slate-200/50 rounded-[2.5rem] p-6 min-h-[700px]">
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-2 text-slate-600 font-black uppercase text-[10px] italic tracking-widest">
                {col.icon} {col.title}
              </div>
              <span className="bg-white px-2 py-1 rounded-lg text-[9px] font-black shadow-sm">{col.tasks.length}</span>
            </div>
            <div className="space-y-4">
              {col.tasks.map((task, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-white hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter">Prioridade Alta</span>
                    <MoreHorizontal size={14} className="text-slate-300 group-hover:text-slate-600"/>
                  </div>
                  <p className="font-black text-slate-800 italic uppercase text-xs">{task}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default StrategyKanban;