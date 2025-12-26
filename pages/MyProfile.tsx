
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { PracticeSession, Player, PracticeFeedback } from '../types';
import { 
    ClockIcon, CheckCircleIcon, UsersIcon, 
    PrinterIcon, SparklesIcon, PenIcon, 
    MessageIcon, WhistleIcon, ActivityIcon
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';

const PracticeExecution: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [session, setSession] = useState<PracticeSession | null>(null);
    const [athletes, setAthletes] = useState<Player[]>([]);
    const [editingFeedback, setEditingFeedback] = useState<string | null>(null);

    useEffect(() => {
        const practices = storageService.getPracticeSessions();
        const found = practices.find(p => String(p.id) === id);
        if (found) {
            setSession(found);
            setAthletes(storageService.getPlayers().slice(0, 30));
        } else {
            navigate('/training-day');
        }
    }, [id, navigate]);

    const handleSaveFeedback = (playerId: string | number, notes: string) => {
        if (!session) return;
        const newFeedback: PracticeFeedback = {
            playerId,
            notes,
            timestamp: new Date()
        };
        const updatedFeedbacks = [...(session.feedbacks || []).filter(f => f.playerId !== playerId), newFeedback];
        const updatedSession = { ...session, feedbacks: updatedFeedbacks };
        
        const all = storageService.getPracticeSessions();
        storageService.savePracticeSessions(all.map(s => String(s.id) === String(session.id) ? updatedSession : s));
        setSession(updatedSession);
        setEditingFeedback(null);
        toast.success("Feedback de campo arquivado!");
    };

    if (!session) return null;

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            <PageHeader title="Mission Execution" subtitle="Modo operacional de campo (Sideline Control)." />

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-secondary/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <WhistleIcon className="w-48 h-48 text-white" />
                </div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-highlight/10 rounded-3xl border border-highlight/20 shadow-glow">
                        <WhistleIcon className="w-10 h-10 text-highlight" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-highlight uppercase tracking-[0.4em] mb-1 block">Live Session</span>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{session.title}</h2>
                        <p className="text-sm text-text-secondary mt-2 font-bold uppercase tracking-widest">{session.focus} • {athletes.length} PRONTOS PARA O SNAP</p>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto relative z-10">
                    <button onClick={() => window.print()} className="flex-1 md:flex-none bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95">
                        <PrinterIcon className="w-4 h-4" /> IMPRIMIR ROTEIRO
                    </button>
                    <button onClick={() => navigate('/training-day')} className="flex-1 md:flex-none bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-8 py-4 rounded-2xl font-black text-xs border border-red-500/20 transition-all active:scale-95">
                        FINALIZAR TREINO
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Timeline Visual */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-2 px-4">
                        <ClockIcon className="w-4 h-4 text-highlight" /> Timeline de Drills
                    </h3>
                    <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {session.script?.map((item, idx) => (
                            <div key={item.id} className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 group hover:border-highlight transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <SparklesIcon className="w-12 h-12 text-white" />
                                </div>
                                <span className="text-highlight font-mono font-black text-xl leading-none">{item.startTime}</span>
                                <h4 className="text-white font-black uppercase italic text-sm mt-1">{item.activityName}</h4>
                                <p className="text-[10px] text-text-secondary uppercase font-bold mt-4 tracking-widest">{item.durationMinutes} MIN • {item.type}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Athlete Roster Feedback */}
                <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] flex items-center gap-2 px-4">
                        <ActivityIcon className="w-4 h-4 text-blue-400" /> Notas de Desempenho
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {athletes.map(player => {
                            const feedback = session.feedbacks?.find(f => String(f.playerId) === String(player.id));
                            return (
                                <div key={player.id} className="bg-secondary/40 border border-white/5 rounded-[2rem] p-5 flex flex-col gap-4 group hover:border-highlight/30 transition-all shadow-xl">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <LazyImage src={player.avatarUrl} className="w-12 h-12 rounded-full border-2 border-white/10" />
                                            <div>
                                                <p className="text-xs font-black text-white uppercase italic">{player.name}</p>
                                                <p className="text-[9px] text-text-secondary font-black">{player.position} • #{player.jerseyNumber}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setEditingFeedback(String(player.id))}
                                            className="p-3 bg-white/5 rounded-xl text-text-secondary hover:text-white transition-all"
                                        >
                                            <PenIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {editingFeedback === String(player.id) ? (
                                        <div className="space-y-2 animate-fade-in">
                                            <textarea 
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none focus:border-highlight"
                                                placeholder="Notas técnicas do drill..."
                                                defaultValue={feedback?.notes}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSaveFeedback(player.id, e.currentTarget.value);
                                                    }
                                                }}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-highlight text-white text-[10px] font-black py-2 rounded-lg" onClick={() => handleSaveFeedback(player.id, (document.activeElement as HTMLTextAreaElement).value)}>SALVAR</button>
                                                <button className="px-4 py-2 bg-white/5 text-text-secondary text-[10px] font-black rounded-lg" onClick={() => setEditingFeedback(null)}>CANCELAR</button>
                                            </div>
                                        </div>
                                    ) : (
                                        feedback && (
                                            <div className="bg-highlight/5 p-3 rounded-xl border border-highlight/20 flex gap-3 items-start">
                                                <MessageIcon className="w-3 h-3 text-highlight mt-0.5" />
                                                <p className="text-[10px] text-highlight italic leading-relaxed font-medium">{feedback.notes}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeExecution;
