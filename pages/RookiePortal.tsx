import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { storageService } from '@/services/storageService';
import { Player, IncubationStatus } from '@/types';
import { CheckCircleIcon, SparklesIcon, WhistleIcon, TrophyIcon, ShieldCheckIcon } from '@/components/icons/UiIcons';
import { BookIcon } from '@/components/icons/NavIcons';
import { useToast } from '@/contexts/ToastContext';
import LazyImage from '@/components/LazyImage';

const RookiePortal: React.FC = () => {
    const toast = useToast();
    const [rookie, setRookie] = useState<Player | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const found = storageService.getPlayers().find(p => p.status === 'INCUBATING');
        if (found) {
            setRookie(found);
            calculateProgress(found);
        }
    }, []);

    const calculateProgress = (p: Player) => {
        let score = 0;
        if (p.incubation?.cultureAccepted) score += 20;
        if (p.incubation?.fundamentalsProgress) score += (p.incubation.fundamentalsProgress * 0.3);
        if (p.incubation?.fieldEvaluationScore) score += 50;
        setProgress(Math.round(score));
    };

    const handleAcceptCulture = () => {
        if (!rookie) return;
        const updated = { 
            ...rookie, 
            incubation: { ...rookie.incubation!, cultureAccepted: true, status: 'FUNDAMENTALS' as IncubationStatus } 
        };
        storageService.savePlayers(storageService.getPlayers().map(p => p.id === rookie.id ? updated : p));
        setRookie(updated);
        calculateProgress(updated);
        toast.success("Cultura Gladiators aceita! Bem-vindo à família.");
    };

    if (!rookie) return (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 animate-pulse">
            <SparklesIcon className="w-20 h-20 mb-4" />
            <p className="font-black uppercase tracking-widest">Nenhum Atleta em Incubação</p>
        </div>
    );

    return (
        <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-900 via-[#0F172A] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheckIcon className="w-64 h-64 text-purple-500" />
                </div>
                
                <div className="relative z-10">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Incubadora de Gladiadores</span>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mt-2 leading-none">Status de Prontidão</h2>
                    <p className="text-text-secondary font-bold text-sm mt-2 opacity-80">Seja bem-vindo, {rookie.name}. Sua jornada para o Roster Principal começa aqui.</p>

                    <div className="mt-10">
                        <div className="flex justify-between text-[10px] font-black text-white uppercase mb-2">
                            <span>Progresso de Formação</span>
                            <span className="text-purple-400">{progress}%</span>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-gradient-to-r from-purple-600 to-highlight transition-all duration-1000 shadow-glow" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                    <Card title="1. Pilares da Cultura" className={rookie.incubation?.cultureAccepted ? 'opacity-50' : ''}>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4">
                                <div className="p-3 bg-highlight/20 rounded-xl text-highlight h-fit"><CheckCircleIcon className="w-6 h-6"/></div>
                                <div>
                                    <h4 className="text-white font-bold uppercase italic text-sm">Disciplina Acima de Tudo</h4>
                                    <p className="text-xs text-text-secondary leading-relaxed mt-1">Nenhum indivíduo é maior que o time. Chegar cedo é chegar na hora. Chegar na hora é estar atrasado.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4">
                                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 h-fit"><WhistleIcon className="w-6 h-6"/></div>
                                <div>
                                    <h4 className="text-white font-bold uppercase italic text-sm">Mentalidade de Aprendizado</h4>
                                    <p className="text-xs text-text-secondary leading-relaxed mt-1">Esteja aberto a correções. A falha no treino é o caminho para o sucesso no jogo.</p>
                                </div>
                            </div>
                            {!rookie.incubation?.cultureAccepted && (
                                <button onClick={handleAcceptCulture} className="w-full bg-highlight text-white font-black py-4 rounded-2xl uppercase text-xs shadow-lg hover:scale-[1.02] transition-all">Li e Aceito a Cultura Gladiators</button>
                            )}
                        </div>
                    </Card>

                    <Card title="2. Fundamentos de Futebol (Vídeos)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Dinâmica do Tackle', dur: '5 min', status: 'TODO' },
                                { title: 'Rotas de Recebedores', dur: '8 min', status: 'TODO' },
                                { title: 'Safety First: Equipamento', dur: '12 min', status: 'DONE' },
                            ].map((v, i) => (
                                <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-purple-500">
                                    <div>
                                        <h5 className="text-white font-bold text-xs uppercase">{v.title}</h5>
                                        <span className="text-[9px] text-text-secondary uppercase">{v.dur}</span>
                                    </div>
                                    {v.status === 'DONE' ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <BookIcon className="w-4 h-4 opacity-20 group-hover:opacity-100" />}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-4 space-y-6">
                    <Card title="Métricas de Entrada">
                         <div className="space-y-4">
                             <div className="text-center bg-black/40 p-6 rounded-3xl border border-white/5">
                                 <p className="text-[10px] font-black text-text-secondary uppercase mb-1">Draft Grade (Tryout)</p>
                                 <p className="text-5xl font-black text-highlight italic leading-none">{rookie.rating}</p>
                             </div>
                             <div className="space-y-2">
                                 <p className="text-[9px] font-black text-text-secondary uppercase ml-1">Feedback do Coach</p>
                                 <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 text-[10px] text-blue-300 italic leading-relaxed">
                                     "Grande explosão inicial no shuttle run. Focar em técnica de mãos no próximo treino técnico."
                                 </div>
                             </div>
                         </div>
                    </Card>

                    <div className="bg-orange-600/10 border border-orange-500/20 p-6 rounded-[2rem] text-center">
                        <TrophyIcon className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                        <h4 className="text-white font-black uppercase text-xs italic">Objetivo do Mês</h4>
                        <p className="text-[10px] text-text-secondary mt-1">Completar 100% dos fundamentos teóricos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RookiePortal;