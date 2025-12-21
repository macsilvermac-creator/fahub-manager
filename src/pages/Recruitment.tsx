
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
import { analyzeTryoutPerformance } from '../services/geminiService';
import { UsersIcon, CheckCircleIcon, SparklesIcon, TrashIcon, ClockIcon, ActivityIcon, TargetIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

const Recruitment: React.FC = () => {
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [view, setView] = useState<'LIST' | 'STATION' | 'REVIEW'>('LIST');
    const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentCandidate | null>(null);
    const [activeProgram, setActiveProgram] = useState('TACKLE');
    
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        setCandidates(storageService.getCandidates());
        setActiveProgram(storageService.getActiveProgram());
        const unsub = storageService.subscribe('activeProgram', () => {
            setCandidates(storageService.getCandidates());
            setActiveProgram(storageService.getActiveProgram());
        });
        return unsub;
    }, []);

    const startTimer = () => {
        if (isTimerRunning) {
            if (timerRef.current) clearInterval(timerRef.current);
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
        const updatedStats: CombineStats = { ...currentStats, [field]: Number(timer.toFixed(2)), date: new Date() };
        const updated = { ...selectedCandidate, combineStats: updatedStats, status: 'TESTING' as const };
        const newList = candidates.map(x => x.id === updated.id ? updated : x);
        setCandidates(newList);
        storageService.saveCandidates(newList);
        setSelectedCandidate(updated);
        toast.success(`Tempo salvo: ${timer.toFixed(2)}s`);
    };

    const handleApprove = (id: string) => {
        storageService.approveCandidate(id);
        toast.success("Atleta aprovado e enviado para a Incubadora!");
        setView('LIST');
    };

    return (
        <div className="space-y-4 pb-20 animate-fade-in max-w-5xl mx-auto">
            <header className="flex justify-between items-center bg-secondary/50 p-6 rounded-3xl border border-white/5 shadow-2xl">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Tryout Hub: {activeProgram}</h2>
                    <p className="text-highlight text-[10px] font-bold uppercase tracking-widest mt-1">Estação de Aferição em Tempo Real</p>
                </div>
                <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
                    <button onClick={() => setView('LIST')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${view === 'LIST' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary'}`}>Inscritos</button>
                    <button onClick={() => setView('STATION')} className={`px-6 py-2 rounded-lg text-xs font-black uppercase transition-all ${view === 'STATION' ? 'bg-blue-600 text-white shadow-glow' : 'text-text-secondary'}`}>Campo</button>
                </div>
            </header>

            {view === 'LIST' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidates.map(c => (
                        <div key={c.id} onClick={() => { setSelectedCandidate(c); setView('STATION'); }} className="bg-secondary p-5 rounded-[2rem] border border-white/5 flex items-center justify-between group active:scale-95 transition-all cursor-pointer hover:border-highlight/50">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center font-black text-highlight border border-highlight/20 text-2xl shadow-inner">
                                    {c.bibNumber || '??'}
                                </div>
                                <div>
                                    <h4 className="text-white font-black text-lg uppercase italic leading-tight">{c.name}</h4>
                                    <div className="flex gap-2 mt-1">
                                        <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-text-secondary font-bold uppercase tracking-widest">{c.position}</span>
                                        <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-text-secondary font-bold uppercase tracking-widest">{c.weight}kg</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${c.status === 'EVALUATED' ? 'bg-green-500 text-black' : 'bg-yellow-500 text-black'}`}>
                                    {c.status}
                                </div>
                                {c.status === 'EVALUATED' && (
                                    <button onClick={(e) => { e.stopPropagation(); handleApprove(c.id); }} className="bg-highlight/10 text-highlight border border-highlight/30 px-3 py-1 rounded-lg text-[9px] font-black uppercase hover:bg-highlight hover:text-white transition-all">Aprovar Atleta</button>
                                )}
                            </div>
                        </div>
                    ))}
                    {candidates.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-30">
                            <TargetIcon className="w-20 h-20 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest">Nenhum candidato para {activeProgram}</p>
                        </div>
                    )}
                </div>
            )}

            {view === 'STATION' && selectedCandidate && (
                <div className="space-y-6 animate-slide-in max-w-2xl mx-auto">
                    <Card className="bg-gradient-to-r from-blue-900/40 to-slate-900 border-l-8 border-l-blue-600 rounded-[2.5rem]">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Atleta em Estação</span>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">#{selectedCandidate.bibNumber} {selectedCandidate.name}</h3>
                            </div>
                            <button onClick={() => setView('LIST')} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-10">
                        <div className="flex flex-col items-center gap-6">
                            <div 
                                onClick={startTimer}
                                className={`w-72 h-72 rounded-[4rem] border-[12px] flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 cursor-pointer relative overflow-hidden ${isTimerRunning ? 'bg-red-600 border-white animate-pulse' : 'bg-secondary border-highlight/30 hover:border-highlight'}`}
                            >
                                <span className="text-7xl font-mono font-black text-white tabular-nums drop-shadow-lg">{timer.toFixed(2)}</span>
                                <span className="text-xs font-black uppercase mt-4 text-white/60 tracking-[0.2em]">{isTimerRunning ? 'PARAR (STOP)' : 'INICIAR (START)'}</span>
                                {isTimerRunning && <div className="absolute bottom-0 left-0 h-1 bg-white animate-timer-progress" style={{width: '100%'}}></div>}
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Registrar Aferição</h4>
                            <button onClick={() => handleSaveTime('fortyYards')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[2rem] uppercase text-sm shadow-xl flex items-center justify-between px-8 group transition-all">
                                <span>40 Yard Dash</span>
                                <ClockIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </button>
                            <button onClick={() => handleSaveTime('shuttle')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[2rem] uppercase text-sm shadow-xl flex items-center justify-between px-8 group transition-all">
                                <span>Shuttle Run</span>
                                <ClockIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </button>
                            <button onClick={() => handleSaveTime('verticalJump')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-[2rem] uppercase text-sm shadow-xl flex items-center justify-between px-8 group transition-all">
                                <span>Vertical Jump</span>
                                <ClockIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5">
                         <button onClick={async () => {
                             toast.info("Analisando Biometria e Tempos...");
                             const res = await analyzeTryoutPerformance(selectedCandidate);
                             const updated = { ...selectedCandidate, aiAnalysis: res.technicalAnalysis, rating: res.potentialRating, status: 'EVALUATED' as const };
                             setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
                             setSelectedCandidate(updated);
                             storageService.saveCandidates(candidates.map(c => c.id === updated.id ? updated : c));
                             toast.success("Análise Gemini Concluída!");
                         }} className="w-full bg-purple-600 text-white font-black py-5 rounded-[2rem] shadow-glow flex items-center justify-center gap-3 uppercase text-sm transition-all hover:scale-[1.02] active:scale-95">
                             <SparklesIcon className="w-6 h-6"/> Gerar Draft Grade (IA)
                         </button>
                         {selectedCandidate.aiAnalysis && (
                             <div className="mt-4 bg-black/40 p-6 rounded-[2rem] border border-purple-500/30 text-xs text-text-secondary italic leading-relaxed">
                                 <p className="font-black text-purple-400 uppercase mb-2">Relatório do Scout:</p>
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