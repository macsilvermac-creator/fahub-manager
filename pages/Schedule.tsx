
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Game, PracticeSession, UserRole } from '../types';
import { 
    ClockIcon, ChevronDownIcon, ChevronRightIcon, 
    TrophyIcon, WhistleIcon, CalendarIcon, PlusIcon
} from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';

type CalendarView = 'MONTH' | 'WEEK' | 'DAY';

interface CalendarEvent {
    id: string;
    type: 'GAME' | 'PRACTICE' | 'ADMIN' | 'FEDERATION';
    title: string;
    description: string;
    date: Date;
    time: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH';
    teamId: string;
}

const Schedule: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    const [view, setView] = useState<CalendarView>('MONTH');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const load = () => {
            const games = storageService.getGames().map(g => ({
                id: `game-${g.id}`,
                type: 'GAME' as const,
                title: `vs ${g.opponent}`,
                description: `Partida Oficial (${g.location})`,
                date: new Date(g.date),
                time: new Date(g.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                priority: 'HIGH' as const,
                teamId: '1'
            }));

            const practices = storageService.getPracticeSessions().map(p => ({
                id: `prac-${p.id}`,
                type: 'PRACTICE' as const,
                title: p.title,
                description: p.focus,
                date: new Date(p.date),
                time: p.startTime || '19:30',
                priority: 'NORMAL' as const,
                teamId: '1'
            }));

            // Mock de eventos da Federação e Master
            const adminEvents: CalendarEvent[] = [
                {
                    id: 'adm-1',
                    type: 'FEDERATION',
                    title: 'Prazo Limite Inscrição BID',
                    description: 'Data final para inscrição de novos atletas no torneio estadual.',
                    date: new Date(2025, 11, 20),
                    time: '23:59',
                    priority: 'HIGH',
                    teamId: '1'
                }
            ];

            setEvents([...games, ...practices, ...adminEvents]);
        };
        load();
    }, []);

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, 1);
        const days = [];
        const firstDayNextMonth = new Date(year, month + 1, 1);
        
        // Padding dias do mês anterior
        const startPadding = date.getDay();
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        while (date < firstDayNextMonth) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentDate]);

    const getEventsForDay = (date: Date) => {
        return events.filter(e => e.date.toDateString() === date.toDateString());
    };

    const renderMonthView = () => (
        <div className="grid grid-cols-7 h-full animate-fade-in border-t border-white/5">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(d => (
                <div key={d} className="p-4 text-[10px] font-black text-text-secondary uppercase tracking-widest text-center border-b border-white/5 bg-black/20">{d}</div>
            ))}
            {daysInMonth.map((day, idx) => {
                const dayEvents = day ? getEventsForDay(day) : [];
                const isToday = day?.toDateString() === new Date().toDateString();

                return (
                    <div key={idx} className={`min-h-[140px] border-r border-b border-white/5 p-2 transition-colors hover:bg-white/5 relative ${!day ? 'bg-primary/30' : ''}`}>
                        {day && (
                            <>
                                <span className={`text-xs font-black mb-2 block ${isToday ? 'bg-highlight text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-text-secondary'}`}>
                                    {day.getDate()}
                                </span>
                                <div className="space-y-1 overflow-y-auto max-h-[100px] no-scrollbar">
                                    {dayEvents.map(e => (
                                        <div key={e.id} className={`p-1.5 rounded-lg text-[9px] font-black uppercase truncate border-l-4 ${
                                            e.type === 'GAME' ? 'bg-red-500/10 border-red-500 text-red-300' :
                                            e.type === 'FEDERATION' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-300' :
                                            'bg-highlight/10 border-highlight text-highlight'
                                        }`}>
                                            <span className="opacity-60 mr-1">{e.time}</span> {e.title}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );

    const renderWeekView = () => (
        <div className="flex-1 flex flex-col gap-4 p-6 animate-fade-in">
            {daysInMonth.filter(d => d !== null).slice(0, 7).map((day: Date) => (
                <div key={day.toISOString()} className="bg-secondary/40 rounded-[2rem] border border-white/10 p-6 flex gap-8 items-center group hover:border-highlight transition-all">
                    <div className="text-center w-20 shrink-0">
                        <p className="text-xs font-black text-text-secondary uppercase">{day.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                        <p className="text-4xl font-black text-white italic">{day.getDate()}</p>
                    </div>
                    <div className="flex-1 space-y-3">
                        {getEventsForDay(day).length > 0 ? getEventsForDay(day).map(e => (
                            <div key={e.id} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-[8px] px-2 py-0.5 rounded font-black ${e.type === 'GAME' ? 'bg-red-500' : 'bg-highlight'}`}>{e.type}</span>
                                        <h4 className="text-sm font-black text-white uppercase italic">{e.title}</h4>
                                    </div>
                                    <p className="text-xs text-text-secondary opacity-60">{e.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-mono font-black text-highlight">{e.time}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-[10px] text-text-secondary italic uppercase opacity-20">Nenhum snap planejado para este dia.</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderDayView = () => {
        const todayEvents = getEventsForDay(currentDate);
        return (
            <div className="flex-1 p-8 animate-fade-in flex flex-col gap-6">
                <div className="bg-secondary/60 p-10 rounded-[3rem] border border-highlight/20 shadow-glow relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                         <CalendarIcon className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
                            {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </h2>
                        <div className="flex gap-4">
                            <span className="bg-highlight text-white px-4 py-1.5 rounded-full text-xs font-black uppercase italic tracking-widest">{todayEvents.length} Eventos</span>
                            <span className="bg-white/5 text-text-secondary px-4 py-1.5 rounded-full text-xs font-black uppercase italic tracking-widest border border-white/10">Prontidão Técnica: 100%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {todayEvents.map(e => (
                        <div key={e.id} className="bg-secondary/40 p-8 rounded-[2.5rem] border border-white/5 flex justify-between items-center hover:bg-secondary/60 transition-all">
                             <div className="flex items-center gap-8">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${e.type === 'GAME' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-highlight/10 border-highlight text-highlight'}`}>
                                    {e.type === 'GAME' ? <TrophyIcon className="w-8 h-8" /> : <WhistleIcon className="w-8 h-8" />}
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white uppercase italic tracking-tight">{e.title}</p>
                                    <p className="text-sm text-text-secondary opacity-60 mt-1">{e.description}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] font-black text-text-secondary uppercase mb-1 tracking-[0.4em]">Kickoff Time</p>
                                 <p className="text-4xl font-mono font-black text-white">{e.time}</p>
                             </div>
                        </div>
                    ))}
                    {todayEvents.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-40 opacity-10">
                            <CalendarIcon className="w-32 h-32 mb-4" />
                            <p className="text-2xl font-black uppercase italic">Sem atividades programadas</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col bg-[#0B1120] overflow-hidden">
            {/* Header de Controle */}
            <div className="p-6 bg-secondary/30 backdrop-blur-xl border-b border-white/10 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-6">
                    <div className="bg-highlight/10 p-3 rounded-2xl">
                         <CalendarIcon className="w-8 h-8 text-highlight" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">The Grid</h1>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em]">Mestre de Atividades Temporais</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        {(['MONTH', 'WEEK', 'DAY'] as CalendarView[]).map(v => (
                            <button 
                                key={v} 
                                onClick={() => setView(v)}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${view === v ? 'bg-highlight text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                            >
                                {v === 'MONTH' ? 'Mês' : v === 'WEEK' ? 'Semana' : 'Dia'}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center bg-black/40 px-4 py-2 rounded-xl border border-white/5 gap-4">
                        <button onClick={() => {
                            const newDate = new Date(currentDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setCurrentDate(newDate);
                        }} className="text-text-secondary hover:text-white"><ChevronDownIcon className="w-4 h-4 rotate-90" /></button>
                        <span className="text-xs font-black text-white uppercase italic min-w-[120px] text-center">
                            {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => {
                            const newDate = new Date(currentDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setCurrentDate(newDate);
                        }} className="text-text-secondary hover:text-white"><ChevronRightIcon className="w-4 h-4" /></button>
                    </div>

                    <button className="bg-highlight text-white p-3 rounded-2xl shadow-glow active:scale-95 transition-all">
                        <PlusIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Area de Visualização Principal */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {view === 'MONTH' && renderMonthView()}
                {view === 'WEEK' && renderWeekView()}
                {view === 'DAY' && renderDayView()}
            </div>
        </div>
    );
};

export default Schedule;