import React from 'react';
import { ArrowLeft, Kanban, Plus, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StrategyKanban: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 flex items-center justify-between shadow-2xl">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-400 transition-all"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-2">
          <Target size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-300">Evolução Estratégica</span>
        </div>
        <button className="bg-orange-600 p-2 rounded-xl shadow-lg"><Plus size={18} /></button>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-10">
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl flex items-center gap-8 relative overflow-hidden">
          <Kanban size={200} className="absolute -right-10 -bottom-10 opacity-[0.02]" />
          <div className="w-20 h-20 rounded-[1.5rem] bg-orange-100 text-orange-600 flex items-center justify-center">
            <Target size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Gestão de OKRs</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3 italic">Planejamento 2026</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StrategyKanban;