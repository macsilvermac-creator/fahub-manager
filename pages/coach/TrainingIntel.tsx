
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { 
    ChevronDownIcon, SparklesIcon, WhistleIcon, 
    ShieldCheckIcon, ActivityIcon, PlayCircleIcon 
} from '../../components/icons/UiIcons';

const TrainingIntel: React.FC = () => {
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const sectors = [
        { id: 'OFF', label: '1. Ataque', icon: '🏈', color: 'bg-blue-600', role: 'Coord. Ofensivo' },
        { id: 'DEF', label: '2. Defesa', icon: '🛡️', color: 'bg-red-600', role: 'Coord. Defensivo' },
        { id: 'ST', label: '3. Special Teams', icon: '🎯', color: 'bg-yellow-600', role: 'Coord. ST' },
        { id: 'IND', label: '4. Individual', icon: '👤', color: 'bg-highlight', role: 'Position Coach' }
    ];

    const reports = [
        { id: 1, title: 'Bloqueio de Gap em Outside Zone', author: 'Coord. Guto', date: 'HOJE', type: 'TÁTICO', status: 'CRÍTICO', xp: 50, content: 'A linha ofensiva apresentou dificuldade no alcance do segundo nível. O Guard esquerdo falhou na transição para o Linebacker médio em 40% das repetições.', aiNote: 'Recomendado drill de 3-step vertical amanhã.' },
        { id: 2, title: 'Leitura de Safeties (Cover 2)', author: 'HC', date: 'HOJE', type: 'TÁTICO', status: 'OK', xp: 30, content: 'WRs estão identificando bem o hole shot. QB1 precisa antecipar o lançamento 0.2s antes para evitar o fechamento do Safety.', aiNote: 'Melhora de 15% na precisão de passes profundos.' },
        { id: 3, title: 'Mecânica de Snap (C/QB Exchange)', author: 'Coach Smith', date: 'ONTEM', type: 'TÉCNICO', status: 'ESTÁVEL', xp: 20, content: 'Trabalho focado em Under Center. Nenhum fumbled snap em 50 reps.', aiNote: 'Consistência técnica excelente.' }
    ];

    if (!selectedSector) {
        return (
            <div className="space-y-8 animate-fade-in flex flex-col h-full">
                <PageHeader title="Training Intel" subtitle="Escolha o setor para visualizar a biblioteca de inteligência." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {sectors.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setSelectedSector(s.id)}
                            className="bg-secondary/40 border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-highlight/50 transition-all group shadow-xl active:scale-95 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <WhistleIcon className="w-32 h-32" />
                            </div>
                            <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{s.icon}</span>
                            <div className="text-center">
                                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{s.label}</h3>
                                <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.3em] mt-1 opacity-50">{s.role}</p>
                            </div>
                            <div className={`h-1.5 w-16 rounded-full ${s.color} shadow-lg shadow-black/40`}></div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedSector(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-text-secondary transition-all">
                        <ChevronDownIcon className="w-5 h-5 rotate-90" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase italic">Biblioteca: {selectedSector}</h2>
                        <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Informações compiladas pela coordenação</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">{reports.length} Entradas</span>
                </div>
            </div>

            {/* EXPANDABLE LINE LIBRARY */}
            <div className="flex-1 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar">
                    {reports.map(report => (
                        <div 
                            key={report.id}
                            className={`bg-secondary/40 rounded-2xl border transition-all duration-500 overflow-hidden ${expandedId === report.id ? 'border-highlight bg-black/40 shadow-glow-small' : 'border-white/5 hover:bg-white/5'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                className="w-full p-5 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`w-2 h-2 rounded-full ${report.status === 'CRÍTICO' ? 'bg-red-500 animate-pulse' : 'bg-highlight'}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-black uppercase italic text-base truncate">{report.title}</h4>
                                        <div className="flex items-center gap-4 mt-1 opacity-50">
                                            <span className="text-[9px] text-text-secondary font-black uppercase tracking-widest">{report.date} • {report.author}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                            <span className="text-[9px] text-highlight font-black uppercase tracking-widest">{report.type}</span>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex gap-4">
                                         <div className="text-center px-4 border-r border-white/5">
                                            <p className="text-[8px] font-black text-text-secondary uppercase">Pontuação</p>
                                            <p className="text-sm font-black text-white">+{report.xp} XP</p>
                                         </div>
                                    </div>
                                </div>
                                <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform duration-500 ${expandedId === report.id ? 'rotate-180 text-highlight' : ''}`} />
                            </button>

                            {/* EXPANDED CONTENT: "TEAR EFFECT" */}
                            {expandedId === report.id && (
                                <div className="px-6 pb-8 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-6"></div>
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        <div className="lg:col-span-8 space-y-6">
                                            <div className="bg-black/40 p-6 rounded-3xl border-l-4 border-highlight">
                                                <p className="text-sm text-text-secondary italic leading-relaxed font-medium">"{report.content}"</p>
                                            </div>
                                            
                                            <div className="bg-purple-900/10 border border-purple-500/20 p-5 rounded-2xl flex gap-4">
                                                <SparklesIcon className="w-5 h-5 text-purple-400 shrink-0" />
                                                <div>
                                                    <h5 className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-1">IA Technical Observation</h5>
                                                    <p className="text-xs text-purple-100 italic leading-relaxed">{report.aiNote}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="lg:col-span-4 space-y-4">
                                            <div className="bg-black/60 p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
                                                <PlayCircleIcon className="w-10 h-10 text-highlight mb-2" />
                                                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Filmagem do Drill</p>
                                                <button className="mt-4 w-full py-3 bg-white text-black font-black rounded-xl text-[9px] uppercase italic transition-all hover:bg-highlight hover:text-white">Abrir Video</button>
                                            </div>
                                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all">Ver Playbook Relacionado</button>
                                        </div>
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