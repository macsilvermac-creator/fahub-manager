
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { HeartPulseIcon, ChevronDownIcon, ActivityIcon, AlertTriangleIcon, CheckCircleIcon } from '../../components/icons/UiIcons';
import LazyImage from '../../components/LazyImage';

const MedicalLab: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const athletes = [
        { id: 1, name: 'Lucas Thor', pos: 'QB', status: 'RISK', sleep: 2, fatigue: 5, stress: 4, medical: 'Tendinite Leve (Fisio)', avatar: 'https://ui-avatars.com/api/?name=Lucas+Thor&background=059669&color=fff' },
        { id: 2, name: 'Guto Strong', pos: 'LB', status: 'OPTIMAL', sleep: 5, fatigue: 2, stress: 2, medical: 'Apto para Campo', avatar: 'https://ui-avatars.com/api/?name=Guto+Strong&background=3b82f6&color=fff' },
        { id: 3, name: 'Pedro Flash', pos: 'WR', status: 'WARNING', sleep: 3, fatigue: 4, stress: 3, medical: 'Restrição de Impacto', avatar: 'https://ui-avatars.com/api/?name=Pedro+Flash&background=fbbf24&color=fff' },
        { id: 4, name: 'Marcos Tank', pos: 'DL', status: 'OPTIMAL', sleep: 4, fatigue: 3, stress: 2, medical: 'Apto para Campo', avatar: 'https://ui-avatars.com/api/?name=Marcos+Tank&background=1e293b&color=fff' }
    ];

    const MetricBateria = ({ label, value, color }: any) => (
        <div className="space-y-1 flex-1 min-w-[50px]">
            <div className="flex justify-between text-[6px] font-black text-text-secondary uppercase">
                <span>{label}</span>
            </div>
            <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full ${color}`} style={{ width: `${(value/5)*100}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Medical Lab" subtitle="Monitoramento de fadiga, prontidão e alertas médicos." />

            {/* Sumário de Risco */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                <div className="bg-red-900/20 border border-red-500/20 p-4 rounded-3xl flex items-center gap-4">
                    <div className="p-2 bg-red-500 rounded-xl shadow-glow-red"><AlertTriangleIcon className="w-5 h-5 text-white animate-pulse" /></div>
                    <div><p className="text-2xl font-black text-white italic leading-none">03</p><p className="text-[8px] text-red-300 font-bold uppercase tracking-widest mt-1">Alta Fadiga</p></div>
                </div>
                <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-3xl flex items-center gap-4">
                    <div className="p-2 bg-highlight rounded-xl shadow-glow"><CheckCircleIcon className="w-5 h-5 text-white" /></div>
                    <div><p className="text-2xl font-black text-white italic leading-none">42</p><p className="text-[8px] text-green-300 font-bold uppercase tracking-widest mt-1">Prontos</p></div>
                </div>
            </div>

            {/* Lista de Atletas */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {athletes.map(athlete => (
                    <div 
                        key={athlete.id}
                        className={`bg-secondary/40 rounded-[2rem] border transition-all overflow-hidden ${expandedId === athlete.id ? 'border-red-500/50 bg-black/40' : 'border-white/5 hover:bg-black/30'}`}
                    >
                        <button 
                            onClick={() => setExpandedId(expandedId === athlete.id ? null : athlete.id)}
                            className="w-full p-5 flex flex-col md:flex-row items-center justify-between text-left gap-4"
                        >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="relative shrink-0">
                                    {/* Fix: Changed athlete.avatarUrl to athlete.avatar to match the data structure */}
                                    <LazyImage src={athlete.avatar} className="w-12 h-12 rounded-full border-2 border-white/10" />
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-secondary ${athlete.status === 'RISK' ? 'bg-red-500 animate-pulse' : athlete.status === 'WARNING' ? 'bg-yellow-500' : 'bg-highlight'}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-black uppercase italic text-sm truncate">{athlete.name}</h4>
                                    <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest opacity-60 mt-0.5">{athlete.pos} • {athlete.medical}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 w-full md:w-1/3 px-2">
                                <MetricBateria label="SONO" value={athlete.sleep} color="bg-blue-400" />
                                <MetricBateria label="FADIGA" value={athlete.fatigue} color="bg-red-500" />
                                <MetricBateria label="STRESS" value={athlete.stress} color="bg-yellow-500" />
                            </div>

                            <ChevronDownIcon className={`w-5 h-5 text-text-secondary shrink-0 transition-transform ${expandedId === athlete.id ? 'rotate-180 text-white' : ''}`} />
                        </button>

                        {expandedId === athlete.id && (
                            <div className="px-6 pb-6 animate-fade-in">
                                <div className="h-px bg-white/5 mb-4"></div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex gap-4 items-start">
                                    <div className="bg-highlight/10 p-2 rounded-lg text-highlight font-black text-[8px] uppercase shrink-0">Parecer</div>
                                    <p className="text-xs text-text-secondary italic leading-relaxed font-medium">
                                        "Atleta reportou fadiga central elevada. Dados sugerem que o volume de treino está afetando a qualidade do sono. Recomendado monitorar RPE no treino de hoje."
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MedicalLab;