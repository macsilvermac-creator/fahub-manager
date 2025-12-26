import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { DumbbellIcon, SparklesIcon, RefreshIcon, CheckCircleIcon, ActivityIcon } from '@/components/icons/UiIcons';

const IronLab: React.FC = () => {
    const [activeEnvironment, setActiveEnvironment] = useState('ACADEMIA');
    const [selectedValence, setSelectedValence] = useState<string[]>([]);

    const valences = [
        'Explosão', 'Força Máxima', 'Potência',
        'Agilidade', 'Velocidade', 'Core FA',
        'Pliometria', 'Endurance', 'Flexibilidade'
    ];

    const toggleValence = (v: string) => {
        if (selectedValence.includes(v)) setSelectedValence(selectedValence.filter(item => item !== v));
        else if (selectedValence.length < 3) setSelectedValence([...selectedValence, v]);
    };

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
            <PageHeader title="Iron Lab" subtitle="O laboratório de força da associação esportiva." />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
                {/* LEFT: AI PROMPT CONSOLE (RESTRITO) */}
                <div className="lg:col-span-4 bg-secondary/40 rounded-[3rem] border border-white/5 p-8 flex flex-col shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        <SparklesIcon className="w-6 h-6 text-orange-500 animate-pulse" />
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Iron Assistant IA</h3>
                    </div>

                    <div className="space-y-8 flex-1">
                        <section>
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4">Ambiente de Operação</p>
                            <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                                {['ACADEMIA', 'CASA', 'RUA'].map(env => (
                                    <button 
                                        key={env}
                                        onClick={() => setActiveEnvironment(env)}
                                        className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all ${activeEnvironment === env ? 'bg-orange-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                                    >
                                        {env}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Valências Técnicas (Max 3)</p>
                                <span className="text-[9px] font-black text-orange-500">{selectedValence.length}/3</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {valences.map(v => (
                                    <button 
                                        key={v}
                                        onClick={() => toggleValence(v)}
                                        className={`p-3 rounded-2xl border text-[9px] font-black transition-all h-16 flex items-center justify-center text-center leading-tight ${selectedValence.includes(v) ? 'bg-orange-600/20 border-orange-500 text-orange-400' : 'bg-black/20 border-white/5 text-text-secondary hover:bg-white/5'}`}
                                    >
                                        {v.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <button className="w-full bg-white text-black font-black py-5 rounded-[2rem] uppercase italic text-xs shadow-glow-orange mt-8 transform active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <RefreshIcon className="w-4 h-4" /> Construir Treino de Elite
                    </button>
                </div>

                {/* RIGHT: TRAINING LIBRARY */}
                <div className="lg:col-span-8 space-y-6 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.4em]">Biblioteca de Execução</h3>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow"></div>
                             <span className="text-[10px] font-black text-white uppercase">Sincronizado</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="bg-black/20 rounded-[2.5rem] border border-white/5 p-8 flex items-center justify-between group hover:border-orange-500/50 transition-all">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 rounded-3xl bg-orange-600/10 flex items-center justify-center border border-orange-600/20">
                                        <DumbbellIcon className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xl font-black text-white uppercase italic">Sessão: Explosão Lateral</h4>
                                            <span className="bg-orange-600/20 text-orange-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Avançado</span>
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1 font-medium opacity-60">Foco em troca de direção (Shuttle 5-10-5) e estabilidade de core.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                     <div className="text-center">
                                         <p className="text-[8px] font-black text-text-secondary uppercase">Duração</p>
                                         <p className="text-lg font-black text-white italic">45 min</p>
                                     </div>
                                     <button className="p-4 bg-white/5 hover:bg-orange-600 rounded-3xl transition-all group-hover:scale-110">
                                         <CheckCircleIcon className="w-6 h-6 text-white" />
                                     </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IronLab;