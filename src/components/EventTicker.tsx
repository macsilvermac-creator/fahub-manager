import React, { useState, useEffect } from 'react';
import { Zap, Check, HelpCircle, MapPin } from 'lucide-react';

// Protocolo de Tipagem Nexus
interface EventData {
  id: number;
  title: string;
  time: string; 
  date: string; 
  location: string;
  type: 'TRAINING' | 'GAME' | 'MEETING';
  status: 'PENDING' | 'CONFIRMED' | 'JUSTIFIED';
}

const EventTicker: React.FC = () => {
  const [event, setEvent] = useState<EventData | null>(null);

  useEffect(() => {
    // Simulação de carregamento - Conectará ao Supabase via 'fetch' futuramente
    const timer = setTimeout(() => {
      setEvent({
        id: 101,
        title: 'TREINO TÁTICO: DEFESA & SPECIAL TEAMS',
        date: 'HOJE',
        time: '19:30',
        location: 'Campo 2 (CT Gladiators)',
        type: 'TRAINING',
        status: 'PENDING'
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (action: 'CONFIRM' | 'JUSTIFY') => {
    if (!event) return;
    
    if (action === 'JUSTIFY') {
      alert("Nexus Protocol: Abrir interface de anexo para justificativa.");
      setEvent({ ...event, status: 'JUSTIFIED' });
    } else {
      setEvent({ ...event, status: 'CONFIRMED' });
    }
  };

  if (!event) return null;

  // Lógica de Cores Nexus (Sincronizada com DashboardMaster)
  const getStatusStyles = () => {
    if (event.status === 'CONFIRMED') return 'bg-emerald-600 shadow-emerald-900/20';
    if (event.status === 'JUSTIFIED') return 'bg-amber-600 shadow-amber-900/20';
    return 'bg-indigo-600 shadow-indigo-900/20';
  };

  return (
    <div className={`w-full text-white shadow-xl transition-all duration-500 relative z-50 border-b border-white/10 ${getStatusStyles()}`}>
      
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center justify-between">
        
        {/* Lado Esquerdo: Identidade do Evento */}
        <div className="flex items-center gap-5 overflow-hidden">
          <div className="flex flex-col items-center leading-none bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 shadow-inner">
            <span className="font-black text-[10px] tracking-[0.2em] mb-1">{event.date}</span>
            <span className="font-black text-lg italic tracking-tighter">{event.time}</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Zap size={14} className={event.status === 'PENDING' ? 'animate-pulse text-yellow-300' : 'text-white'} />
              <h2 className="font-black italic uppercase tracking-tight text-sm md:text-base truncate">
                {event.title}
              </h2>
            </div>
            <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest flex items-center gap-1 mt-0.5">
              <MapPin size={10} /> {event.location}
            </span>
          </div>
        </div>

        {/* Lado Direito: Ações Operacionais (RSVP) */}
        <div className="flex items-center gap-3">
          
          {event.status === 'PENDING' && (
            <>
              <button 
                onClick={() => handleAction('CONFIRM')}
                className="bg-white text-indigo-900 font-black text-[10px] md:text-xs px-5 py-2 rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                <Check size={14} />
                <span className="hidden md:inline">Confirmar</span>
              </button>

              <button 
                onClick={() => handleAction('JUSTIFY')}
                className="bg-black/20 hover:bg-black/40 text-white font-black text-[10px] md:text-xs px-5 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
                <HelpCircle size={14} />
                <span className="hidden md:inline">Justificar</span>
              </button>
            </>
          )}

          {event.status === 'CONFIRMED' && (
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm animate-in zoom-in duration-300">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="font-black text-[10px] uppercase tracking-widest italic">Presença Confirmada</span>
            </div>
          )}

          {event.status === 'JUSTIFIED' && (
            <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/10">
              <HelpCircle size={14} className="text-amber-300" />
              <span className="font-black text-[10px] uppercase tracking-widest italic">Aguardando Atestado</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventTicker;