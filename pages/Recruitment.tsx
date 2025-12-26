
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
import { analyzeTryoutPerformance } from '../services/geminiService';
import { 
    CheckCircleIcon, SparklesIcon, TrashIcon, ClockIcon,
    TargetIcon, ActivityIcon, PlusIcon, ChevronRightIcon
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';

const Recruitment: React.FC = () => {
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [view, setView] = useState<'LIST' | 'STATION'>('LIST');
    const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentCandidate | null>(null);
    
    // Stopwatch Engine
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        setCandidates(storageService.getCandidates() || []);
    }, []);

    const startTimer = () => {
        if (isTimerRunning) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsTimerRunning(false);
            toast.info(`Marcação: ${timer.toFixed(2)}s`);
        } else {
            setTimer(0);
            setIsTimerRunning(true);
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 0.01);
            }, 10);
        }
    };

    const handleSaveTime = (field: keyof CombineStats) => {
        if (!selectedCandidate) return;
        const currentStats = selectedCandidate.combineStats || { date: new Date() };
        const updatedStats: CombineStats = { ...currentStats, [field]: Number(timer.toFixed(2)), date: new Date() };
        const updated = { ...selectedCandidate, combineStats: updatedStats, status: 'TESTING' as const };
        
        const newList = candidates.map(x => x.id === updated.id ? updated : x);
        setCandidates(newList);
        storageService.saveCandidates(newList);
        setSelectedCandidate(updated);
        toast.success(`Marcação de ${field} salva!`);
    };

    const handleAiAnalysis = async () => {
        if (!selectedCandidate) return;
        toast.info("Consultando IA Scout para análise de potencial...");
        try {
            const result = await analyzeTryoutPerformance(selectedCandidate);
            const updated = { 
                ...selectedCandidate, 
                aiAnalysis: result.technicalAnalysis, 
                rating: result.potentialRating, 
                status: 'EVALUATED' as const 
            };
            const newList = candidates.map(x => x.id === updated.id ? updated : x);
            setCandidates(newList);
            storageService.saveCandidates(newList);
            setSelectedCandidate(updated);
            toast.success("Dossiê de recrutamento gerado com sucesso!");
        } catch (e) {
            toast.error("Erro na análise da IA.");
        }
    };

    const handleDelete = (id: string | number) => {
        const newList = candidates.filter(c => c.id !== id);
        setCandidates(newList);
        storageService.saveCandidates(newList);
        toast.info("Candidato removido.");
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20 max-w-6xl mx-auto">
            <PageHeader title="Tryout Hub" subtitle="Módulo de Identificação e Aferição de Talentos de Elite" />

            {view === 'LIST' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                         <div className="flex gap-4">
                            <div className="bg-secondary/60 px-6 py-2 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-black text-text-secondary uppercase">Inscritos</p>
                                <p className="text-xl font-black text-white">{candidates.length}</p>
                            </div>
                            <div className="bg-secondary/60 px-6 py-2 rounded-2xl border border-white/5 text-center">
                                <p className="text-[10px] font-black text-text-secondary uppercase">Avaliados</p>
                                <p className="text-xl font-black text-highlight">{candidates.filter(c => c.status === 'EVALUATED').length}</p>
                            </div>
                         </div>
                         <button className="bg-highlight hover:bg-highlight-hover text-white px-6 py-3 rounded-xl font-black uppercase text-xs shadow-glow transition-all active:scale-95 flex items-center gap-2">
                             <PlusIcon className="w-4 h-4" /> Novo Candidato
                         </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidates.map(c => (
                            <div 
                                key={c.id} 
                                onClick={() => { setSelectedCandidate(c); setView('STATION'); }} 
                                className="bg-secondary/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 flex flex-col hover:border-highlight group transition-all cursor-pointer shadow-xl relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-black/60 rounded-2xl flex items-center justify-center font-black text-highlight border-2 border-highlight/20 text-xl italic shadow-2xl">
                                        #{c.bibNumber || '??'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-black uppercase italic text-sm group-hover:text-highlight transition-colors">{c.name}</h4>
                                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{c.position} • {c.weight}kg</p>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        {c.status === 'EVALUATED' && <SparklesIcon className="w-4 h-4 text-purple-400" />}
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${c.status === 'EVALUATED' ? 'text-green-400' : 'text-yellow-500 animate-pulse'}`}>
                                            {c.status === 'EVALUATED' ? 'Avaliação Completa' : 'Aguardando Testes'}
                                        </span>
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                        
                        {candidates.length === 0 && (
                            <div className="col-span-full py-40 text-center border-2 border-dashed border-white/10 rounded-[3rem] opacity-30">
                                <TargetIcon className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-black uppercase tracking-widest">Nenhum prospecto cadastrado</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {view === 'STATION' && selectedCandidate && (
                <div className="space-y-8 animate-slide-in max-w-2xl mx-auto">
                    <div className="bg-secondary/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex justify-between items-center shadow-2xl">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-highlight rounded-2xl flex items-center justify-center font-black text-white text-2xl italic shadow-glow">
                                #{selectedCandidate.bibNumber || '??'}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase">{selectedCandidate.name}</h3>
                                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest">Estação de Testes Ativa</p>
                            </div>
                        </div>
                        <button onClick={() => setView('LIST')} className="text-xs font-black text-text-secondary hover:text-white uppercase tracking-widest border-b border-white/10 pb-1">Voltar</button>
                    </div>

                    <div className="flex flex-col items-center gap-8">
                        <div 
                            onClick={startTimer}
                            className={`w-72 h-72 rounded-[4rem] border-[12px] flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 cursor-pointer relative overflow-hidden ${isTimerRunning ? 'bg-red-600 border-white animate-pulse' : 'bg-secondary border-highlight/40'}`}
                        >
                            <span className="text-7xl font-mono font-black text-white tabular-nums tracking-tighter">{timer.toFixed(2)}</span>
                            <span className="text-[10px] font-black uppercase mt-3 text-white/50 tracking-[0.2em]">{isTimerRunning ? 'CLIQUE PARA PARAR' : 'CLIQUE PARA INICIAR'}</span>
                            
                            {/* Shimmer Effect while running */}
                            {isTimerRunning && <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 animate-shimmer"></div>}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <button onClick={() => handleSaveTime('fortyYards')} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-3xl uppercase text-[10px] shadow-lg transition-all active:scale-95">Salvar 40y Dash</button>
                            <button onClick={() => handleSaveTime('shuttle')} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-3xl uppercase text-[10px] shadow-lg transition-all active:scale-95">Salvar Shuttle Run</button>
                        </div>

                        <button 
                            onClick={handleAiAnalysis} 
                            className="w-full bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-black py-5 rounded-[2rem] shadow-glow flex items-center justify-center gap-3 uppercase text-xs transition-all active:scale-95"
                        >
                             <SparklesIcon className="w-5 h-5"/> Gerar Dossiê IA Scout
                         </button>
                    </div>

                    {selectedCandidate.aiAnalysis && (
                        <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[3rem] border border-purple-500/30 shadow-2xl animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-white font-black uppercase italic text-sm flex items-center gap-2">
                                    <ActivityIcon className="w-5 h-5 text-purple-400" /> Relatório de Inteligência
                                </h4>
                                <div className="bg-purple-600 text-white px-4 py-1 rounded-full text-xs font-black italic">
                                    {selectedCandidate.rating} OVR PROJETADO
                                </div>
                            </div>
                            <p className="text-sm text-text-secondary italic leading-relaxed whitespace-pre-wrap border-l-2 border-purple-500/50 pl-6">{selectedCandidate.aiAnalysis}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Recruitment;
