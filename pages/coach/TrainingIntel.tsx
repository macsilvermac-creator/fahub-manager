
import React, { useState, useContext } from 'react';
import PageHeader from '../../components/PageHeader';
import { WhistleIcon, ChevronDownIcon, SparklesIcon, ClockIcon, ActivityIcon } from '../../components/icons/UiIcons';
import { UserContext } from '../../components/Layout';

const TrainingIntel: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState('GERAL');

    const reports = [
        { id: 1, unit: 'ATAQUE', title: 'Leitura de Blitz Cover 0', author: 'Coord. Guto', date: 'Hoje', intensity: 9, summary: 'A linha ofensiva identificou a pressão, mas o Hot Route do WR2 foi executado fora do tempo. Precisamos de mais reps de timing.', efficiency: '82%', new: true },
        { id: 2, unit: 'DEFESA', title: 'Gap Control Training', author: 'Coord. Silva', date: 'Ontem', intensity: 7, summary: 'Excelente contenção nos gaps A e B. O Linebacker Pedro demonstrou evolução na leitura de ombro do Guard.', efficiency: '95%', new: false },
        { id: 3, unit: 'ST', title: 'Kickoff Coverage Lane', author: 'Coach Smith', date: '12/12', intensity: 6, summary: 'Manutenção de raia inconsistente no lado direito. Risco de retorno longo detectado.', efficiency: '70%', new: false },
        { id: 4, unit: 'INDIVIDUAL', title: 'Mecânica QB1', author: 'HC', date: '10/12', intensity: 5, summary: 'Trabalho de pés em drops de 5 passos está estável. Foco agora na velocidade de release.', efficiency: 'N/A', new: true }
    ];

    // Simulação de Filtro de Permissão
    const filteredReports = reports.filter(r => {
        if (activeTab === 'GERAL') return true;
        return r.unit === activeTab;
    }).filter(r => {
        if (currentRole === 'MASTER' || currentRole === 'HEAD_COACH') return true;
        if (currentRole === 'OFFENSIVE_COORD') return r.unit === 'ATAQUE' || r.unit === 'INDIVIDUAL';
        if (currentRole === 'DEFENSIVE_COORD') return r.unit === 'DEFESA' || r.unit === 'INDIVIDUAL';
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Training Intel" subtitle="Relatórios técnicos e feedback de performance das unidades." />

            <div className="flex-1 bg-secondary/30 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl">
                {/* Tabs de Unidade Style Field */}
                <div className="p-4 border-b border-white/5 bg-black/20 flex gap-2 overflow-x-auto no-scrollbar">
                    {['GERAL', 'ATAQUE', 'DEFESA', 'ST', 'INDIVIDUAL'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2.5 text-[9px] font-black rounded-full uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-highlight text-white shadow-glow' : 'bg-white/5 text-text-secondary hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tactical Accordion List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {filteredReports.map((report) => (
                        <div 
                            key={report.id}
                            className={`bg-black/20 rounded-[2rem] border transition-all duration-500 overflow-hidden ${expandedId === report.id ? 'border-highlight ring-1 ring-highlight/20 bg-black/40' : 'border-white/5 hover:bg-black/30'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                                className="w-full p-6 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs italic border border-white/10 ${report.unit === 'ATAQUE' ? 'bg-blue-600/20 text-blue-400' : report.unit === 'DEFESA' ? 'bg-red-600/20 text-red-400' : 'bg-highlight/20 text-highlight'}`}>
                                            {report.unit.substring(0,3)}
                                        </div>
                                        {report.new && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-primary animate-pulse shadow-glow-red"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase italic text-lg tracking-tighter">{report.title}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest opacity-50">{report.author} • {report.date}</p>
                                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                            <span className="text-[9px] font-black text-highlight uppercase">Intensidade: {report.intensity}/10</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                     <div className="hidden md:block text-right">
                                        <p className="text-[8px] font-black text-text-secondary uppercase tracking-widest">Eficiência</p>
                                        <p className="text-lg font-black text-highlight italic">{report.efficiency}</p>
                                    </div>
                                    <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-500 ${expandedId === report.id ? 'rotate-180 text-highlight' : ''}`} />
                                </div>
                            </button>

                            {/* Expanded Content: The "Tear Effect" */}
                            {expandedId === report.id && (
                                <div className="px-6 pb-8 animate-slide-up">
                                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                                <h5 className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] mb-3">Análise de Campo</h5>
                                                <p className="text-sm text-text-secondary leading-relaxed font-medium italic">"{report.summary}"</p>
                                            </div>
                                            
                                            <div className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-3xl flex gap-4 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                                    <SparklesIcon className="w-16 h-16 text-purple-400" />
                                                </div>
                                                <SparklesIcon className="w-6 h-6 text-purple-400 shrink-0" />
                                                <div>
                                                    <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-2">IA Tactical Insight</h5>
                                                    <p className="text-xs text-purple-100 font-medium leading-relaxed">
                                                        Detectamos um padrão de fadiga na unidade de {report.unit}. 
                                                        A eficiência caiu 12% nos drills finais. Recomendamos reduzir o volume de contatos no treino de amanhã para evitar lesões de tecido mole.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="bg-black/40 p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                                                <ActivityIcon className="w-10 h-10 text-highlight mb-3" />
                                                <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest">Vídeo da Sessão</p>
                                                <button className="mt-4 w-full py-3 bg-white text-black font-black rounded-xl text-[10px] uppercase italic tracking-tighter hover:bg-highlight hover:text-white transition-all">Abrir Filmagem</button>
                                            </div>
                                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all italic">Adicionar Anotação</button>
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