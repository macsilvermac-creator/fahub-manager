import React, { useState, useMemo } from 'react';
import { CalendarIcon, ChevronRightIcon, TrophyIcon, WhistleIcon, ClockIcon } from '@/components/icons/UiIcons';
import PageHeader from '@/components/PageHeader';

type ViewMode = '30DAYS' | 'WEEK' | 'DAY';

const Agenda: React.FC = () => {
    const [viewMode, setViewMode] = useState<ViewMode>('30DAYS');

    const mockEvents = [
        { id: 1, type: 'GAME', title: 'vs Timbó Rex', time: '14:00', date: '2023-12-20', location: 'Estádio Municipal' },
        { id: 2, type: 'PRACTICE', title: 'Treino de Especialistas', time: '19:30', date: '2023-12-18', location: 'CT Gladiators' },
        { id: 3, type: 'EVENT', title: 'Reunião de Diretoria', time: '20:00', date: '2023-12-19', location: 'Google Meet' },
    ];

    return (
        <div className="h-full flex flex-col animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 shrink-0">
                <PageHeader title="Elite Calendar" subtitle="Sincronização temporal de toda a associação." />
                
                <div className="flex bg-secondary p-1 rounded-2xl border border-white/10 shadow-xl">
                    <button 
                        onClick={() => setViewMode('30DAYS')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === '30DAYS' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                    >
                        30 Dias
                    </button>
                    <button 
                        onClick={() => setViewMode('WEEK')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'WEEK' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                    >
                        Semana
                    </button>
                    <button 
                        onClick={() => setViewMode('DAY')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'DAY' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                    >
                        Dia
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-secondary/30 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl">
                {/* CALENDAR GRID */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {viewMode === '30DAYS' && (
                        <div className="grid grid-cols-7 gap-2 h-full min-h-[600px]">
                            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(d => (
                                <div key={d} className="text-center p-4 text-[10px] font-black text-text-secondary uppercase tracking-widest">{d}</div>
                            ))}
                            {Array.from({ length: 35 }).map((_, i) => (
                                <div key={i} className="bg-black/20 rounded-3xl border border-white/5 p-4 min-h-[120px] hover:border-highlight/30 transition-colors group relative overflow-hidden">
                                    <span className="text-xs font-black text-text-secondary/40">{i + 1}</span>
                                    {i === 15 && (
                                        <div className="mt-2 p-2 bg-highlight/20 border border-highlight/30 rounded-xl text-[9px] font-black text-highlight uppercase leading-tight italic">
                                            Game Day!
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'WEEK' && (
                        <div className="space-y-4">
                            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, i) => (
                                <div key={day} className="bg-black/20 rounded-[2rem] p-6 border border-white/5 flex items-center justify-between group hover:bg-black/40 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="text-center w-16">
                                            <p className="text-xs font-black text-text-secondary uppercase">{day.substring(0,3)}</p>
                                            <p className="text-3xl font-black text-white italic">{18 + i}</p>
                                        </div>
                                        <div className="h-10 w-px bg-white/5"></div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black text-white uppercase italic">Treino Técnico #0{i+1}</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-widest flex items-center gap-2">
                                                <ClockIcon className="w-3 h-3"/> 19:30 • CT Gladiators
                                            </p>
                                        </div>
                                    </div>
                                    <button className="bg-highlight/10 hover:bg-highlight text-highlight hover:text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-glow">Confirmar</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'DAY' && (
                        <div className="h-full flex flex-col items-center justify-center space-y-6">
                            <div className="w-24 h-24 bg-highlight/10 rounded-full flex items-center justify-center animate-pulse border border-highlight/20">
                                <WhistleIcon className="w-12 h-12 text-highlight" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">Snap do Dia</h3>
                                <p className="text-text-secondary uppercase tracking-[0.3em] text-xs mt-2">Hoje: 18 de Dezembro</p>
                            </div>
                            <div className="w-full max-w-xl bg-black/40 p-8 rounded-[3rem] border border-white/10 shadow-2xl">
                                <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-highlight uppercase tracking-[0.3em]">Treino Técnico</p>
                                        <h4 className="text-2xl font-black text-white uppercase italic">Instalação de Zone Block</h4>
                                    </div>
                                    <span className="text-2xl font-mono font-bold text-white">19:30</span>
                                </div>
                                <button className="w-full py-4 bg-highlight text-white font-black uppercase italic rounded-2xl shadow-glow">Marcar Presença</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Agenda;