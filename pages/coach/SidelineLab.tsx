
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { SparklesIcon, ActivityIcon, WhistleIcon, TrophyIcon, UsersIcon } from '../../components/icons/UiIcons';

const SidelineLab: React.FC = () => {
    const [view, setView] = useState<'OFF' | 'DEF' | 'ST'>('OFF');

    const stats = {
        OFF: [
            { label: 'Eficiência 3rd Down', value: '42%', trend: 'UP', color: 'text-green-400' },
            { label: 'Sucesso Gap-A (Run)', value: '68%', trend: 'UP', color: 'text-green-400' },
            { label: 'Pocket Protect Time', value: '3.4s', trend: 'DOWN', color: 'text-red-400' },
            { label: 'Jardas/Play', value: '6.2y', trend: 'STABLE', color: 'text-white' }
        ],
        DEF: [
            { label: 'Pass Rush Win %', value: '24%', trend: 'UP', color: 'text-green-400' },
            { label: 'Missed Tackles', value: '08', trend: 'UP', color: 'text-red-400' },
            { label: 'Points/Gm Allowed', value: '14.2', trend: 'DOWN', color: 'text-green-400' },
            { label: 'Takeaways/Gm', value: '2.1', trend: 'UP', color: 'text-green-400' }
        ],
        ST: [
            { label: 'Field Goal %', value: '88%', trend: 'STABLE', color: 'text-white' },
            { label: 'Net Punt Avg', value: '38.4y', trend: 'UP', color: 'text-green-400' },
            { label: 'Retorno Médio (KR)', value: '22.1y', trend: 'DOWN', color: 'text-red-400' },
            { label: 'Block Attempts', value: '1.2', trend: 'UP', color: 'text-green-400' }
        ]
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Sideline Lab" subtitle="Combat Analytics: Inteligência e tendências de campo em tempo real." />

            {/* AI SCANNER BOX (BROADCAST STYLE) */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-black p-8 rounded-[3rem] border border-purple-500/30 shadow-2xl relative overflow-hidden shrink-0 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="p-6 bg-purple-600 rounded-[2.5rem] shadow-glow-purple group-hover:scale-105 transition-transform duration-500">
                        <SparklesIcon className="w-12 h-12 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <span className="bg-purple-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">IA Active</span>
                            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">Scanning Tendencies...</span>
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Tendência Detectada: Slant Route no Gap-B</h3>
                        <p className="text-purple-200 text-sm mt-2 font-medium italic opacity-80">"Coach, a defesa adversária está dando +10yds de cushion no WR2 em situações de 2nd & Long. Sucesso projetado de 84% em rotas internas curtas."</p>
                    </div>
                    <div className="shrink-0 bg-black/40 px-8 py-4 rounded-3xl border border-purple-500/20 text-center">
                        <p className="text-[10px] font-black text-purple-400 uppercase mb-1">Confiança</p>
                        <p className="text-3xl font-black text-white italic">92%</p>
                    </div>
                </div>
            </div>

            {/* UNIT SELECTOR */}
            <div className="flex bg-secondary/60 backdrop-blur-xl p-1.5 rounded-[2rem] border border-white/5 w-fit mx-auto shadow-2xl shrink-0">
                <button onClick={() => setView('OFF')} className={`px-12 py-3.5 rounded-2xl text-[10px] font-black transition-all tracking-widest uppercase ${view === 'OFF' ? 'bg-blue-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}>ATAQUE</button>
                <button onClick={() => setView('DEF')} className={`px-12 py-3.5 rounded-2xl text-[10px] font-black transition-all tracking-widest uppercase ${view === 'DEF' ? 'bg-red-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}>DEFESA</button>
                <button onClick={() => setView('ST')} className={`px-12 py-3.5 rounded-2xl text-[10px] font-black transition-all tracking-widest uppercase ${view === 'ST' ? 'bg-highlight text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}>ST</button>
            </div>

            {/* STATS BROADCAST GRID */}
            <div className="flex-1 bg-secondary/30 rounded-[3.5rem] border border-white/5 p-8 flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats[view].map((stat, i) => (
                        <div key={i} className="bg-black/30 p-8 rounded-[2.5rem] border border-white/5 text-center group hover:border-highlight transition-all duration-500 shadow-xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.4em] mb-4 opacity-50">{stat.label}</p>
                            <h4 className={`text-5xl font-black italic tracking-tighter leading-none ${stat.color}`}>{stat.value}</h4>
                            <div className="mt-6 inline-flex items-center gap-2 bg-white/5 px-4 py-1 rounded-full border border-white/10">
                                <ActivityIcon className="w-3 h-3 text-text-secondary" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{stat.trend} TREND</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Visual Filler for Combat Feel */}
                <div className="mt-8 flex-1 bg-black/40 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-12 opacity-40">
                     <TrophyIcon className="w-16 h-16 text-text-secondary mb-4 opacity-10" />
                     <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.5em] text-center">Aguardando novos snaps da súmula digital para atualização de tendências dinâmicas.</p>
                </div>
            </div>
        </div>
    );
};

export default SidelineLab;