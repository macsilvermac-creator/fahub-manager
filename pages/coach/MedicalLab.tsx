
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { 
    HeartPulseIcon, ChevronDownIcon, CheckCircleIcon, 
    AlertTriangleIcon, ShieldCheckIcon, ActivityIcon 
} from '../../components/icons/UiIcons';
import LazyImage from '../../components/LazyImage';

const MedicalLab: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const athletes = [
        { id: 1, name: 'Lucas Thor', pos: 'QB', status: 'RISK', sleep: 2, fatigue: 5, stress: 4, soreness: 5, mood: 2, medical: 'Tendinite Patelar - Nível 2', restricted: true, avatar: 'https://ui-avatars.com/api/?name=Lucas+Thor&background=ef4444&color=fff', fisio: 'Indicado repouso total de saltos. Focar em ativação de glúteo médio.', nutri: 'Suplementação de Magnésio aumentada.', psico: 'Relato de ansiedade pré-jogo nível 3.' },
        { id: 2, name: 'Guto Strong', pos: 'LB', status: 'OPTIMAL', sleep: 5, fatigue: 2, stress: 2, soreness: 1, mood: 5, medical: 'Apto para Campo', restricted: false, avatar: 'https://ui-avatars.com/api/?name=Guto+Strong&background=059669&color=fff', fisio: 'Sem restrições.', nutri: 'Peso estabilizado em 110kg.', psico: 'Foco excelente.' },
        { id: 3, name: 'Pedro Flash', pos: 'WR', status: 'WARNING', sleep: 3, fatigue: 4, stress: 3, soreness: 4, mood: 3, medical: 'Edema Ósseo (Monitorar)', restricted: true, avatar: 'https://ui-avatars.com/api/?name=Pedro+Flash&background=fbbf24&color=fff', fisio: 'Liberado para corrida linear. Sem mudanças de direção.', nutri: 'Ajuste de carboidratos para recuperação.', psico: 'Humor flutuante.' }
    ];

    const Battery = ({ label, value, inverse = false }: { label: string, value: number, inverse?: boolean }) => {
        const percent = (value / 5) * 100;
        const getColor = () => {
            if (inverse) {
                if (value >= 4) return 'bg-red-500';
                if (value >= 3) return 'bg-yellow-500';
                return 'bg-highlight';
            }
            if (value <= 2) return 'bg-red-500';
            if (value <= 3) return 'bg-yellow-500';
            return 'bg-highlight';
        };

        return (
            <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[6px] font-black text-text-secondary uppercase tracking-[0.2em] px-1">
                    <span>{label}</span>
                    <span>{value}/5</span>
                </div>
                <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <div className={`h-full transition-all duration-1000 ${getColor()}`} style={{ width: `${percent}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Medical Lab" subtitle="Giro de Prontidão: Monitoramento biomecânico e clínico." />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                <div className="bg-red-900/20 border border-red-500/20 p-5 rounded-[2rem] flex items-center gap-5 shadow-xl">
                    <div className="p-3 bg-red-600 rounded-2xl shadow-glow-red"><AlertTriangleIcon className="w-6 h-6 text-white animate-pulse" /></div>
                    <div><p className="text-3xl font-black text-white italic leading-none">03</p><p className="text-[9px] text-red-300 font-black uppercase mt-2">Críticos</p></div>
                </div>
                <div className="bg-highlight/10 border border-highlight/20 p-5 rounded-[2rem] flex items-center gap-5 shadow-xl">
                    <div className="p-3 bg-highlight rounded-2xl shadow-glow"><CheckCircleIcon className="w-6 h-6 text-white" /></div>
                    <div><p className="text-3xl font-black text-white italic leading-none">42</p><p className="text-[9px] text-green-300 font-black uppercase mt-2">Aptos</p></div>
                </div>
            </div>

            {/* ATHLETE READINESS LIBRARY */}
            <div className="flex-1 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar">
                    {athletes.map(athlete => (
                        <div 
                            key={athlete.id}
                            className={`bg-secondary/40 rounded-[2rem] border transition-all duration-500 overflow-hidden ${expandedId === athlete.id ? 'border-white/20 bg-black/40' : 'border-white/5 hover:bg-black/30'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === athlete.id ? null : athlete.id)}
                                className="w-full p-5 flex flex-col lg:flex-row items-center justify-between text-left gap-6"
                            >
                                <div className="flex items-center gap-5 w-full lg:w-1/4">
                                    <div className="relative shrink-0">
                                        <LazyImage src={athlete.avatar} className="w-14 h-14 rounded-full border-2 border-white/10" />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-secondary ${athlete.status === 'RISK' ? 'bg-red-500 animate-pulse' : athlete.status === 'WARNING' ? 'bg-yellow-500' : 'bg-highlight'}`}></div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white font-black uppercase italic text-sm truncate">{athlete.name}</h4>
                                            {athlete.restricted && <ShieldCheckIcon className="w-3 h-3 text-red-500 animate-pulse" />}
                                        </div>
                                        <p className="text-[9px] text-text-secondary uppercase font-black opacity-60">{athlete.pos} • {athlete.medical}</p>
                                    </div>
                                </div>

                                {/* Wellness Grid */}
                                <div className="flex gap-4 w-full lg:w-2/4 px-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <Battery label="SONO" value={athlete.sleep} />
                                    <Battery label="FADIGA" value={athlete.fatigue} inverse />
                                    <Battery label="STRESS" value={athlete.stress} inverse />
                                    <Battery label="DOR" value={athlete.soreness} inverse />
                                    <Battery label="HUMOR" value={athlete.mood} />
                                </div>

                                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-500 ${expandedId === athlete.id ? 'rotate-180 text-white' : ''}`} />
                            </button>

                            {/* MEDICAL INSIGHTS EXPANDED */}
                            {expandedId === athlete.id && (
                                <div className="px-6 pb-8 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-6"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-red-600/5 border border-red-500/20 p-5 rounded-2xl">
                                            <h5 className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2"><ActivityIcon className="w-3 h-3"/> Fisioterapia</h5>
                                            <p className="text-xs text-text-secondary italic leading-relaxed">"{athlete.fisio}"</p>
                                        </div>
                                        <div className="bg-blue-600/5 border border-blue-500/20 p-5 rounded-2xl">
                                            <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ActivityIcon className="w-3 h-3"/> Nutrição</h5>
                                            <p className="text-xs text-text-secondary italic leading-relaxed">"{athlete.nutri}"</p>
                                        </div>
                                        <div className="bg-purple-600/5 border border-purple-500/20 p-5 rounded-2xl">
                                            <h5 className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ActivityIcon className="w-3 h-3"/> Psicologia</h5>
                                            <p className="text-xs text-text-secondary italic leading-relaxed">"{athlete.psico}"</p>
                                        </div>
                                    </div>
                                    <button className="mt-6 w-full py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase italic tracking-tighter shadow-lg">Abrir Dossiê Médico Completo</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MedicalLab;