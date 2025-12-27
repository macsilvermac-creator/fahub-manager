
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { 
    ChevronDownIcon, HeartPulseIcon, CheckCircleIcon, 
    AlertTriangleIcon, ActivityIcon, UsersIcon 
} from '../../components/icons/UiIcons';
import LazyImage from '../../components/LazyImage';

interface WellnessStat {
    label: string;
    value: number;
    color: string;
}

interface MedicalReport {
    id: string;
    name: string;
    position: string;
    avatar: string;
    readiness: number; // 0-100
    stats: WellnessStat[];
    notes: {
        athlete: string;
        specialist?: string;
        source?: string;
    };
}

const MedicalLab: React.FC = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const athletes: MedicalReport[] = [
        {
            id: '1',
            name: 'Lucas Thor',
            position: 'QB',
            avatar: 'https://ui-avatars.com/api/?name=Lucas+Thor&background=059669&color=fff',
            readiness: 45,
            stats: [
                { label: 'Sono', value: 2, color: 'bg-red-500' },
                { label: 'Fadiga', value: 5, color: 'bg-red-500' },
                { label: 'Humor', value: 3, color: 'bg-yellow-500' },
                { label: 'Stress', value: 4, color: 'bg-orange-500' },
                { label: 'Dor', value: 5, color: 'bg-red-500' }
            ],
            notes: {
                athlete: "Acordei com dor aguda no joelho direito após o treino de campo de ontem.",
                specialist: "Atleta avaliado por Fisio. Suspeita de tendinite patelar. Recomendado gelo e repouso de saltos por 48h.",
                source: "Departamento de Fisioterapia"
            }
        },
        {
            id: '2',
            name: 'Guto Strong',
            position: 'LB',
            avatar: 'https://ui-avatars.com/api/?name=Guto+Strong&background=1e293b&color=fff',
            readiness: 95,
            stats: [
                { label: 'Sono', value: 5, color: 'bg-highlight' },
                { label: 'Fadiga', value: 1, color: 'bg-highlight' },
                { label: 'Humor', value: 5, color: 'bg-highlight' },
                { label: 'Stress', value: 1, color: 'bg-highlight' },
                { label: 'Dor', value: 0, color: 'bg-highlight' }
            ],
            notes: {
                athlete: "100% pronto para o snap.",
                specialist: "Apto para contato total.",
                source: "Staff Médico"
            }
        }
    ];

    const Battery = ({ label, value, color }: { label: string, value: number, color: string }) => (
        <div className="flex-1 space-y-1.5">
            <p className="text-[7px] font-black text-text-secondary uppercase text-center">{label}</p>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${(value / 5) * 100}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in pb-20">
            <PageHeader title="Medical Lab" subtitle="Monitoramento biológico e prontidão técnica do elenco." />

            {/* Quick Summary Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">
                <div className="bg-red-900/20 border border-red-500/20 p-6 rounded-[2.5rem] flex items-center gap-4">
                    <AlertTriangleIcon className="w-8 h-8 text-red-500 animate-pulse" />
                    <div>
                        <p className="text-3xl font-black text-white italic leading-none">03</p>
                        <p className="text-[9px] text-red-300 font-bold uppercase tracking-widest">Alerta Crítico</p>
                    </div>
                </div>
                <div className="bg-highlight/10 border border-highlight/20 p-6 rounded-[2.5rem] flex items-center gap-4">
                    <CheckCircleIcon className="w-8 h-8 text-highlight" />
                    <div>
                        <p className="text-3xl font-black text-white italic leading-none">42</p>
                        <p className="text-[9px] text-green-300 font-bold uppercase tracking-widest">Aptos 100%</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-8 overflow-y-auto space-y-3 custom-scrollbar">
                    {athletes.map(athlete => (
                        <div 
                            key={athlete.id} 
                            className={`bg-secondary/40 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${expandedId === athlete.id ? 'border-white/20 bg-black/40' : 'border-white/5 hover:bg-white/5'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === athlete.id ? null : athlete.id)}
                                className="w-full p-6 flex flex-col lg:flex-row items-center justify-between text-left gap-8"
                            >
                                <div className="flex items-center gap-5 w-full lg:w-1/4">
                                    <div className="relative shrink-0">
                                        <LazyImage src={athlete.avatar} className="w-16 h-16 rounded-full border-2 border-white/10" />
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-secondary ${athlete.readiness > 80 ? 'bg-highlight' : athlete.readiness > 50 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-white font-black uppercase italic text-lg truncate leading-none">{athlete.name}</h4>
                                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-2">{athlete.position} • Prontidão: {athlete.readiness}%</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 w-full lg:w-2/4 px-6 bg-black/30 p-4 rounded-3xl border border-white/5">
                                    {athlete.stats.map(s => <Battery key={s.label} {...s} />)}
                                </div>

                                <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform duration-500 ${expandedId === athlete.id ? 'rotate-180 text-white' : ''}`} />
                            </button>

                            {expandedId === athlete.id && (
                                <div className="px-10 pb-10 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-8"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <div>
                                                <h5 className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                                    <ActivityIcon className="w-4 h-4"/> Check-in do Atleta
                                                </h5>
                                                <p className="text-white text-sm italic font-medium leading-relaxed bg-black/20 p-5 rounded-3xl border border-white/5">
                                                    "{athlete.notes.athlete}"
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <h5 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                                    <HeartPulseIcon className="w-4 h-4"/> Parecer Técnico Saúde
                                                </h5>
                                                <div className="bg-red-600/5 border border-red-500/20 p-5 rounded-3xl space-y-3">
                                                    <p className="text-red-100 text-xs font-bold leading-relaxed">
                                                        {athlete.notes.specialist}
                                                    </p>
                                                    <div className="flex justify-between items-center pt-3 border-t border-red-500/10">
                                                        <span className="text-[8px] font-black text-red-400 uppercase">{athlete.notes.source}</span>
                                                        <button className="text-[8px] font-black text-white bg-red-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Abrir Dossiê</button>
                                                    </div>
                                                </div>
                                            </div>
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

export default MedicalLab;