
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { HeartPulseIcon, ChevronDownIcon, ActivityIcon, AlertTriangleIcon, CheckCircleIcon, ShieldCheckIcon } from '../../components/icons/UiIcons';
import LazyImage from '../../components/LazyImage';

const MedicalLab: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const athletes = [
        { id: 1, name: 'Lucas Thor', pos: 'QB', status: 'RISK', sleep: 2, fatigue: 5, stress: 4, soreness: 5, mood: 2, medical: 'Tendinite Patelar - Nível 2', restricted: true, avatar: 'https://ui-avatars.com/api/?name=Lucas+Thor&background=ef4444&color=fff' },
        { id: 2, name: 'Guto Strong', pos: 'LB', status: 'OPTIMAL', sleep: 5, fatigue: 2, stress: 2, soreness: 1, mood: 5, medical: 'Apto para Campo', restricted: false, avatar: 'https://ui-avatars.com/api/?name=Guto+Strong&background=059669&color=fff' },
        { id: 3, name: 'Pedro Flash', pos: 'WR', status: 'WARNING', sleep: 3, fatigue: 4, stress: 3, soreness: 4, mood: 3, medical: 'Edema Ósseo (Monitorar)', restricted: true, avatar: 'https://ui-avatars.com/api/?name=Pedro+Flash&background=fbbf24&color=fff' },
        { id: 4, name: 'Marcos Tank', pos: 'DL', status: 'OPTIMAL', sleep: 4, fatigue: 3, stress: 2, soreness: 2, mood: 4, medical: 'Apto para Campo', restricted: false, avatar: 'https://ui-avatars.com/api/?name=Marcos+Tank&background=1e293b&color=fff' }
    ];

    // Ordenação: Risco Primeiro
    const sortedAthletes = [...athletes].sort((a, b) => {
        if (a.status === 'RISK') return -1;
        if (b.status === 'RISK') return 1;
        return 0;
    });

    const MetricBattery = ({ label, value, inverse = false }: { label: string, value: number, inverse?: boolean }) => {
        // value 1-5
        // inverse: true means higher is worse (fatigue, stress, soreness)
        const getPercent = () => (value / 5) * 100;
        const getColor = () => {
            const p = getPercent();
            if (inverse) {
                if (p > 70) return 'bg-red-500 shadow-glow-red';
                if (p > 40) return 'bg-yellow-500';
                return 'bg-highlight';
            } else {
                if (p < 40) return 'bg-red-500 shadow-glow-red';
                if (p < 70) return 'bg-yellow-500';
                return 'bg-highlight';
            }
        };

        return (
            <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-[6px] font-black text-text-secondary uppercase tracking-widest px-1">
                    <span>{label}</span>
                    <span>{value}/5</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                        className={`h-full transition-all duration-1000 ${getColor()}`} 
                        style={{ width: `${getPercent()}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Medical Lab" subtitle="Giro de Prontidão: Monitoramento biomecânico e wellness do elenco." />

            {/* Top Summaries */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
                <div className="bg-red-900/20 border border-red-500/20 p-5 rounded-[2rem] flex items-center gap-5 shadow-xl">
                    <div className="p-3 bg-red-500 rounded-2xl shadow-glow-red"><AlertTriangleIcon className="w-6 h-6 text-white animate-pulse" /></div>
                    <div><p className="text-3xl font-black text-white italic leading-none">03</p><p className="text-[9px] text-red-300 font-bold uppercase tracking-[0.2em] mt-2">Críticos</p></div>
                </div>
                <div className="bg-highlight/10 border border-highlight/20 p-5 rounded-[2rem] flex items-center gap-5 shadow-xl">
                    <div className="p-3 bg-highlight rounded-2xl shadow-glow"><CheckCircleIcon className="w-6 h-6 text-white" /></div>
                    <div><p className="text-3xl font-black text-white italic leading-none">42</p><p className="text-[9px] text-green-300 font-bold uppercase tracking-[0.2em] mt-2">Aptos</p></div>
                </div>
            </div>

            {/* Readiness Matrix */}
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-1">
                {sortedAthletes.map(athlete => (
                    <div 
                        key={athlete.id}
                        className={`bg-secondary/40 backdrop-blur-xl rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${expandedId === athlete.id ? 'border-white/20 bg-black/40 shadow-2xl' : 'border-white/5 hover:bg-black/30 shadow-lg'}`}
                    >
                        <button 
                            onClick={() => setExpandedId(expandedId === athlete.id ? null : athlete.id)}
                            className="w-full p-6 flex flex-col lg:flex-row items-center justify-between text-left gap-6"
                        >
                            <div className="flex items-center gap-5 w-full lg:w-1/4">
                                <div className="relative shrink-0">
                                    <LazyImage src={athlete.avatar} className="w-16 h-16 rounded-full border-2 border-white/10 object-cover" />
                                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-secondary ${athlete.status === 'RISK' ? 'bg-red-500 animate-pulse shadow-glow-red' : athlete.status === 'WARNING' ? 'bg-yellow-500' : 'bg-highlight'}`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-white font-black uppercase italic text-base truncate">{athlete.name}</h4>
                                        {athlete.restricted && <ShieldCheckIcon className="w-4 h-4 text-red-500 shadow-glow-red" title="Restrição Médica" />}
                                    </div>
                                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-[0.2em] opacity-60 mt-1">{athlete.pos} • {athlete.medical}</p>
                                </div>
                            </div>

                            {/* Wellness Batteries */}
                            <div className="flex gap-4 w-full lg:w-2/4 px-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                                <MetricBattery label="SONO" value={athlete.sleep} />
                                <MetricBattery label="FADIGA" value={athlete.fatigue} inverse />
                                <MetricBattery label="STRESS" value={athlete.stress} inverse />
                                <MetricBattery label="DOR" value={athlete.soreness} inverse />
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <div className="hidden lg:block text-right">
                                    <p className="text-[8px] font-black text-text-secondary uppercase tracking-widest">Status</p>
                                    <p className={`text-xs font-black uppercase italic ${athlete.status === 'RISK' ? 'text-red-500' : athlete.status === 'WARNING' ? 'text-yellow-500' : 'text-highlight'}`}>{athlete.status}</p>
                                </div>
                                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-500 ${expandedId === athlete.id ? 'rotate-180 text-white' : ''}`} />
                            </div>
                        </button>

                        {/* Expanded Medical Insight */}
                        {expandedId === athlete.id && (
                            <div className="px-8 pb-8 animate-slide-up">
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-3xl">
                                        <h5 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-3">Parecer da Fisioterapia</h5>
                                        <p className="text-sm text-text-secondary italic leading-relaxed font-medium">
                                            "Atleta reportou dor aguda na fase de desaceleração. Teste de gaveta negativo, mas apresenta sensibilidade supra-patelar. Recomendado: Redução de 50% nas reps de Indy e zero reps de Team hoje."
                                        </p>
                                        <div className="mt-6 flex gap-3">
                                            <span className="bg-red-500/10 text-red-400 text-[9px] font-black px-3 py-1 rounded-full border border-red-500/20">SEM CONTATO</span>
                                            <span className="bg-white/5 text-text-secondary text-[9px] font-black px-3 py-1 rounded-full border border-white/10">FISIO: DR. MARCOS</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-secondary/40 p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                                        <div>
                                            <h5 className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] mb-4">Wellness History</h5>
                                            <div className="flex items-end gap-1 h-20">
                                                {[3,4,2,5,3,4,2].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group">
                                                        <div className={`absolute bottom-0 w-full rounded-t-lg transition-all ${h > 3 ? 'bg-highlight' : 'bg-red-500'}`} style={{ height: `${(h/5)*100}%` }}></div>
                                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-[8px] bg-black p-1 rounded font-bold transition-opacity">Dia {i+1}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="mt-6 w-full py-3 bg-highlight text-white font-black rounded-xl text-[10px] uppercase shadow-glow active:scale-95 transition-all">Histórico Médico Completo</button>
                                    </div>
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