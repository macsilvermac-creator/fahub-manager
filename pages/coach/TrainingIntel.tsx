
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { ChevronDownIcon, SparklesIcon, PlayCircleIcon, ActivityIcon } from '../../components/icons/UiIcons';

const TrainingIntel: React.FC = () => {
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const sectors = [
        { id: 'ATAQUE', label: '1. Ataque', icon: '🏈', color: 'bg-blue-600' },
        { id: 'DEFESA', label: '2. Defesa', icon: '🛡️', color: 'bg-red-600' },
        { id: 'ST', label: '3. Special Teams', icon: '🎯', color: 'bg-yellow-600' },
        { id: 'INDIVIDUAL', label: '4. Individual', icon: '👤', color: 'bg-highlight' }
    ];

    const mockReports = [
        { id: 1, title: 'Analise de Blitz Cover 0', date: 'Hoje', author: 'Coord. Guto', content: 'A linha ofensiva apresentou dificuldade na identificação do Mike em situações de Empty Set. Sugestão: Repetir drills de proteção 1-A.', video: true },
        { id: 2, title: 'Timing de Rotas Curtas', date: 'Hoje', author: 'Coord. Guto', content: 'WRs estão cortando as rotas Slant cedo demais. Precisamos de 3 passos verticais antes do break.', video: false },
        { id: 3, title: 'Mecânica de Pocket do QB1', date: 'Ontem', author: 'HC', content: 'Melhora significativa no footwork sob pressão. O release está 0.2s mais rápido.', video: true }
    ];

    if (!selectedSector) {
        return (
            <div className="space-y-8 animate-fade-in h-full">
                <PageHeader title="Training Intel" subtitle="Selecione o setor tático para visualizar os relatórios." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {sectors.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setSelectedSector(s.id)}
                            className="bg-secondary/40 border border-white/5 rounded-[3rem] p-12 flex flex-col items-center justify-center gap-6 hover:border-highlight/50 transition-all group shadow-xl active:scale-95"
                        >
                            <span className="text-6xl">{s.icon}</span>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{s.label}</h3>
                            <div className={`h-1.5 w-16 rounded-full ${s.color}`}></div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <div className="flex justify-between items-center">
                <PageHeader title={`Intel: ${selectedSector}`} subtitle="Biblioteca de informações técnicas do setor." />
                <button onClick={() => setSelectedSector(null)} className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] border-b border-highlight pb-1">Voltar aos Setores</button>
            </div>

            <div className="flex-1 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar">
                    {mockReports.map(report => (
                        <div 
                            key={report.id}
                            className={`bg-secondary/40 rounded-2xl border transition-all overflow-hidden ${expandedId === report.id ? 'border-highlight bg-black/40' : 'border-white/5 hover:bg-white/5'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                className="w-full p-5 flex justify-between items-center text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${report.id === 1 ? 'bg-highlight animate-pulse' : 'bg-white/20'}`}></div>
                                    <div>
                                        <h4 className="text-white font-bold uppercase italic text-sm">{report.title}</h4>
                                        <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest mt-0.5 opacity-50">{report.date} • {report.author}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {report.video && <ActivityIcon className="w-4 h-4 text-highlight" />}
                                    <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform ${expandedId === report.id ? 'rotate-180 text-highlight' : ''}`} />
                                </div>
                            </button>

                            {expandedId === report.id && (
                                <div className="px-5 pb-6 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-4"></div>
                                    <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-highlight/30 pl-4">"{report.content}"</p>
                                    <div className="mt-6 flex gap-4">
                                        <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20 flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <SparklesIcon className="w-4 h-4 text-purple-400" />
                                                <span className="text-[9px] font-black text-purple-400 uppercase">Análise IA</span>
                                            </div>
                                            <p className="text-[10px] text-purple-100">Com base nas notas, o nível de stress técnico da unidade subiu 15%. Recomendo drill de reforço mental.</p>
                                        </div>
                                        {report.video && (
                                            <button className="bg-white/5 hover:bg-white/10 p-4 rounded-xl border border-white/10 flex flex-col items-center justify-center gap-2 transition-all">
                                                <PlayCircleIcon className="w-6 h-6 text-white" />
                                                <span className="text-[8px] font-black text-white uppercase">Assistir</span>
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