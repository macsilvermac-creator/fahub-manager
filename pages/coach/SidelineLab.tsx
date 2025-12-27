
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { SparklesIcon, ActivityIcon, TrophyIcon, WhistleIcon } from '../../components/icons/UiIcons';

const SidelineLab: React.FC = () => {
    const [activeUnit, setActiveUnit] = useState<'ATAQUE' | 'DEFESA' | 'ST'>('ATAQUE');

    const stats = {
        ATAQUE: [
            { label: 'Eficiência 3rd Down', value: '42%', trend: '+5%' },
            { label: 'Jardas/Play (Média)', value: '6.4y', trend: '-0.2y' },
            { label: 'Redzone TD%', value: '68%', trend: '+12%' }
        ],
        DEFESA: [
            { label: 'Takeaways/Jogo', value: '2.1', trend: '+0.5' },
            { label: 'Sacks Totais', value: '14', trend: '+2' },
            { label: 'Pontos Permitidos', value: '14.2', trend: '-3.1' }
        ],
        ST: [
            { label: 'Média Punts', value: '38.2y', trend: 'Estável' },
            { label: 'Field Goal %', value: '88%', trend: 'Elite' },
            { label: 'Retorno Médio', value: '12.4y', trend: '+2.1y' }
        ]
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Sideline Lab" subtitle="Combat Analytics: Inteligência de campo em tempo real." />

            {/* SELETOR BROADCAST */}
            <div className="flex bg-secondary/60 backdrop-blur-xl p-1.5 rounded-3xl border border-white/10 w-fit mx-auto shadow-2xl shrink-0">
                {['ATAQUE', 'DEFESA', 'ST'].map(u => (
                    <button 
                        key={u}
                        onClick={() => setActiveUnit(u as any)}
                        className={`px-12 py-3.5 rounded-2xl text-xs font-black transition-all tracking-widest uppercase ${activeUnit === u ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                    >
                        {u}
                    </button>
                ))}
            </div>

            {/* BROADCAST STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                {stats[activeUnit].map((stat, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[3rem] text-center shadow-xl group hover:border-highlight/30 transition-all relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-highlight/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] mb-4 opacity-50">{stat.label}</p>
                        <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">{stat.value}</h4>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
                            <span className={`text-[10px] font-black ${stat.trend.includes('+') ? 'text-green-400' : 'text-text-secondary'}`}>{stat.trend}</span>
                            <span className="text-[8px] font-bold text-text-secondary/40 uppercase">Trend</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI LIVE INSIGHT (BROADCAST OVERLAY STYLE) */}
            <div className="flex-1 bg-gradient-to-br from-secondary/40 to-black rounded-[3.5rem] border border-white/5 p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                    <SparklesIcon className="w-64 h-64 text-purple-400" />
                </div>
                
                <div className="relative z-10 shrink-0">
                    <div className="p-8 bg-purple-600 rounded-[2.5rem] shadow-glow-purple animate-pulse border-4 border-purple-400/30">
                        <SparklesIcon className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="relative z-10 flex-1 text-center md:text-left">
                    <h5 className="text-purple-400 font-black uppercase text-xs tracking-[0.5em] mb-4">Sideline AI Engine • Report</h5>
                    <p className="text-2xl font-bold text-white italic leading-snug">
                        "Detectamos que a eficiência de passe no Gap-B cai 24% após 3 snaps em ritmo UP-TEMPO. Sugestão: Inserir RB2 para proteção extra ou focar em rotas Out no próximo drive."
                    </p>
                    <div className="mt-8 flex gap-3 justify-center md:justify-start">
                        <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black text-text-secondary uppercase tracking-widest">Confiança: 94%</span>
                        <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black text-text-secondary uppercase tracking-widest">Sample: 42 Snaps</span>
                    </div>
                </div>

                <div className="shrink-0 bg-black/40 p-8 rounded-[2.5rem] border border-white/10 text-center shadow-inner">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Live Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-glow-red"></div>
                        <span className="text-xl font-mono font-bold text-white">ANALYZING</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidelineLab;