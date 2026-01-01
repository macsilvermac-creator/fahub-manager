import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * CalendarMaster - Peça LEGO Operacional
 * Interface de Agenda com navegação de meses e eventos integrada.
 */
const CalendarMaster: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState("JANEIRO 2026");

  // Dados para validação visual e operacional
  const events = [
    { time: '09:00', title: 'Treino Técnico - Tackle', ent: 'TACKLE', color: 'border-blue-500 text-blue-600' },
    { time: '14:30', title: 'Reunião de Diretoria', ent: 'ASSOCIAÇÃO', color: 'border-slate-500 text-slate-600' },
    { time: '19:00', title: 'Workshop Flag Football', ent: 'FLAG', color: 'border-orange-500 text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header HUD */}
      <nav className="bg-white p-6 flex items-center justify-between shadow-sm mb-8 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
            Agenda <span className="text-blue-600">Master</span>
          </h1>
        </div>
        
        {/* Controle de Navegação Temporal */}
        <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setCurrentMonth("DEZEMBRO 2025")} 
            className="p-2 bg-white rounded-xl shadow-sm hover:text-blue-600 transition-all outline-none"
          >
            <ChevronLeft size={20}/>
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest px-6 italic text-slate-700">{currentMonth}</span>
          <button 
            onClick={() => setCurrentMonth("FEVEREIRO 2026")} 
            className="p-2 bg-white rounded-xl shadow-sm hover:text-blue-600 transition-all outline-none"
          >
            <ChevronRight size={20}/>
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid de Calendário */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="grid grid-cols-7 gap-4 mb-8 text-center border-b border-slate-50 pb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <span key={day} className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 31 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-24 rounded-3xl border flex flex-col p-4 transition-all cursor-pointer hover:border-blue-400 ${i === 0 ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-105 z-10' : 'bg-slate-50/50 border-transparent text-slate-400'}`}
              >
                <span className="text-sm font-black italic">{i + 1}</span>
                {i === 0 && (
                  <div className="mt-auto flex justify-between items-center">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Hoje</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Painel de Eventos HUD */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <Clock size={200} className="absolute -right-10 -bottom-10 opacity-[0.03] text-white group-hover:scale-110 transition-transform duration-1000" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2 relative z-10">
              <Clock size={16} className="text-blue-400"/> Próximos Eventos
            </h3>
            <div className="space-y-4 relative z-10">
              {events.map((ev, i) => (
                <div 
                  key={i} 
                  className={`p-6 rounded-[2rem] border-l-4 bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/item ${ev.color}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">{ev.time}</p>
                    <span className="text-[8px] font-black uppercase bg-white/10 px-2 py-1 rounded-md">{ev.ent}</span>
                  </div>
                  <p className="text-sm font-bold italic uppercase leading-tight group-hover/item:text-white transition-colors">{ev.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/10">
             <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80 italic text-blue-100">Insight Agenda</p>
             <p className="text-sm font-bold italic leading-tight text-white">
               Você tem 12 compromissos confirmados para esta semana. 2 reuniões aguardam justificativa.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarMaster;