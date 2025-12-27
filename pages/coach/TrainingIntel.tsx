
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { 
    ChevronDownIcon, SparklesIcon, WhistleIcon, 
    CheckCircleIcon, AlertTriangleIcon 
} from '../../components/icons/UiIcons';

interface Report {
    id: string;
    title: string;
    author: string;
    date: string;
    status: 'OK' | 'CRITICAL' | 'OBSERVATION';
    content: string;
    aiNote: string;
}

const TrainingIntel: React.FC = () => {
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const sectors = [
        { id: 'OFFENSE', label: 'Ataque', icon: '🏈', color: 'bg-blue-600' },
        { id: 'DEFENSE', label: 'Defesa', icon: '🛡️', color: 'bg-red-600' },
        { id: 'ST', label: 'Special Teams', icon: '🎯', color: 'bg-yellow-600' },
        { id: 'INDIVIDUAL', label: 'Individual', icon: '👤', color: 'bg-highlight' }
    ];

    const reports: Record<string, Report[]> = {
        'OFFENSE': [
            { id: '1', title: 'Ajuste de Proteção Gap-B', author: 'Coordenador Guto', date: 'Hoje', status: 'CRITICAL', content: 'Identificamos que o tackle direito está cedendo o edge em blitzes de 5 homens. Necessário reforço no drill de kick-step.', aiNote: 'Sugerido drill de 15min de espelhamento amanhã.' },
            { id: '2', title: 'Timing de Slant Routes', author: 'HC', date: 'Hoje', status: 'OK', content: 'A conexão QB-WR1 está em 90% de eficiência no timing curto.', aiNote: 'Manter carga atual para preservar braço do QB1.' }
        ],
        'DEFENSE': [
            { id: '3', title: 'Comunicação Cover 3', author: 'Coordenador Def', date: 'Hoje', status: 'OBSERVATION', content: 'Safeties hesitando na transição do deep middle.', aiNote: 'Recomendado sessão de vídeo focada em leitura de QB.' }
        ]
    };

    if (!selectedSector) {
        return (
            <div className="h-full flex flex-col space-y-8 animate-fade-in pb-20">
                <PageHeader title="Training Intel" subtitle="Selecione o setor para visualizar o histórico de inteligência." />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                    {sectors.map(s => (
                        <button 
                            key={s.id}
                            onClick={() => setSelectedSector(s.id)}
                            className="bg-secondary/40 border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-highlight/50 transition-all shadow-xl group active:scale-95 overflow-hidden"
                        >
                            <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{s.icon}</span>
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{s.label}</h3>
                            <div className={`h-1.5 w-16 rounded-full ${s.color}`}></div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const currentReports = reports[selectedSector] || [];

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in pb-20">
            <div className="flex justify-between items-center px-4">
                <PageHeader title={`Intel: ${selectedSector}`} subtitle="Biblioteca de relatórios técnicos e táticos." />
                <button 
                    onClick={() => setSelectedSector(null)}
                    className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] border-b border-highlight pb-1 hover:text-white hover:border-white transition-colors"
                >
                    Voltar aos Setores
                </button>
            </div>

            <div className="flex-1 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-8 overflow-y-auto space-y-3 custom-scrollbar">
                    {currentReports.map(report => (
                        <div 
                            key={report.id} 
                            className={`bg-secondary/40 rounded-3xl border transition-all duration-500 overflow-hidden ${expandedId === report.id ? 'border-highlight bg-black/40 shadow-glow-small' : 'border-white/5 hover:bg-white/5'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                className="w-full p-6 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`w-3 h-3 rounded-full ${
                                        report.status === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 
                                        report.status === 'OBSERVATION' ? 'bg-yellow-500' : 'bg-highlight'
                                    }`}></div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-black uppercase italic text-lg">{report.title}</h4>
                                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1 opacity-50">
                                            {report.date} • {report.author}
                                        </p>
                                    </div>
                                </div>
                                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-500 ${expandedId === report.id ? 'rotate-180 text-highlight' : ''}`} />
                            </button>

                            {expandedId === report.id && (
                                <div className="px-8 pb-10 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-8"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                        <div className="md:col-span-8 space-y-8">
                                            <div>
                                                <h5 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3">Relatório Técnico</h5>
                                                <p className="text-white text-sm leading-relaxed italic font-medium">"{report.content}"</p>
                                            </div>
                                            <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-3xl flex gap-4">
                                                <SparklesIcon className="w-6 h-6 text-purple-400 shrink-0" />
                                                <div>
                                                    <h5 className="text-[10px] font-black text-purple-400 uppercase mb-2 tracking-widest">AI Command Insight</h5>
                                                    <p className="text-xs text-purple-100 font-medium">{report.aiNote}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-4 flex flex-col gap-3">
                                            <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">Ver Vídeo do Drill</button>
                                            <button className="w-full py-4 bg-highlight/10 hover:bg-highlight text-highlight hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-highlight/20 transition-all">Arquivar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {currentReports.length === 0 && (
                        <div className="py-40 text-center opacity-10">
                            <WhistleIcon className="w-20 h-20 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-[0.4em]">Nenhum registro tático</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingIntel;