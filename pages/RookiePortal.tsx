t React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { Player, IncubationStatus } from '../types';
import { CheckCircleIcon, SparklesIcon, WhistleIcon, TrophyIcon, ShieldCheckIcon, ClockIcon } from '../components/icons/UiIcons';
import { BookIcon } from '../components/icons/NavIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

const RookiePortal: React.FC = () => {
    const toast = useToast();
    const [rookie, setRookie] = useState<Player | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const currentUser = storageService.getCurrentUser();
        const found = storageService.getPlayers().find(p => p.name.includes(currentUser.name));
        if (found) {
            setRookie(found);
            calculateProgress(found);
        }
    }, []);

    const calculateProgress = (p: Player) => {
        let score = 0;
        if (p.incubation?.cultureAccepted) score += 40;
        if (p.incubation?.fundamentalsProgress) score += (p.incubation.fundamentalsProgress * 0.4);
        if (p.registration?.documentStatus === 'COMPLETE') score += 20;
        setProgress(Math.round(score));
    };

    const handleAcceptCulture = () => {
        if (!rookie) return;
        const updated = { 
            ...rookie, 
            incubation: { 
                status: 'FUNDAMENTALS' as IncubationStatus,
                cultureAccepted: true,
                fundamentalsProgress: 0
            } 
        };
        const allPlayers = storageService.getPlayers();
        storageService.savePlayers(allPlayers.map(p => p.id === rookie.id ? updated : p));
        setRookie(updated);
        calculateProgress(updated);
        toast.success("Cultura Gladiators aceita! Bem-vindo à Brotherhood.");
    };

    if (!rookie) return null;

    return (
        <div className="space-y-6 pb-20 animate-fade-in max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-950 via-[#0F172A] to-black p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheckIcon className="w-64 h-64 text-highlight" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em]">Modo Recruta (Incubação)</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                        Jornada de Graduação
                    </h2>
                    <p className="text-text-secondary font-bold text-sm mt-4 opacity-80 max-w-2xl">
                        Olá {rookie.name}. Para se tornar um Gladiador Veterano e liberar o acesso total ao Playbook e Field Days, 
                        você deve completar os fundamentos abaixo.
                    </p>

                    <div className="mt-12 flex flex-col md:flex-row items-end gap-8">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between text-[10px] font-black text-white uppercase mb-2 tracking-widest">
                                <span>Progresso da Graduação</span>
                                <span className="text-highlight">{progress}%</span>
                            </div>
                            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-gradient-to-r from-orange-600 via-yellow-500 to-highlight transition-all duration-1000 shadow-glow" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl text-white px-10 py-4 rounded-[2rem] border border-white/10 text-center min-w-[180px]">
                            <p className="text-[8px] font-black uppercase opacity-60 mb-1">Status Atual</p>
                            <p className="text-2xl font-black italic text-highlight uppercase">{rookie.incubation?.status || 'INIT'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-8 space-y-6">
                    <Card title="1. Ritual de Cultura" className={rookie.incubation?.cultureAccepted ? 'opacity-40 grayscale pointer-events-none' : 'border-highlight/30'}>
                        <div className="space-y-6">
                            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex gap-6">
                                <div className="p-4 bg-highlight/20 rounded-2xl text-highlight h-fit shrink-0"><CheckCircleIcon className="w-8 h-8"/></div>
                                <div>
                                    <h4 className="text-white font-black uppercase italic text-sm">Disciplina & Pontualidade</h4>
                                    <p className="text-xs text-text-secondary leading-relaxed mt-2 italic font-medium">"Chegar cedo é chegar na hora. Chegar na hora é estar atrasado. Chegar atrasado é ser deixado para trás."</p>
                                </div>
                            </div>
                            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 flex gap-6">
                                <div className="p-4 bg-blue-600/20 rounded-2xl text-blue-400 h-fit shrink-0"><WhistleIcon className="w-8 h-8"/></div>
                                <div>
                                    <h4 className="text-white font-black uppercase italic text-sm">Coachability (Treinabilidade)</h4>
                                    <p className="text-xs text-text-secondary leading-relaxed mt-2 italic font-medium">Nenhum atleta é maior que o processo. Receba críticas como combustível para evolução.</p>
                                </div>
                            </div>
                            {!rookie.incubation?.cultureAccepted && (
                                <button 
                                    onClick={handleAcceptCulture}
                                    className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-2xl uppercase italic tracking-widest shadow-glow transition-all active:scale-95"
                                >
                                    Li e aceito a Cultura Gladiators
                                </button>
                            )}
                        </div>
                    </Card>

                    <Card title="2. Academy Basics (Fundamentos Teóricos)">
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: 'Regras Básicas do FA', dur: '10 min', icon: BookIcon, xp: '+20 XP' },
                                { title: 'Segurança & Equipamento', dur: '5 min', icon: ShieldCheckIcon, xp: '+15 XP' },
                                { title: 'Dicionário de Campo', dur: '15 min', icon: SparklesIcon, xp: '+30 XP' },
                            ].map((item, i) => (
                                <div key={i} className="group bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-highlight transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-highlight/20 group-hover:text-highlight transition-colors">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-xs uppercase">{item.title}</h4>
                                            <span className="text-[9px] text-text-secondary uppercase tracking-widest">{item.dur} • <span className="text-highlight">{item.xp}</span></span>
                                        </div>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-white/20 group-hover:text-white" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-4 space-y-6">
                    <Card title="Tryout Score">
                         <div className="flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full border-8 border-highlight/20 flex items-center justify-center relative mb-6">
                                <div className="absolute inset-0 bg-highlight/5 rounded-full blur-xl"></div>
                                <span className="text-6xl font-black text-white italic drop-shadow-glow">{rookie.rating}</span>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Sua Grade de Entrada</p>
                                <div className="bg-highlight/10 text-highlight text-[9px] font-black px-4 py-1.5 rounded-full border border-highlight/20 mt-4 uppercase italic">
                                    Superior à média de Calouros
                                </div>
                            </div>
                         </div>
                    </Card>

                    <div className="bg-secondary p-8 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center">
                        <ClockIcon className="w-12 h-12 text-blue-400 mb-4" />
                        <h4 className="text-white font-black uppercase text-sm italic">Tempo Restante</h4>
                        <p className="text-[10px] text-text-secondary mt-2 leading-relaxed">Faltam <strong>14 dias</strong> para sua graduação ao elenco principal.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RookiePortal;