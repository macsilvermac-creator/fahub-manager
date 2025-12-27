
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { ActivityIcon, SparklesIcon, TrophyIcon, UsersIcon } from '../../components/icons/UiIcons';

const SidelineLab: React.FC = () => {
    const [activeUnit, setActiveUnit] = useState('ATAQUE');

    const units = ['ATAQUE', 'DEFESA', 'ST'];

    const stats = {
        ATAQUE: [
            { label: 'Eficiência 3rd Down', value: '42%', trend: '+5%' },
            { label: 'Jardas/Play', value: '5.8y', trend: '-0.2y' },
            { label: 'Redzone TD%', value: '60%', trend: 'Estável' }
        ],
        DEFESA: [
            { label: 'Takeaways/Jogo', value: '2.1', trend: '+0.5' },
            { label: 'Sacks Totais', value: '18', trend: '+3' },
            { label: 'PPG Permitido', value: '14.2', trend: '-2.1' }
        ],
        ST: [
            { label: 'Média Punts', value: '38.5y', trend: '+1.2y' },
            { label: 'Field Goal %', value: '88%', trend: 'Elite' },
            { label: 'Retorno Médio', value: '12.4y', trend: '+2.1y' }
        ]
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Sideline Lab" subtitle="Estatísticas e tendências processadas pela IA." />

            {/* SELETOR BROADCAST */}
            <div className="flex bg-secondary/60 backdrop-blur-xl p-1.5 rounded-3xl border border-white/10 w-fit mx-auto shadow-2xl">
                {units.map(u => (
                    <button 
                        key={u}
                        onClick={() => setActiveUnit(u)}
                        className={`px-10 py-3 rounded-2xl text-[10px] font-black transition-all tracking-widest ${activeUnit === u ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                    >
                        {u}
                    </button>
                ))}
            </div>

            {/* GRID ANALÍTICO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
                {(stats as any)[activeUnit].map((s: any, i: number) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] text-center shadow-xl hover:border-highlight/30 transition-all">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4 opacity-50">{s.label}</p>
                        <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">{s.value}</h4>
                        <p className="text-highlight font-black text-[9px] mt-4 uppercase tracking-widest">{s.trend} Tendência</p>
                    </div>
                ))}
            </div>

            {/* BOX DE INSIGHT IA */}
            <div className="flex-1 bg-gradient-to-br from-secondary/40 to-black rounded-[3rem] border border-white/5 p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <SparklesIcon className="w-64 h-64 text-purple-400" />
                </div>
                <div className="p-6 bg-purple-600 rounded-3xl shadow-glow-purple group relative z-10">
                    <SparklesIcon className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div className="relative z-10 max-w-2xl text-center md:text-left">
                    <h5 className="text-purple-400 font-black uppercase text-xs tracking-[0.4em] mb-3">Sideline IA Report</h5>
                    <p className="text-xl font-bold text-white italic leading-relaxed">
                        "Detectamos uma alta taxa de sucesso em passes curtos no Gap-B. O adversário está sobrecarregando o lado forte. Sugestão: Aumentar o volume de Play Actions para o lado oposto no próximo drive."
                    </p>
                </div>
                <div className="shrink-0 bg-black/40 p-6 rounded-[2rem] border border-white/10 text-center ml-auto">
                    <p className="text-[9px] font-black text-text-secondary uppercase mb-2">Confiança IA</p>
                    <p className="text-2xl font-black text-highlight italic">92%</p>
                </div>
            </div>
        </div>
    );
};

export default SidelineLab;