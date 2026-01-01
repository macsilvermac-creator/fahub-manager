import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CalendarMaster: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'semana' | 'dia'>('semana');

  // Engate para dados reais futuramente
  const events = [
    { id: 1, time: '19:30', title: 'Treino de Campo', category: 'Técnico', status: 'pendente' },
    { id: 2, time: '21:00', title: 'Reunião Diretoria', category: 'Admin', status: 'confirmado' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HUD de Navegação Superior */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 flex items-center justify-between shadow-2xl">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-400 transition-all">
          <ArrowLeft size={16} /> Voltar
        </button>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setView('semana')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'semana' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setView('dia')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'dia' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Dia
          </button>
        </div>
        <button className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20"><Plus size={20} /></button>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
        {/* Seletor de Data Central */}
        <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><ChevronLeft size={24} /></button>
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">Janeiro 2026</h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1 italic">Segunda-feira, 01 de Jan</p>
          </div>
          <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 transition-all"><ChevronRight size={24} /></button>
        </div>

        {/* Lista de Atividades com Engate para Confirmação */}
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-blue-900/10 transition-all group">
              <div className="flex items-center gap-8">
                <div className="text-center min-w-[80px]">
                  <p className="text-3xl font-black text-slate-900 italic leading-none tracking-tighter">{event.time}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Horário</p>
                </div>
                <div className="w-[2px] h-12 bg-slate-100 hidden md:block" />
                <div>
                  <h4 className="text-xl font-black text-slate-800 italic uppercase leading-tight group-hover:text-blue-600 transition-colors">{event.title}</h4>
                  <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest mt-2 inline-block italic">{event.category}</span>
                </div>
              </div>

              {/* Engates Funcionais: Confirmar / Justificar */}
              <div className="flex items-center gap-4 border-t md:border-t-0 pt-6 md:pt-0 border-slate-50">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">
                  <CheckCircle size={16} /> Confirmar
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all">
                  <XCircle size={16} /> Justificar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CalendarMaster;