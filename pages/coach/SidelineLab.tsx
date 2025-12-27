
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { ActivityIcon, SparklesIcon, TrophyIcon, UsersIcon } from '../../components/icons/UiIcons';

const SidelineLab: React.FC = () => {
    const [view, setView] = useState<'OFFENSE' | 'DEFENSE'>('OFFENSE');

    const stats = {
        OFFENSE: [
            { label: '3rd Down Eff', value: '42%', trend: 'UP', color: 'text-green-400' },
            { label: 'Redzone TD%', value: '68%', trend: 'DOWN', color: 'text-red-400' },
            { label: 'Yards / Play', value: '6.4', trend: 'UP', color: 'text-green-400' },
            { label: 'Turnovers', value: '02', trend: 'STABLE', color: 'text-white' }
        ],
        DEFENSE: [
            { label: 'Takeaways', value: '1.2', trend: 'UP', color: 'text-green-400' },
            { label: 'Sacks / Gm', value: '3.0', trend: 'UP', color: 'text-green-400' },
            { label: '3rd Down Allow', value: '31%', trend: 'DOWN', color: 'text-green-400' },
            { label: 'Rushing Allow', value: '112y', trend: 'UP', color: 'text-red-400' }
        ]
    };

    const activeStats = view === 'OFFENSE' ? stats.OFFENSE : stats.DEFENSE;

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Sideline Lab" subtitle="Analytics de combate e inteligência tática em tempo real." />

            {/* AI Banner - Estilo Broadcast */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-black p-6 rounded-[2.5rem] border border-purple-500/20 shadow-2xl relative overflow-hidden shrink-0 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10 flex items-center gap-5">
                    <div className="p-4 bg-purple-600 rounded-2xl shadow-glow-purple group-hover:scale-110 transition-transform">
                        <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">IA Tactical Scan</h3>
                        <p className="text-purple-200 text-xs mt-1 leading-relaxed font-medium">
                            "Coach, as corridas pelo Gap A estão rendendo +2.4 jardas acima da média. <br/>Sugestão: Manter foco no Inside Zone nas próximas 3 descidas."
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-secondary/30 rounded-[3rem] border border-white/5 p-6 flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl">
                {/* Switcher Unidade */}
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-8 w-fit shrink-0">
                    <button onClick={() => setView('OFFENSE')} className={`px-10 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${view === 'OFFENSE' ? 'bg-purple-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}>ATAQUE</button>
                    <button onClick={() => setView('DEFENSE')} className={`px-10 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${view === 'DEFENSE' ? 'bg-purple-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}>DEFESA</button>
                </div>

                {/* Grid de Estatísticas Master */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {activeStats.map((stat, i) => (
                        <div key={i} className="bg-black/30 p-6 rounded-[2rem] border border-white/5 text-center group hover:border-purple-500/50 transition-all">
                            <p className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                            <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                            <div className={`text-[8px] font-black mt-4 inline-block px-3 py-1 rounded-full ${stat.trend === 'UP' ? 'bg-green-500/10 text-green-400' : stat.trend === 'DOWN' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-text-secondary'}`}>
                                TREND: {stat.trend}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart Area Placeholder */}
                <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 p-10 flex flex-col items-center justify-center opacity-20 border-dashed">
                    <ActivityIcon className="w-16 h-16 text-text-secondary mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.4em]">Gráficos de Tendência (Drives)</p>
                    <p className="text-[10px] font-bold mt-2">Aguardando dados da Súmula Digital...</p>
                </div>
            </div>
        </div>
    );
};

export default SidelineLab;