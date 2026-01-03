import React, { useState, useEffect } from 'react';
import JulesAgent from '../../lib/Jules';
import { Calendar, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * AGENDA MESTRE - PROTOCOLO NEXUS
 * Módulo Full-Screen integrado ao DashboardLayout
 * Versão Final: Tipagem corrigida e Contexto Jules alinhado.
 */

interface CalendarEvent {
  id: number;
  title: string;
  type: 'TRAINING' | 'GAME' | 'MEETING' | 'EVENT' | 'MARKETING' | 'FINANCE';
  date: number;
  time: string;
  location: string;
  entity: string;
  rsvpStats: { confirmed: number; total: number };
}

const CalendarMaster: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [canCreate, setCanCreate] = useState(false);
  
  // Estado para o "Jules Auditor"
  const [julesWarning, setJulesWarning] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'TRAINING', time: '19:00', location: 'Campo 1' });

  // DEFINIÇÃO DE PERMISSÕES (Quem pode criar?)
  const CREATORS = ['PRESIDENTE', 'VICE_PRES', 'DIRETOR', 'CFO', 'CMO', 'CCO', 'HC', 'COORD_ATQ', 'COORD_DEF', 'COORD_ST'];

  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona') || 'VISITANTE';
    setPersona(savedPersona);
    setCanCreate(CREATORS.includes(savedPersona));
  }, []);

  // Dados Mockados
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, title: 'Treino Full Pads', type: 'TRAINING', date: 2, time: '19:00', location: 'Campo 1', entity: 'Tackle', rsvpStats: { confirmed: 38, total: 55 } },
    { id: 2, title: 'Reunião Orçamentária', type: 'FINANCE', date: 5, time: '14:00', location: 'Sala Zoom', entity: 'Admin', rsvpStats: { confirmed: 3, total: 4 } },
    { id: 3, title: 'Gladiators vs Steamrollers', type: 'GAME', date: 12, time: '10:00', location: 'Estádio Municipal', entity: 'Tackle', rsvpStats: { confirmed: 50, total: 55 } },
    { id: 4, title: 'Ação Social: Doação de Sangue', type: 'MARKETING', date: 20, time: '08:00', location: 'Hemocentro', entity: 'Institucional', rsvpStats: { confirmed: 15, total: 100 } },
  ]);

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // IA JULES: Validação
  useEffect(() => {
    if (isModalOpen) {
      setJulesWarning(null);
      const timer = setTimeout(() => {
        if (selectedDate === 2 && newEvent.time === '19:00') {
          setJulesWarning('Conflito Detectado: O "Campo 1" já está ocupado. Sugiro mudar para 21:00 ou Campo 2.');
        } else if (selectedDate === 13 && newEvent.type === 'TRAINING') {
          setJulesWarning('Alerta de Fisiologia: O elenco teve Jogo ontem. Sugiro "Vídeo/Regenerativo".');
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [newEvent, selectedDate, isModalOpen]);

  const handleDateClick = (day: number) => {
    if (canCreate) {
      setSelectedDate(day);
      setIsModalOpen(true);
      setJulesWarning(null);
      if (persona === 'CMO') setNewEvent({ title: 'ATIVAÇÃO DE MARCA', type: 'MARKETING', time: '10:00', location: 'Shopping' });
      else if (persona === 'CFO') setNewEvent({ title: 'REUNIÃO FINANCEIRA', type: 'FINANCE', time: '14:00', location: 'Escritório' });
      else setNewEvent({ title: 'TREINO TÁTICO', type: 'TRAINING', time: '19:00', location: 'Campo 1' });
    }
  };

  const handleCreateEvent = () => {
    const newId = events.length + 1;
    setEvents([...events, {
      id: newId,
      title: newEvent.title || 'Novo Evento',
      type: newEvent.type as any,
      date: selectedDate!,
      time: newEvent.time,
      location: newEvent.location,
      entity: 'Geral',
      rsvpStats: { confirmed: 0, total: 50 }
    }]);
    setIsModalOpen(false);
  };

  const renderTemplates = () => {
    if (persona === 'CMO' || persona === 'CCO') {
      return (
        <>
          <button onClick={() => setNewEvent({...newEvent, title: 'AÇÃO SOCIAL', type: 'MARKETING'})} className="p-3 rounded-lg border text-sm font-bold bg-pink-600/20 border-pink-500 text-pink-400">🎉 Ação Social</button>
          <button onClick={() => setNewEvent({...newEvent, title: 'EVENTO PATROCINADOR', type: 'MARKETING'})} className="p-3 rounded-lg border text-sm font-bold bg-purple-600/20 border-purple-500 text-purple-400">🤝 Patrocinador</button>
        </>
      );
    } 
    else if (persona === 'PRESIDENTE' || persona === 'DIRETOR' || persona === 'CFO') {
      return (
        <>
          <button onClick={() => setNewEvent({...newEvent, title: 'REUNIÃO DE CONSELHO', type: 'MEETING'})} className="p-3 rounded-lg border text-sm font-bold bg-slate-700 border-slate-500 text-white">⚖️ Conselho</button>
          <button onClick={() => setNewEvent({...newEvent, title: 'ASSEMBLEIA GERAL', type: 'MEETING'})} className="p-3 rounded-lg border text-sm font-bold bg-yellow-600/20 border-yellow-500 text-yellow-400">📢 Assembleia</button>
        </>
      );
    }
    else {
      return (
        <>
          <button onClick={() => setNewEvent({...newEvent, title: 'TREINO TÁTICO', type: 'TRAINING'})} className="p-3 rounded-lg border text-sm font-bold bg-orange-600/20 border-orange-500 text-orange-400">🏈 Treino Tático</button>
          <button onClick={() => setNewEvent({...newEvent, title: 'SESSÃO DE VÍDEO', type: 'MEETING'})} className="p-3 rounded-lg border text-sm font-bold bg-blue-600/20 border-blue-500 text-blue-400">📹 Vídeo / Aula</button>
        </>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 pb-20">
      
      {/* HEADER DE FERRAMENTAS */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center p-6 bg-[#0a0f1e]/50 border border-white/5 rounded-[2rem] backdrop-blur-sm">
         <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                 <Calendar size={20} className="text-orange-500" />
              </div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                 Agenda <span className="text-orange-500">Operacional</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic ml-1">
              {canCreate ? 'Modo Gestão Ativado' : 'Visualização de Cronograma'}
            </p>
         </div>

         <div className="flex gap-3 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0a0f1e] border border-white/10 hover:border-white/30 text-slate-400 hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
               <Filter size={16} /> Filtros
            </button>
            {canCreate && (
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)]"
               >
                  <Plus size={16} /> Novo Evento
               </button>
            )}
         </div>
      </div>

      {/* CONTROLES DE NAVEGAÇÃO */}
      <div className="flex justify-between items-center px-4">
        <button className="p-3 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
           <ChevronLeft size={24} />
        </button>
        <h2 className="text-3xl font-black italic text-white tracking-wider uppercase">
           Janeiro <span className="text-slate-700">2026</span>
        </h2>
        <button className="p-3 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
           <ChevronRight size={24} />
        </button>
      </div>

      {/* GRID DO CALENDÁRIO (RESPONSIVA) */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
          <div key={day} className="text-center text-[10px] font-black text-slate-600 uppercase py-2 tracking-[0.2em]">{day}</div>
        ))}

        {days.map(day => {
          const dayEvents = events.filter(e => e.date === day);
          const isToday = day === 1; // Mock: Dia 1 é "Hoje"

          return (
            <div 
              key={day} 
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[140px] bg-[#0a0f1e]/40 border border-white/5 rounded-2xl p-3
                transition-all duration-300 group relative flex flex-col backdrop-blur-sm
                ${canCreate ? 'cursor-pointer hover:bg-[#0a0f1e] hover:border-orange-500/30 hover:scale-[1.02] hover:shadow-xl' : 'cursor-default'}
                ${isToday ? 'bg-indigo-900/10 border-indigo-500/30 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-black ${isToday ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-300'}`}>{day}</span>
                {canCreate && <Plus size={14} className="opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity" />}
              </div>
              
              <div className="space-y-2 flex-1">
                {dayEvents.map(ev => {
                  const percent = ev.rsvpStats.total > 0 ? Math.round((ev.rsvpStats.confirmed / ev.rsvpStats.total) * 100) : 0;
                  
                  return (
                    <div key={ev.id} className={`
                      bg-[#050510] rounded-lg p-2 border-l-2 transition-all hover:translate-x-1
                      ${ev.type === 'MARKETING' ? 'border-pink-500' : ev.type === 'FINANCE' ? 'border-emerald-500' : 'border-orange-500'}
                    `}>
                      <p className="text-[9px] font-bold text-slate-300 truncate leading-tight mb-1">{ev.time} {ev.title}</p>
                      
                      {/* Barra de RSVP */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${percent > 70 ? 'bg-emerald-500' : percent > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-[8px] font-mono text-slate-500">{ev.rsvpStats.confirmed}/{ev.rsvpStats.total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DE CRIAÇÃO (MANTIDO E INTEGRADO AO TEMA) */}
      {isModalOpen && canCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#0a0f1e] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050510]">
              <h3 className="text-xl font-black text-white flex items-center gap-2 italic uppercase tracking-tighter">
                <span className="text-orange-500">⚡</span> Novo Evento
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white text-xl font-bold">✕</button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">Sugestões Rápidas</label>
                <div className="grid grid-cols-2 gap-3">
                  {renderTemplates()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Horário</label>
                  <input 
                    type="time" 
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-[#050510] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Local</label>
                  <input 
                    type="text" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full bg-[#050510] border border-white/10 rounded-xl p-3 text-white focus:border-orange-500/50 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* JULES AUDITOR */}
              <div className={`p-4 rounded-xl border transition-all duration-500 ${julesWarning ? 'bg-yellow-900/10 border-yellow-500/30' : 'bg-[#050510] border-white/5'}`}>
                <div className="flex gap-3">
                  <div className="mt-1">
                    {julesWarning ? <span className="text-xl animate-bounce">⚠️</span> : <span className="text-xl grayscale opacity-50">🤖</span>}
                  </div>
                  <div>
                    <h4 className={`text-[10px] font-black uppercase mb-1 ${julesWarning ? 'text-yellow-500' : 'text-slate-500'}`}>
                      {julesWarning ? 'Jules: Alerta de Conflito' : 'Jules: Validando Agenda...'}
                    </h4>
                    <p className={`text-xs leading-relaxed ${julesWarning ? 'text-yellow-200' : 'text-slate-400'}`}>
                      {julesWarning || "Verificando disponibilidade de local e conflitos..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition uppercase text-xs tracking-widest">Cancelar</button>
                <button onClick={handleCreateEvent} className={`flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 transition
                    ${julesWarning ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}
                  `}>
                  {julesWarning ? 'Ignorar e Criar' : 'Confirmar Evento'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AGORA SIM: CONTEXTO CORRETO */}
      <JulesAgent context="CALENDAR" /> 
    </div>
  );
};

export default CalendarMaster;