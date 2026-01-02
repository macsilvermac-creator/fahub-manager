import React, { useState, useEffect } from 'react';

// Tipos para o Evento
interface EventData {
  id: number;
  title: string;
  time: string; // Ex: '19:00'
  date: string; // Ex: 'HOJE'
  location: string;
  type: 'TRAINING' | 'GAME' | 'MEETING';
  status: 'PENDING' | 'CONFIRMED' | 'JUSTIFIED';
}

const EventTicker: React.FC = () => {
  // Estado simulando dados do banco
  const [event, setEvent] = useState<EventData | null>(null);

  // Simula o carregamento do "Próximo Evento"
  useEffect(() => {
    // AQUI CONECTAREMOS O SUPABASE FUTURAMENTE
    // Buscando: O evento mais próximo >= Agora para a persona logada
    setTimeout(() => {
      setEvent({
        id: 101,
        title: 'TREINO TÁTICO: DEFESA & SPECIAL TEAMS',
        date: 'HOJE',
        time: '19:30',
        location: 'Campo 2 (CT Gladiators)',
        type: 'TRAINING',
        status: 'PENDING' // Usuário ainda não respondeu
      });
    }, 500);
  }, []);

  const handleAction = (action: 'CONFIRM' | 'JUSTIFY') => {
    if (!event) return;
    
    if (action === 'JUSTIFY') {
      // Futuramente aqui abriremos o Modal
      alert("Abrir câmera/galeria para anexar atestado.");
      setEvent({ ...event, status: 'JUSTIFIED' });
    } else {
      setEvent({ ...event, status: 'CONFIRMED' });
    }
  };

  if (!event) return null; // Não mostra nada se não tiver evento próximo

  // Cores baseadas no status
  const getStatusColor = () => {
    if (event.status === 'CONFIRMED') return 'bg-emerald-600';
    if (event.status === 'JUSTIFIED') return 'bg-yellow-600';
    return 'bg-blue-600'; // Padrão (Pendente)
  };

  return (
    <div className={`w-full text-white shadow-lg transition-all duration-300 relative z-50 ${getStatusColor()}`}>
      
      {/* BARRA PRINCIPAL (Sempre visível) */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs md:text-sm">
        
        {/* Esquerda: Informações do Evento */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex flex-col items-center leading-tight bg-black/20 px-2 py-1 rounded">
            <span className="font-black text-[10px] md:text-xs tracking-wider">{event.date}</span>
            <span className="font-bold text-sm md:text-lg">{event.time}</span>
          </div>
          
          <div className="flex flex-col truncate">
            <span className="font-black uppercase tracking-wide truncate">{event.title}</span>
            <span className="text-[10px] opacity-90 truncate flex items-center gap-1">
              📍 {event.location}
            </span>
          </div>
        </div>

        {/* Direita: Ações (RSVP) */}
        <div className="flex items-center gap-2 pl-2">
          
          {event.status === 'PENDING' && (
            <>
              {/* Botão Confirmar */}
              <button 
                onClick={() => handleAction('CONFIRM')}
                className="bg-white text-blue-900 font-bold px-3 py-1.5 rounded shadow hover:bg-blue-50 transition flex items-center gap-1"
              >
                <span className="hidden md:inline">CONFIRMAR</span>
                <span className="md:hidden">✓</span>
              </button>

              {/* Botão Justificar */}
              <button 
                onClick={() => handleAction('JUSTIFY')}
                className="bg-black/20 hover:bg-black/30 text-white font-bold px-3 py-1.5 rounded border border-white/20 transition"
              >
                <span className="hidden md:inline">JUSTIFICAR</span>
                <span className="md:hidden">?</span>
              </button>
            </>
          )}

          {event.status === 'CONFIRMED' && (
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded border border-white/20 animate-pulse">
              <span>✅</span>
              <span className="font-bold">PRESENÇA CONFIRMADA</span>
            </div>
          )}

          {event.status === 'JUSTIFIED' && (
            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded border border-white/20">
              <span>⚠️</span>
              <span className="font-bold">JUSTIFICADO</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EventTicker;