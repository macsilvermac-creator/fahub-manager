
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { WhistleIcon, ChevronDownIcon, SparklesIcon, ActivityIcon, PlayCircleIcon } from '../../components/icons/UiIcons';

const TrainingIntel: React.FC = () => {
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const sectors = [
        { id: 'ATAQUE', label: '1. Ataque', icon: '🏈', color: 'bg-blue-600' },
        { id: 'DEFESA', label: '2. Defesa', icon: '🛡️', color: 'bg-red-600' },
        { id: 'ST', label: '3. Special Teams', icon: '🎯', color: 'bg-yellow-600' },
        { id: 'INDIVIDUAL', label: '4. Individual', icon: '👤', color: 'bg-highlight' }
    ];

    const reports = [
        { id: 1, title: 'Analise de Blitz Q2', date: 'Hoje', author: 'Coord. Guto', content: 'A linha ofensiva apresentou dificuldade na identificação do Mike em situações de Empty Set. Sugestão: Repetir drills de proteção 1-A.', video: true },
        { id: 2, title: 'Performance WRs', date: 'Ontem', author: 'HC', content: 'Velocidade de saída (release) acima da média. Foco agora é o stalking block no perímetro.', video: false }
    ];

    if (!selectedSector) {
        return (
            <div className="space-y-8 animate-fade-in">
                <PageHeader title="Training Intel" subtitle="Escolha o setor para visualizar os relatórios técnicos." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sectors.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setSelectedSector(s.id)}
                            className="bg-secondary/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-highlight/50 transition-all group shadow-xl active:scale-95"
                        >
                            <span className="text-5xl">{s.icon}</span>
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{s.label}</h3>
                            <div className={`h-1.5 w-12 rounded-full ${s.color}`}></div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <div className="flex justify-between items-center">
                <PageHeader title={`Intel: ${selectedSector}`} subtitle="Biblioteca de relatórios e feedback técnico." />
                <button onClick={() => setSelectedSector(null)} className="text-xs font-black text-highlight uppercase tracking-widest border-b border-highlight pb-1">Voltar aos Setores</button>
            </div>

            <div className="flex-1 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
                    {reports.map(report => (
                        <div 
                            key={report.id}
                            className={`bg-secondary/40 rounded-[2rem] border transition-all overflow-hidden ${expandedId === report.id ? 'border-highlight bg-black/40' : 'border-white/5'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                className="w-full p-6 flex justify-between items-center text-left"
                            >
                                <div>
                                    <h4 className="text-white font-bold uppercase italic text-lg">{report.title}</h4>
                                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1 opacity-50">{report.date} • {report.author}</p>
                                </div>
                                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform ${expandedId === report.id ? 'rotate-180 text-highlight' : ''}`} />
                            </button>

                            {expandedId === report.id && (
                                <div className="px-6 pb-6 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-4"></div>
                                    <p className="text-sm text-text-secondary leading-relaxed italic">"{report.content}"</p>
                                    <div className="mt-6 flex gap-4">
                                        <div className="bg-purple-900/20 p-4 rounded-2xl border border-purple-500/20 flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <SparklesIcon className="w-4 h-4 text-purple-400" />
                                                <span className="text-[9px] font-black text-purple-400 uppercase">AI Analytics</span>
                                            </div>
                                            <p className="text-[11px] text-purple-100">Tendência de fadiga detectada durante os últimos 5 snaps desta sessão.</p>
                                        </div>
                                        {report.video && (
                                            <button className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 flex items-center gap-3 transition-all">
                                                <PlayCircleIcon className="w-6 h-6 text-white" />
                                                <span className="text-[10px] font-black text-white uppercase">Ver Filmagem</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainingIntel;