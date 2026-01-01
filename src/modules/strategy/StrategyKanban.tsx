import React from 'react';
import { ArrowLeft, Kanban, Plus, Target, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StrategyKanban: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HUD Superior Master - Conexão de Retorno Ativada sem Alteração Estética */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 flex items-center justify-between shadow-2xl">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-400 transition-all outline-none"
        >
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-2">
          <Target size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-300">Evolução Estratégica</span>
        </div>
        <button className="bg-orange-600 p-2 rounded-xl shadow-lg shadow-orange-900/20 hover:bg-orange-500 transition-all">
          <Plus size={20} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-10">
        <header>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
            Planejamento <span className="text-orange-600">Estratégico</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-4 italic">
            Joinville Gladiators / Gestão de OKRs 2026
          </p>
        </header>

        {/* Card Master de OKR - Visual Denso Restaurado */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl">
          <Kanban size={400} strokeWidth={1} className="absolute -right-20 -bottom-20 opacity-[0.03] text-white group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="flex-1">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-4 italic">Objetivo Principal do Ciclo</p>
              <h2 className="text-5xl font-black italic tracking-tighter leading-tight uppercase">Expansão de Unidades & Base</h2>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-orange-600 flex items-center justify-center text-[10px] font-black">JG</div>
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Equipe Master Responsável</span>
              </div>
            </div>
            
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-xl min-w-[320px] text-center">
              <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle cx="64" cy="64" r="58" fill="none" stroke="#f97316" strokeWidth="10" strokeDasharray="364.4" strokeDashoffset="145.7" />
                </svg>
                <span className="absolute text-2xl font-black italic">60%</span>
              </div>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Progresso Geral</p>
            </div>
          </div>
        </div>

        {/* Quadro Kanban de Status - Robustez Visual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "A Fazer", icon: Clock, color: "text-slate-400", bg: "bg-slate-50", count: 4 },
            { label: "Em Progresso", icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50", count: 2 },
            { label: "Concluído", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", count: 12 }
          ].map((col, idx) => (
            <div key={idx} className={`${col.bg} rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <col.icon className={col.color} size={20} />
                  <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">{col.label}</h3>
                </div>
                <span className="text-[10px] font-black bg-white px-3 py-1 rounded-lg shadow-sm">{col.count}</span>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-[11px] font-black text-slate-700 italic uppercase">Revisão Contratos Base</p>
                  <div className="mt-4 h-1 w-12 bg-orange-500 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StrategyKanban;