
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { CoordinatorTask, LeagueRanking, PracticeSession } from '../types';
import Card from '../components/Card';
import { ClockIcon, WhistleIcon, TrophyIcon, UsersIcon, ActivityIcon, CheckCircleIcon } from '../components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const [rankings, setRankings] = useState<LeagueRanking[]>([]);
    const [tasks, setTasks] = useState<CoordinatorTask[]>([]);
    const [practices, setPractices] = useState<PracticeSession[]>([]);

    useEffect(() => {
        storageService.initializeRAM();
        const load = () => {
            setRankings(storageService.getRankings());
            setTasks(storageService.getTasks());
            setPractices(storageService.getPracticeSessions());
        };
        load();
        return storageService.subscribe('storage_update', load);
    }, []);

    // Hoje vs Futuro (Próximos 7 dias)
    const today = new Date();
    const nextPractice = practices[0];

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in pb-10">
            
            {/* 1. TOP TICKER (ESPN STYLE) */}
            <div className="bg-[#0B1120] border-y border-white/5 h-12 flex items-center overflow-hidden shrink-0 no-print">
                <div className="bg-red-600 px-4 h-full flex items-center shrink-0">
                    <span className="text-[10px] font-black text-white italic tracking-tighter">LIVE RANKING</span>
                </div>
                <div className="flex-1 flex gap-8 px-6 overflow-x-auto no-scrollbar animate-marquee whitespace-nowrap">
                    {rankings.map(r => (
                        <div key={r.teamName} className="flex items-center gap-2">
                            <span className="text-highlight font-black italic text-sm">{r.position}º</span>
                            <span className="text-white font-bold text-xs uppercase">{r.teamName}</span>
                            <span className="text-text-secondary text-[10px] font-mono">({r.record})</span>
                        </div>
                    ))}
                    {/* Repeat for continuous scroll effect */}
                    {rankings.map(r => (
                        <div key={`${r.teamName}-rep`} className="flex items-center gap-2">
                            <span className="text-highlight font-black italic text-sm">{r.position}º</span>
                            <span className="text-white font-bold text-xs uppercase">{r.teamName}</span>
                            <span className="text-text-secondary text-[10px] font-mono">({r.record})</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. MAIN WORKSPACE (TODAY VS FUTURE) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                
                {/* CENTER: TODAY'S FOCUS */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <WhistleIcon className="w-48 h-48 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                                <span className="text-xs font-black text-white tracking-[0.4em] uppercase">Status de Campo: HOJE</span>
                            </div>
                            
                            {nextPractice ? (
                                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                                    <div>
                                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{nextPractice.title}</h2>
                                        <p className="text-highlight font-bold text-lg mt-2 uppercase">Foco: {nextPractice.focus}</p>
                                        <div className="flex gap-4 mt-6">
                                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                                                <ClockIcon className="w-4 h-4 text-text-secondary" />
                                                <span className="text-sm font-mono font-bold text-white">19:00</span>
                                            </div>
                                            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                                                <UsersIcon className="w-4 h-4 text-text-secondary" />
                                                <span className="text-sm font-bold text-white">42 Atletas Confirmados</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-highlight hover:bg-highlight-hover text-white px-10 py-5 rounded-2xl font-black uppercase italic text-sm shadow-glow transform active:scale-95 transition-all">
                                        DAR KICKOFF NO TREINO
                                    </button>
                                </div>
                            ) : (
                                <p className="text-text-secondary italic">Nenhuma atividade programada para hoje.</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Recursos Táticos Rápidos">
                             <div className="grid grid-cols-2 gap-4">
                                 <button className="p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-highlight flex flex-col items-center gap-2 transition-all">
                                     <ActivityIcon className="w-8 h-8 text-blue-400" />
                                     <span className="text-[10px] font-black text-white uppercase">Depth Chart</span>
                                 </button>
                                 <button className="p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-highlight flex flex-col items-center gap-2 transition-all">
                                     <TrophyIcon className="w-8 h-8 text-red-500" />
                                     <span className="text-[10px] font-black text-white uppercase">Scouting IA</span>
                                 </button>
                             </div>
                        </Card>
                        <Card title="Prontidão Física">
                             <div className="flex items-center justify-center py-4">
                                 <div className="relative w-24 h-24 flex items-center justify-center">
                                     <svg className="w-full h-full transform -rotate-90">
                                         <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                         <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="6" strokeDasharray="251" strokeDashoffset="50" className="text-highlight" />
                                     </svg>
                                     <span className="absolute text-2xl font-black text-white italic">82%</span>
                                 </div>
                                 <div className="ml-6">
                                     <p className="text-[10px] font-black text-text-secondary uppercase">Elenco Apto</p>
                                     <p className="text-xs text-white mt-1">5 jogadores no DP.</p>
                                 </div>
                             </div>
                        </Card>
                    </div>
                </div>

                {/* RIGHT: THE FUTURE (NEXT 7 DAYS) */}
                <div className="lg:col-span-1">
                    <div className="bg-secondary rounded-[2rem] border border-white/5 flex flex-col h-full overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-white/5 bg-black/20">
                            <h3 className="text-xs font-black text-highlight uppercase tracking-[0.3em] flex items-center gap-2">
                                <ClockIcon className="w-4 h-4"/> THE FUTURE
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                             {[
                                 { day: 'TER', title: 'Treino de Campo', type: 'FIELD' },
                                 { day: 'QUA', title: 'Video: Scout Adversário', type: 'VIDEO' },
                                 { day: 'QUI', title: 'Treino Tático (Walkthrough)', type: 'FIELD' },
                                 { day: 'SÁB', title: 'GAME DAY: vs Timbó Rex', type: 'GAME' },
                             ].map((item, i) => (
                                 <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all flex items-center gap-4 group">
                                     <div className="w-12 h-12 rounded-xl bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/5">
                                         <span className="text-[10px] font-black text-highlight uppercase">{item.day}</span>
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <h4 className="text-xs font-bold text-white uppercase truncate">{item.title}</h4>
                                         <span className="text-[8px] text-text-secondary uppercase tracking-widest">{item.type}</span>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM KANBAN (COORDINATOR COMMAND) */}
            <div className="shrink-0">
                <Card title="Quadro de Comandos (Tasking Coordinators)" titleClassName="border-none !pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                        {['OFFENSE', 'DEFENSE', 'ST'].map(dept => (
                            <div key={dept} className="bg-black/20 rounded-2xl p-4 border border-white/5">
                                <h4 className={`text-[10px] font-black mb-4 uppercase tracking-widest ${dept === 'OFFENSE' ? 'text-blue-400' : dept === 'DEFENSE' ? 'text-red-400' : 'text-yellow-400'}`}>
                                    {dept} COORDINATOR
                                </h4>
                                <div className="space-y-2">
                                    {tasks.filter(t => t.assignedTo === dept).map(task => (
                                        <div key={task.id} className="bg-secondary p-3 rounded-xl border border-white/5 text-xs flex justify-between items-center group">
                                            <div>
                                                <p className="text-white font-bold">{task.title}</p>
                                                <p className="text-[10px] text-text-secondary mt-0.5">{task.description}</p>
                                            </div>
                                            {task.status === 'DONE' ? <CheckCircleIcon className="text-green-500 w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-highlight transition-colors"></div>}
                                        </div>
                                    ))}
                                    <button className="w-full py-2 border border-dashed border-white/10 rounded-xl text-[9px] font-black text-text-secondary uppercase hover:text-white transition-colors">+ Atribuir Missão</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
