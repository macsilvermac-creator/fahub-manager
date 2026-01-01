import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Filter, 
  Calendar as CalendarIcon, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalendarMaster: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState("JANEIRO 2026");

  const events = [
    { time: '09:00', title: 'Treino Técnico - Tackle', ent: 'TACKLE', color: 'border-blue-500 text-blue-600', status: 'confirmado' },
    { time: '14:30', title: 'Reunião de Diretoria', ent: 'ASSOCIAÇÃO', color: 'border-slate-500 text-slate-600', status: 'pendente' },
    { time: '19:00', title: 'Workshop Flag Football', ent: 'FLAG', color: 'border-orange-500 text-orange-600', status: 'confirmado' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <nav className="bg-white p-6 flex items-center justify-between shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/dashboard')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all outline-none">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">Agenda <span className="text-blue-600">Master</span></h1>
        </div>
        <div className="flex items-center gap-4 bg-slate-100 p-2 rounded-2xl">
          <button onClick={() => setCurrentMonth("DEZEMBRO 2025")} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronLeft size={20}/></button>
          <span className="text-[10px] font-black uppercase tracking-widest px-4">{currentMonth}</span>
          <button onClick={() => setCurrentMonth("FEVEREIRO 2026")} className="p-2 hover:bg-white rounded-xl transition-all"><ChevronRight size={20}/></button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="grid grid-cols-7 gap-4 mb-4 text-center">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
              <span key={day} className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 31 }).map((_, i) => (
              <div key={i} className={`h-24 rounded-3xl border flex flex-col p-3 transition-all cursor-pointer hover:border-blue-400 ${i === 0 ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50/50 border-transparent'}`}>
                <span className="text-xs font-black italic">{i + 1}</span>
                {i === 0 && <div className="mt-2 w-2 h-2 rounded-full bg-white animate-pulse" />}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Clock size={16} className="text-blue-400"/> Próximos Eventos
            </h3>
            <div className="space-y-4">
              {events.map((ev, i) => (
                <div key={i} className={`p-4 rounded-2xl border-l-4 bg-white/5 hover:bg-white/10 transition-all cursor-pointer ${ev.color}`}>
                  <p className="text-[10px] font-black opacity-60 uppercase">{ev.time} - {ev.ent}</p>
                  <p className="text-sm font-bold italic mt-1">{ev.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarMaster;