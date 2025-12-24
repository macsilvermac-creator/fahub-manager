
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
import { analyzeTryoutPerformance } from '../services/geminiService';
import { UsersIcon, CheckCircleIcon, SparklesIcon, TrashIcon, ClockIcon, ActivityIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';

const Recruitment: React.FC = () => {
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [view, setView] = useState<'LIST' | 'STATION'>('LIST');
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

    return (
        <div className="space-y-4 pb-20 animate-fade-in">
            <PageHeader title="Tryout Hub" subtitle="Aferição de novatos e IA Scout." />

            {view === 'LIST' && (
                <div className="grid grid-cols-1 gap-3">
                    {candidates.map(c => (
                        <div key={c.id} onClick={() => { setSelectedCandidate(c); setView('STATION'); }} className="bg-secondary p-4 rounded-2xl border border-white/5 flex items-center justify-between group active:scale-95 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center font-black text-highlight border border-highlight/20 text-lg">
                                    {c.bibNumber || '??'}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase">{c.name}</h4>
                                    <p className="text-[10px] text-text-secondary uppercase">{c.position} • {c.weight}kg</p>
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${c.status === 'EVALUATED' ? 'bg-green-500 shadow-glow' : 'bg-yellow-500 animate-pulse'}`}></div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'STATION' && selectedCandidate && (
                <div className="space-y-6 animate-slide-in max-w-xl mx-auto">
                    <Card className="border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-white italic uppercase">Atleta #{selectedCandidate.bibNumber}</h3>
                            <button onClick={() => setView('LIST')} className="text-xs text-text-secondary underline">Voltar</button>
                        </div>
                        <p className="text-lg text-white font-bold">{selectedCandidate.name}</p>
                    </Card>

                    <div className="flex flex-col items-center gap-6">
                        <div 
                            onClick={startTimer}
                            className={`w-64 h-64 rounded-3xl border-[10px] flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 cursor-pointer ${isTimerRunning ? 'bg-red-600 border-white animate-pulse' : 'bg-secondary border-highlight/30'}`}
                        >
                            <span className="text-6xl font-mono font-black text-white">{timer.toFixed(2)}</span>
                            <span className="text-[10px] font-black uppercase mt-2 text-white/50">{isTimerRunning ? 'STOP' : 'START'}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button onClick={() => handleSaveTime('fortyYards')} className="bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[10px] shadow-lg">Salvar 40 Yard Dash</button>
                            <button onClick={() => handleSaveTime('shuttle')} className="bg-blue-600 text-white font-black py-4 rounded-2xl uppercase text-[10px] shadow-lg">Salvar Shuttle Run</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recruitment;
