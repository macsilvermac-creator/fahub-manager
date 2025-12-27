
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { WhistleIcon, ChevronDownIcon, SparklesIcon, ClockIcon } from '../../components/icons/UiIcons';

const TrainingIntel: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [filter, setFilter] = useState('GERAL');

    const reports = [
        { id: 1, unit: 'ATAQUE', title: 'Instalação de Redzone', author: 'Coord. Guto', date: 'Hoje', intensity: 8, summary: 'Execução de rotas slant excelente. Proteção de passe precisa de ajuste no lado cego.', efficiency: '92%' },
        { id: 2, unit: 'DEFESA', title: 'Ajuste de Blitzing', author: 'Coord. Silva', date: 'Ontem', intensity: 9, summary: 'Pressão constante no backfield, gap control precisa de correção no lado B.', efficiency: '78%' },
        { id: 3, unit: 'ST', title: 'Punt Return Timing', author: 'Coach Smith', date: '12/12', intensity: 6, summary: 'Bloqueios de linha 1 sólidos, mas o retorno falhou no switch.', efficiency: '85%' },
        { id: 4, unit: 'INDIVIDUAL', title: 'Feedback QB1', author: 'HC', date: '10/12', intensity: 5, summary: 'Leitura de Safeties melhorando, footwork estável em drops de 3 passos.', efficiency: 'N/A' }
    ];

    const filteredReports = filter === 'GERAL' ? reports : reports.filter(r => r.unit === filter);

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Training Intel" subtitle="Relatórios técnicos das unidades e observações individuais." />

            <div className="flex-1 bg-secondary/30 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl">
                {/* Abas de Filtro Estilo Field */}
                <div className="p-4 border-b border-white/5 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar">
                    {['GERAL', 'ATAQUE', 'DEFESA', 'ST', 'INDIVIDUAL'].map(unit => (
                        <button 
                            key={unit} 
                            onClick={() => setFilter(unit)}
                            className={`px-6 py-2 text-[9px] font-black rounded-full uppercase tracking-widest transition-all ${filter === unit ? 'bg-highlight text-white shadow-glow' : 'bg-white/5 text-text-secondary hover:text-white'}`}
                        >
                            {unit}
                        </button>
                    ))}
                </div>

                {/* Lista Accordion Profissional */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {filteredReports.map((report) => (
                        <div 
                            key={report.id}
                            className={`bg-black/20 rounded-3xl border transition-all duration-300 overflow-hidden ${expandedId === report.id ? 'border-highlight ring-1 ring-highlight/20 bg-black/40' : 'border-white/5 hover:bg-black/30'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                className="w-full p-5 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] italic border border-white/5 ${report.unit === 'ATAQUE' ? 'bg-blue-600/20 text-blue-400' : report.unit === 'DEFESA' ? 'bg-red-600/20 text-red-400' : 'bg-white/10 text-white'}`}>
                                        {report.unit.substring(0,3)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase italic text-sm md:text-lg tracking-tight">{report.title}</h4>
                                        <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest mt-1 opacity-50">
                                            {report.author} • {report.date}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                     <div className="hidden md:block text-right">
                                        <p className="text-[8px] font-black text-text-secondary uppercase">Eficiência</p>
                                        <p className="text-sm font-black text-highlight italic">{report.efficiency}</p>
                                    </div>
                                    <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${expandedId === report.id ? 'rotate-180 text-highlight' : ''}`} />
                                </div>
                            </button>

                            {expandedId === report.id && (
                                <div className="px-5 pb-6 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-5"></div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                                <h5 className="text-[8px] font-black text-highlight uppercase tracking-widest mb-2">Parecer Técnico</h5>
                                                <p className="text-sm text-text-secondary leading-relaxed font-medium">{report.summary}</p>
                                            </div>
                                            
                                            <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-2xl flex gap-3">
                                                <SparklesIcon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <h5 className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-1">IA Technical Insight</h5>
                                                    <p className="text-xs text-purple-200 italic font-medium">"Intensidade {report.intensity}/10 detectada. Padrão de fadiga subindo na OL. Sugerimos recovery ativo amanhã."</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-text-secondary tracking-widest">Nível de Intensidade</p>
                                                <div className="flex gap-1 mt-2">
                                                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                                                        <div key={i} className={`h-4 flex-1 rounded-sm ${i <= report.intensity ? 'bg-highlight' : 'bg-white/5'}`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                            <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all">
                                                Abrir Vídeo do Drill
                                            </button>
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
