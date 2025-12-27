
import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../../components/PageHeader';
import { ActivityIcon, SparklesIcon, TrophyIcon, UsersIcon, ChevronDownIcon, ClockIcon } from '../../components/icons/UiIcons';
import { storageService } from '../../services/storageService';

const SidelineLab: React.FC = () => {
    const [view, setView] = useState<'OFFENSE' | 'DEFENSE'>('OFFENSE');
    const [program, setProgram] = useState<'TACKLE' | 'FLAG'>('TACKLE');

    useEffect(() => {
        const activeProgram = storageService.getActiveProgram() as 'TACKLE' | 'FLAG';
        setProgram(activeProgram);
    }, []);

    const stats = useMemo(() => ({
        TACKLE: {
            OFFENSE: [
                { label: '3rd Down Eff', value: '42%', trend: 'UP', color: 'text-green-400' },
                { label: 'Redzone TD%', value: '68%', trend: 'DOWN', color: 'text-red-400' },
                { label: 'Pocket Protect', value: '3.4s', trend: 'STABLE', color: 'text-white' },
                { label: 'Yards After Contact', value: '1.8y', trend: 'UP', color: 'text-green-400' }
            ],
            DEFENSE: [
                { label: 'Takeaways', value: '2.1', trend: 'UP', color: 'text-green-400' },
                { label: 'Sacks / Gm', value: '3.0', trend: 'UP', color: 'text-green-400' },
                { label: 'Scoring Allow', value: '14.2', trend: 'DOWN', color: 'text-green-400' },
                { label: 'Run Stop %', value: '78%', trend: 'UP', color: 'text-green-400' }
            ]
        },
        FLAG: {
            OFFENSE: [
                { label: '3rd Down Eff', value: '55%', trend: 'UP', color: 'text-green-400' },
                { label: 'YAC / Catch', value: '8.4y', trend: 'UP', color: 'text-green-400' },
                { label: 'Blitz Avoid %', value: '92%', trend: 'STABLE', color: 'text-white' },
                { label: 'Completion %', value: '74%', trend: 'DOWN', color: 'text-red-400' }
            ],
            DEFENSE: [
                { label: 'Interceptions', value: '1.4', trend: 'UP', color: 'text-green-400' },
                { label: 'Deflected Passes', value: '4.2', trend: 'UP', color: 'text-green-400' },
                { label: 'Pull Efficiency', value: '88%', trend: 'STABLE', color: 'text-white' },
                { label: 'Sacks (Blitzer)', value: '1.1', trend: 'DOWN', color: 'text-red-400' }
            ]
        }
    }), []);

    const activeStats = stats[program][view];

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Sideline Lab" subtitle={`Analytics de Combate (${program}) - Inteligência em Tempo Real.`} />

            {/* AI Tactical Scan - Visual Broadcast Estilo NFL Next Gen Stats */}
            <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-black p-8 rounded-[3rem] border border-purple-500/20 shadow-2xl relative overflow-hidden shrink-0 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="p-5 bg-purple-600 rounded-[2rem] shadow-glow-purple group-hover:scale-105 transition-transform duration-500 border border-purple-400/30">
                        <SparklesIcon className="w-10 h-10 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                             <span className="bg-purple-500/20 text-purple-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-widest">IA Engine Active</span>
                             <span className="w-1 h-1 rounded-full bg-white/20"></span>
                             <span className="text-[8px] text-text-secondary font-bold uppercase tracking-widest">Scanning Drives...</span>
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tendência Detectada: Inside Zone</h3>
                        <p className="text-purple-200 text-sm mt-2 leading-relaxed font-medium max-w-2xl">
                            "Coach, as corridas pelo Gap A estão rendendo <strong className="text-white">+2.4 jardas</strong> acima da média. A defesa adversária está over-committing no Strong Side. Sugestão: Play Action ou Counter no próximo 2nd & Short."
                        </p>
                    </div>
                    <div className="shrink-0 bg-black/40 p-4 rounded-2xl border border-purple-500/20">
                         <p className="text-[8px] font-black text-purple-400 uppercase mb-1">Confiança</p>
                         <p className="text-2xl font-black text-white italic">92%</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-secondary/30 rounded-[3.5rem] border border-white/5 p-8 flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Broadcast Unit Switcher */}
                <div className="flex bg-black/40 p-1.5 rounded-3xl border border-white/5 mb-10 w-fit shrink-0 mx-auto">
                    <button onClick={() => setView('OFFENSE')} className={`px-12 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${view === 'OFFENSE' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-text-secondary hover:text-white'}`}>ATAQUE</button>
                    <button onClick={() => setView('DEFENSE')} className={`px-12 py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${view === 'DEFENSE' ? 'bg-purple-600 text-white shadow-glow-purple' : 'text-text-secondary hover:text-white'}`}>DEFESA</button>
                </div>

                {/* Broadcast Stat Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {activeStats.map((stat, i) => (
                        <div key={i} className="bg-black/30 p-8 rounded-[2.5rem] border border-white/5 text-center group hover:border-purple-500/50 transition-all duration-500 shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4 opacity-50">{stat.label}</p>
                            <p className="text-5xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                            <div className={`text-[9px] font-black mt-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${stat.trend === 'UP' ? 'bg-green-500/10 text-green-400 border-green-500/20' : stat.trend === 'DOWN' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-text-secondary border-white/10'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${stat.trend === 'UP' ? 'bg-green-400' : stat.trend === 'DOWN' ? 'bg-red-400' : 'bg-white/40'}`}></div>
                                {stat.trend} TREND
                            </div>
                        </div>
                    ))}
                </div>

                {/* Efficiency Visualizer Placeholder */}
                <div className="flex-1 bg-black/40 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-12 group hover:border-purple-500/30 transition-colors">
                    <ActivityIcon className="w-20 h-20 text-text-secondary mb-6 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                    <h4 className="text-sm font-black text-white uppercase italic tracking-[0.4em] opacity-40">Interactive Combat Charts</h4>
                    <p className="text-[10px] font-bold text-text-secondary mt-3 opacity-30 uppercase tracking-widest text-center max-w-xs">Aguardando dados da Súmula Digital para plotagem de tendências em tempo real.</p>
                    
                    <div className="mt-8 flex gap-3">
                         <div className="w-12 h-1 bg-white/5 rounded-full"></div>
                         <div className="w-12 h-1 bg-white/5 rounded-full"></div>
                         <div className="w-12 h-1 bg-white/5 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidelineLab;