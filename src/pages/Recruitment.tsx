
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
import { analyzeTryoutPerformance } from '../services/geminiService';
import { UsersIcon, CheckCircleIcon, SparklesIcon, TrashIcon, ClockIcon, ActivityIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

const Recruitment: React.FC = () => {
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [view, setView] = useState<'LIST' | 'STATION' | 'ANALYSIS'>('LIST');
    const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentCandidate | null>(null);
    
    // Timer State
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        setCandidates(storageService.getCandidates());
    }, []);

    const startTimer = () => {
        if (isTimerRunning) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
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
        const updatedStats = { ...currentStats, [field]: Number(timer.toFixed(2)), date: new Date() };
        const updated = { ...selectedCandidate, combineStats: updatedStats as CombineStats, status: 'TESTING' as const };
        saveCandidate(updated);
        toast.success(`Tempo salvo: ${timer.toFixed(2)}s`);
    };

    const saveCandidate = (c: RecruitmentCandidate) => {
        const newList = candidates.map(x => x.id === c.id ? c : x);
        setCandidates(newList);
        storageService.saveCandidates(newList);
        setSelectedCandidate(c);
    };

    const handleAiAnalysis = async (c: RecruitmentCandidate) => {
        toast.info("IA Analisando biotipo e tempos...");
        try {
            const result = await analyzeTryoutPerformance(c);
            const updated = { ...c, aiAnalysis: result.technicalAnalysis, rating: result.potentialRating, status: 'EVALUATED' as const };
            saveCandidate(updated);
            toast.success("Relatório Pro gerado!");
        } catch (e) {
            toast.error("IA falhou.");
        }
    };

    return (
        <div className="space-y-4 pb-20 animate-fade-in">
            <header className="flex justify-between items-center p-2">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Tryout Command</h2>
                    <p className="text-highlight text-[10px] font-bold uppercase tracking-widest">Sideline Mode Active</p>
                </div>
                <div className="flex bg-secondary p-1 rounded-xl border border-white/5">
                    <button onClick={() => setView('LIST')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'LIST' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Lista</button>
                    <button onClick={() => setView('STATION')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'STATION' ? 'bg-blue-600 text-white' : 'text-text-secondary'}`}>Estação</button>
                </div>
            </header>

            {view === 'LIST' && (
                <div className="grid grid-cols-1 gap-3">
                    {candidates.map(c => (
                        <div key={c.id} onClick={() => { setSelectedCandidate(c); setView('STATION'); }} className="bg-secondary p-4 rounded-2xl border border-white/5 flex items-center justify-between group active:scale-95 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center font-black text-highlight border border-highlight/20 text-lg">
                                    {c.bibNumber || '??'}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase">{c.name}</h4>
                                    <p className="text-[10px] text-text-secondary">{c.position} • {c.weight}kg • {c.experience}</p>
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${c.status === 'EVALUATED' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                        </div>
                    ))}
                    {candidates.length === 0 && (
                         <div className="text-center py-20 opacity-30 border-2 border-dashed border-white/10 rounded-2xl">
                            <p className="font-bold uppercase text-xs">Nenhum candidato registrado</p>
                        </div>
                    )}
                </div>
            )}

            {view === 'STATION' && selectedCandidate && (
                <div className="space-y-6 animate-slide-in">
                    <Card className="border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-white italic uppercase">Candidato #{selectedCandidate.bibNumber}</h3>
                            <button onClick={() => setView('LIST')} className="text-xs text-text-secondary underline">Voltar</button>
                        </div>
                        <p className="text-lg text-white font-bold">{selectedCandidate.name}</p>
                    </Card>

                    <div className="flex flex-col items-center gap-4">
                        <div 
                            onClick={startTimer}
                            className={`w-full aspect-square max-w-[300px] rounded-full border-[12px] flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 ${isTimerRunning ? 'bg-red-600 border-white' : 'bg-secondary border-highlight/30'}`}
                        >
                            <span className="text-6xl font-mono font-black text-white">{timer.toFixed(2)}</span>
                            <span className="text-[10px] font-black uppercase mt-2 text-white/50">{isTimerRunning ? 'Toque para Parar' : 'Toque para Iniciar'}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 w-full max-w-[300px]">
                            <button onClick={() => handleSaveTime('fortyYards')} className="bg-blue-600 text-white font-black py-3 rounded-xl uppercase text-[10px]">Salvar 40j</button>
                            <button onClick={() => handleSaveTime('shuttle')} className="bg-blue-600 text-white font-black py-3 rounded-xl uppercase text-[10px]">Salvar Shuttle</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                         <button onClick={() => handleAiAnalysis(selectedCandidate)} className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl shadow-glow flex items-center justify-center gap-2 uppercase text-xs">
                             <SparklesIcon className="w-5 h-5"/> Gerar Scouting Report IA
                         </button>
                         {selectedCandidate.aiAnalysis && (
                             <div className="bg-black/40 p-4 rounded-2xl border border-purple-500/30 text-xs text-text-secondary italic leading-relaxed">
                                 {selectedCandidate.aiAnalysis}
                             </div>
                         )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recruitment;