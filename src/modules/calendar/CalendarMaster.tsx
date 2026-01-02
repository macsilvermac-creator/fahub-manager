import React, { useState, useEffect } from 'react';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import JulesAgent from '../../lib/Jules';

// Tipos
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [canCreate, setCanCreate] = useState(false);
  
  // Estado para o "Jules Auditor"
  const [julesWarning, setJulesWarning] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', type: 'TRAINING', time: '19:00', location: 'Campo 1' });

  // DEFINIÇÃO DE PERMISSÕES (Quem pode criar?)
  const CREATORS = ['PRESIDENTE', 'VICE_PRES', 'DIRETOR', 'CFO', 'CMO', 'CCO', 'HC', 'COORD_ATQ', 'COORD_DEF', 'COORD_ST'];

  // Carrega Persona e Define Permissões
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
    // Só abre o modal se tiver permissão
    if (canCreate) {
      setSelectedDate(day);
      setIsModalOpen(true);
      setJulesWarning(null);
      // Reseta o form com base na persona (Contexto)
      if (persona === 'CMO') setNewEvent({ title: 'ATIVAÇÃO DE MARCA', type: 'MARKETING', time: '10:00', location: 'Shopping' });
      else if (persona === 'CFO') setNewEvent({ title: 'REUNIÃO FINANCEIRA', type: 'FINANCE', time: '14:00', location: 'Escritório' });
      else setNewEvent({ title: 'TREINO TÁTICO', type: 'TRAINING', time: '19:00', location: 'Campo 1' });
    } else {
      alert("Apenas Gestores e Treinadores podem criar eventos na Agenda Oficial.");
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

  // Renderiza Templates baseados na Persona
  const renderTemplates = () => {
    if (persona === 'CMO' || persona === 'CCO') { // Marketing/Comercial
      return (
        <>
          <button onClick={() => setNewEvent({...newEvent, title: 'AÇÃO SOCIAL', type: 'MARKETING'})} className="p-3 rounded-lg border text-sm font-bold bg-pink-600/20 border-pink-500 text-pink-400">🎉 Ação Social</button>
          <button onClick={() => setNewEvent({...newEvent, title: 'EVENTO PATROCINADOR', type: 'MARKETING'})} className="p-3 rounded-lg border text-sm font-bold bg-purple-600/20 border-purple-500 text-purple-400">🤝 Patrocinador</button>
        </>
      );
    } 
    else if (persona === 'PRESIDENTE' || persona === 'DIRETOR' || persona === 'CFO') { // Diretoria
      return (
        <>
          <button onClick={() => setNewEvent({...newEvent, title: 'REUNIÃO DE CONSELHO', type: 'MEETING'})} className="p-3 rounded-lg border text-sm font-bold bg-slate-700 border-slate-500 text-white">⚖️ Conselho</button>
          <button onClick={() => setNewEvent({...newEvent, title: 'ASSEMBLEIA GERAL', type: 'MEETING'})} className="p-3 rounded-lg border text-sm font-bold bg-yellow-600/20 border-yellow-500 text-yellow-400">📢 Assembleia</button>
        </>
      );
    }
    else { // Treinadores (HC, Coordinators)
      return (
        <>
          <button onClick={() => setNewEvent({...newEvent, title: 'TREINO TÁTICO', type: 'TRAINING'})} className="p-3 rounded-lg border text-sm font-bold bg-orange-600/20 border-orange-500 text-orange-400">🏈 Treino Tático</button>
          <button onClick={() => setNewEvent({...newEvent, title: 'SESSÃO DE VÍDEO', type: 'MEETING'})} className="p-3 rounded-lg border text-sm font-bold bg-blue-600/20 border-blue-500 text-blue-400">📹 Vídeo / Aula</button>
        </>
      );
    }
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 1. NAVEGAÇÃO LATERAL */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER */}
        <header className="p-4 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg">☰</button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-orange-500">📅</span> AGENDA OPERACIONAL
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                {canCreate ? 'Modo Gestão Ativado' : 'Visualização de Cronograma'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-bold bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition">Filtros</button>
            {canCreate && (
              <button className="px-3 py-1.5 text-xs font-bold bg-orange-600 text-white rounded hover:bg-orange-500 transition shadow-lg shadow-orange-500/20">+ Novo Evento</button>
            )}
          </div>
        </header>

        <main className="p-4 max-w-7xl mx-auto w-full pb-24">

          {/* CONTROLES DE MÊS */}
          <div className="flex justify-between items-center mb-6">
            <button className="p-2 hover:bg-white/10 rounded-full">←</button>
            <h2 className="text-2xl font-black italic text-white tracking-wider">JANEIRO <span className="text-slate-600">2026</span></h2>
            <button className="p-2 hover:bg-white/10 rounded-full">→</button>
          </div>

          {/* GRID DO CALENDÁRIO */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-500 uppercase py-2 tracking-widest">{day}</div>
            ))}

            {days.map(day => {
              const dayEvents = events.filter(e => e.date === day);
              const isToday = day === 1;

              return (
                <div 
                  key={day} 
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-[120px] bg-[#1e293b]/30 border border-slate-800 rounded-xl p-2 
                    transition group relative flex flex-col
                    ${canCreate ? 'cursor-pointer hover:bg-[#1e293b]/60 hover:border-orange-500/30' : 'cursor-default'}
                    ${isToday ? 'ring-1 ring-blue-500 bg-blue-900/10' : ''}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-bold ${isToday ? 'text-blue-400' : 'text-slate-500 group-hover:text-white'}`}>{day}</span>
                    {canCreate && <span className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400">+ Criar</span>}
                  </div>
                  
                  {/* Lista de Eventos no Dia */}
                  <div className="mt-2 space-y-1.5 flex-1">
                    {dayEvents.map(ev => {
                      const percent = ev.rsvpStats.total > 0 ? Math.round((ev.rsvpStats.confirmed / ev.rsvpStats.total) * 100) : 0;
                      
                      return (
                        <div key={ev.id} className={`
                          bg-black/40 rounded p-1.5 border-l-2 hover:bg-black/60 transition
                          ${ev.type === 'MARKETING' ? 'border-pink-500' : ev.type === 'FINANCE' ? 'border-green-500' : 'border-orange-500'}
                        `}>
                          <p className="text-[10px] font-bold text-slate-200 truncate leading-none mb-1">{ev.time} {ev.title}</p>
                          <div className="flex items-center gap-1">
                            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full ${percent > 70 ? 'bg-emerald-500' : percent > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percent}%` }} />
                            </div>
                            <span className="text-[8px] font-mono text-slate-400">{ev.rsvpStats.confirmed}/{ev.rsvpStats.total}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* MODAL DE CRIAÇÃO INTELIGENTE */}
        {isModalOpen && canCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
              
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-[#1e293b]/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-orange-500">⚡</span> Novo Evento: {persona}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-xl">✕</button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* TEMPLATES CONTEXTUAIS */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Sugestões para seu Cargo</label>
                  <div className="grid grid-cols-2 gap-2">
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
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Local</label>
                    <input 
                      type="text" 
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                      className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* JULES AUDITOR */}
                <div className={`p-4 rounded-xl border transition-all duration-500 ${julesWarning ? 'bg-yellow-900/20 border-yellow-600/50' : 'bg-slate-800/50 border-slate-700'}`}>
                  <div className="flex gap-3">
                    <div className="mt-1">
                      {julesWarning ? <span className="text-2xl animate-bounce">⚠️</span> : <span className="text-2xl opacity-50 grayscale">🤖</span>}
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold uppercase mb-1 ${julesWarning ? 'text-yellow-400' : 'text-slate-500'}`}>
                        {julesWarning ? 'JULES: ALERTA DE CONFLITO' : 'JULES: VALIDANDO AGENDA...'}
                      </h4>
                      <p className={`text-xs leading-relaxed ${julesWarning ? 'text-yellow-100' : 'text-slate-400'}`}>
                        {julesWarning || "Verificando disponibilidade de local, previsão do tempo e conflitos com outras diretorias..."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 transition">Cancelar</button>
                <button onClick={handleCreateEvent} className={`flex-1 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition
                    ${julesWarning ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}
                  `}>
                  {julesWarning ? 'IGNORAR E CRIAR' : 'CONFIRMAR EVENTO'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* JULES AGENT */}
        <JulesAgent context="DASHBOARD" /> 

      </div>
    </div>
  );
};

export default CalendarMaster;
