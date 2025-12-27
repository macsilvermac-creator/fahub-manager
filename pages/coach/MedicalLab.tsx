
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { HeartPulseIcon, ChevronDownIcon, CheckCircleIcon, AlertTriangleIcon, ActivityIcon } from '../../components/icons/UiIcons';
import LazyImage from '../../components/LazyImage';

const MedicalLab: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const athletesHealth = [
        { id: 1, name: 'Lucas Thor', pos: 'QB', status: 'CRITICO', wellness: { sleep: 2, fatigue: 5, soreness: 4 }, notes: 'Atleta apresenta fadiga central elevada. Fisioterapia recomenda repouso total de contatos.', staffNotes: { fisio: 'Tendinite Patelar Nível 2', nutri: 'Suplementação de Magnésio ajustada' }, avatar: 'https://ui-avatars.com/api/?name=Lucas+Thor&background=ef4444&color=fff' },
        { id: 2, name: 'Guto Strong', pos: 'LB', status: 'OK', wellness: { sleep: 5, fatigue: 2, soreness: 1 }, notes: 'Pronto para intensidade máxima.', staffNotes: { fisio: 'Apto', pisco: 'Foco e humor estáveis' }, avatar: 'https://ui-avatars.com/api/?name=Guto+Strong&background=059669&color=fff' },
        { id: 3, name: 'Pedro Flash', pos: 'WR', status: 'ALERTA', wellness: { sleep: 3, fatigue: 4, soreness: 3 }, notes: 'Monitorar dor no tornozelo após drills de mudança de direção.', staffNotes: { fisio: 'Fortalecimento preventivo iniciado' }, avatar: 'https://ui-avatars.com/api/?name=Pedro+Flash&background=fbbf24&color=fff' }
    ];

    const WellnessBar = ({ label, value, color }: any) => (
        <div className="flex-1 space-y-1">
            <p className="text-[7px] font-black text-text-secondary uppercase">{label}</p>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${(value/5)*100}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full pb-20">
            <PageHeader title="Medical Lab" subtitle="Giro de Prontidão: Monitoramento biomecânico e clínico do elenco." />

            <div className="flex-1 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-6 overflow-y-auto space-y-3 custom-scrollbar">
                    {athletesHealth.map(athlete => (
                        <div 
                            key={athlete.id}
                            className={`bg-secondary/40 rounded-2xl border transition-all overflow-hidden ${expandedId === athlete.id ? 'border-highlight bg-black/40 shadow-glow-small' : 'border-white/5 hover:bg-white/5'}`}
                        >
                            <button 
                                onClick={() => setExpandedId(expandedId === athlete.id ? null : athlete.id)}
                                className="w-full p-5 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-5 flex-1">
                                    <div className="relative shrink-0">
                                        <LazyImage src={athlete.avatar} className="w-12 h-12 rounded-full border border-white/10" />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-secondary ${athlete.status === 'CRITICO' ? 'bg-red-500 animate-pulse' : athlete.status === 'ALERTA' ? 'bg-yellow-500' : 'bg-highlight'}`}></div>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-white font-bold uppercase text-sm truncate">{athlete.name}</h4>
                                        <p className="text-[9px] text-text-secondary uppercase font-bold tracking-widest">{athlete.pos} • {athlete.status}</p>
                                    </div>
                                    <div className="hidden md:flex gap-4 flex-1 max-w-xs mx-8">
                                        <WellnessBar label="Sono" value={athlete.wellness.sleep} color="bg-blue-400" />
                                        <WellnessBar label="Fadiga" value={athlete.wellness.fatigue} color="bg-red-500" />
                                        <WellnessBar label="Dor" value={athlete.wellness.soreness} color="bg-orange-500" />
                                    </div>
                                </div>
                                <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform ${expandedId === athlete.id ? 'rotate-180 text-highlight' : ''}`} />
                            </button>

                            {expandedId === athlete.id && (
                                <div className="px-6 pb-6 animate-slide-up">
                                    <div className="h-px bg-white/5 mb-6"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                                <h5 className="text-[9px] font-black text-highlight uppercase tracking-widest mb-2 flex items-center gap-2">
                                                    <ActivityIcon className="w-3 h-3"/> Auto-relato Atleta
                                                </h5>
                                                <p className="text-xs text-text-secondary italic leading-relaxed">"{athlete.notes}"</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Pareceres do Staff Saúde</h5>
                                            {athlete.staffNotes.fisio && (
                                                <div className="flex gap-3 text-xs bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <span className="text-highlight font-bold">FISIO:</span>
                                                    <span className="text-text-secondary">{athlete.staffNotes.fisio}</span>
                                                </div>
                                            )}
                                            {athlete.staffNotes.nutri && (
                                                <div className="flex gap-3 text-xs bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <span className="text-highlight font-bold">NUTRI:</span>
                                                    <span className="text-text-secondary">{athlete.staffNotes.nutri}</span>
                                                </div>
                                            )}
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