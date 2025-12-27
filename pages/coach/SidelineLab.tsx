
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { SparklesIcon, ActivityIcon, TrendingUpIcon } from '../../components/icons/UiIcons';

type Unit = 'OFFENSE' | 'DEFENSE' | 'ST';

const SidelineLab: React.FC = () => {
    const [activeUnit, setActiveUnit] = useState<Unit>('OFFENSE');

    const unitStats = {
        'OFFENSE': [
            { label: 'Eficiência 3rd Down', value: '42%', trend: 'UP', detail: 'Foco em recepções no flat' },
            { label: 'Média Jardas/Play', value: '5.8', trend: 'DOWN', detail: 'Perda de jardas em corridas de gap' },
            { label: 'Redzone Conversion', value: '68%', trend: 'STABLE', detail: 'Elite performance em passes curtos' }
        ],
        'DEFENSE': [
            { label: 'Pressure Rate', value: '24%', trend: 'UP', detail: 'DL superando OL adversária' },
            { label: 'Missed Tackles', value: '12', trend: 'UP', detail: 'Problema em tackle de campo aberto' },
            { label: 'Pass Breakups', value: '08', trend: 'UP', detail: 'DBs reagindo bem ao QB' }
        ],
        'ST': [
            { label: 'FG Accuracy', value: '88%', trend: 'STABLE', detail: 'Kicker confiável hoje' },
            { label: 'Punt Return Avg', value: '12.4', trend: 'UP', detail: 'Bons bloqueios na sideline' },
            { label: 'Opp Kickoff Touchback', value: '25%', trend: 'DOWN', detail: 'Cobertura em alerta' }
        ]
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in pb-20">
            <PageHeader title="Sideline Lab" subtitle="Combat Analytics: Estatísticas de campo processadas em tempo real." />

            {/* TV Style Mode Selector */}
            <div className="flex bg-secondary/60 backdrop-blur-xl p-1.5 rounded-[2.5rem] border border-white/5 w-fit mx-auto shadow-2xl shrink-0">
                {(['OFFENSE', 'DEFENSE', 'ST'] as Unit[]).map(u => (
                    <button 
                        key={u}
                        onClick={() => setActiveUnit(u)}
                        className={`px-12 py-4 rounded-[2rem] text-[10px] font-black transition-all tracking-[0.2em] uppercase ${
                            activeUnit === u ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'
                        }`}
                    >
                        {u === 'OFFENSE' ? 'Ataque' : u === 'DEFENSE' ? 'Defesa' : 'ST'}
                    </button>
                ))}
            </div>

            {/* Main Stats Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                {unitStats[activeUnit].map((stat, i) => (
                    <div key={i} className="bg-secondary/40 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/5 text-center group hover:border-highlight/50 transition-all shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ActivityIcon className="w-24 h-24 text-white" />
                        </div>
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.4em] mb-6 opacity-50">{stat.label}</p>
                        <h4 className="text-6xl font-black text-white italic tracking-tighter leading-none mb-6">{stat.value}</h4>
                        <div className="flex items-center justify-center gap-3">
                             <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                                 stat.trend === 'UP' ? 'bg-green-500/20 text-green-400' : 
                                 stat.trend === 'DOWN' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
                             }`}>Trend: {stat.trend}</span>
                        </div>
                        <p className="text-[10px] text-text-secondary mt-6 italic font-medium leading-relaxed px-4 opacity-70">"{stat.detail}"</p>
                    </div>
                ))}
            </div>

            {/* AI Strategic Advice */}
            <div className="flex-1 bg-gradient-to-br from-purple-950/40 to-black rounded-[4rem] border border-purple-500/30 p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="p-8 bg-purple-600 rounded-[3rem] shadow-glow-purple relative z-10 animate-pulse-slow border-4 border-purple-400/30">
                    <SparklesIcon className="w-16 h-16 text-white" />
                </div>
                <div className="relative z-10 flex-1 text-center md:text-left">
                    <h5 className="text-purple-400 font-black uppercase text-xs tracking-[0.6em] mb-6">Sideline AI Hub • Live Recommendation</h5>
                    <p className="text-3xl font-bold text-white italic leading-snug">
                        "O ataque adversário está explorando o Gap-B em 64% das corridas de 1st Down. Sugerimos mudar a DL para uma formação 'Under' com o Nose Tackle em técnica 0 para travar o meio e forçar o bounce para os LBs."
                    </p>
                </div>
                <button className="relative z-10 bg-white text-black font-black px-10 py-5 rounded-[2rem] uppercase italic text-xs shadow-2xl active:scale-95 transition-all">Aplicar Ajuste</button>
            </div>
        </div>
    );
};

export default SidelineLab;