
import React, { useState, useEffect, useMemo, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { PracticeSession, Player, PracticeFeedback } from '../types';
import { ClockIcon, CheckCircleIcon, UsersIcon, PrinterIcon, SparklesIcon } from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const AthleteRow = memo(({ athlete, feedback, onSaveFeedback }: { athlete: Player, feedback?: PracticeFeedback, onSaveFeedback: (notes: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localNotes, setLocalNotes] = useState(feedback?.notes || '');

    return (
        <div className="bg-secondary/40 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 transition-all hover:border-highlight/30 no-print">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <LazyImage src={athlete.avatarUrl} className="w-10 h-10 rounded-full border border-white/10" />
                    <div>
                        <p className="text-sm font-bold text-white uppercase">{athlete.name}</p>
                        <p className="text-[10px] text-text-secondary font-black">{athlete.position} • #{athlete.jerseyNumber}</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isEditing ? 'bg-highlight text-white' : 'bg-white/5 text-text-secondary hover:text-white'}`}
                >
                    {isEditing ? 'FECHAR' : 'FEEDBACK'}
                </button>
            </div>
            
            {isEditing && (
                <div className="space-y-2 animate-slide-up">
                    <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-highlight outline-none"
                        placeholder="Ex: Teve dificuldades com o hand-off hoje..."
                        value={localNotes}
                        onChange={(e) => setLocalNotes(e.target.value)}
                    />
                    <button 
                        onClick={() => { onSaveFeedback(localNotes); setIsEditing(false); }}
                        className="w-full bg-highlight text-white font-black py-2 rounded-xl text-[10px] uppercase shadow-glow"
                    >
                        SALVAR NO HISTÓRICO
                    </button>
                </div>
            )}
            
            {feedback && !isEditing && (
                <p className="text-[10px] text-highlight italic line-clamp-1 bg-highlight/5 px-2 py-1 rounded">Nota: {feedback.notes}</p>
            )}
        </div>
    );
});

const PracticeExecution: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [session, setSession] = useState<PracticeSession | null>(null);
    const [athletes, setAthletes] = useState<Player[]>([]);

    useEffect(() => {
        const practices = storageService.getPracticeSessions();
        const found = practices.find(p => String(p.id) === id);
        if (found) {
            setSession(found);
            // Simular atletas confirmados (no real viria do banco)
            setAthletes(storageService.getPlayers().slice(0, 20));
        } else {
            navigate('/dashboard');
        }
    }, [id]);

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
        storageService.savePracticeSessions(all.map(s => String(s.id) === id ? updatedSession : s));
        setSession(updatedSession);
        toast.success("Feedback registrado!");
    };

    if (!session) return null;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* MODO IMPRESSÃO (Escondido na Tela) */}
            <div className="hidden print:block text-black p-8 font-sans">
                <div className="flex justify-between border-b-2 border-black pb-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase">{storageService.getTeamSettings().teamName}</h1>
                        <h2 className="text-xl font-bold">ROTEIRO DE TREINO - {session.title}</h2>
                        <p className="text-sm">{new Date(session.date).toLocaleDateString()} | Kickoff: {session.startTime}</p>
                    </div>
                    <img src={storageService.getTeamSettings().logoUrl} className="h-20 w-20 object-contain" />
                </div>

                <div className="grid grid-cols-2 gap-10">
                    <div>
                        <h3 className="font-black text-lg border-b mb-4">CRONOGRAMA TÉCNICO</h3>
                        <div className="space-y-4">
                            {session.script?.map(s => (
                                <div key={s.id} className="flex gap-4 border-b border-gray-100 pb-2">
                                    <span className="font-bold w-20">{s.startTime}</span>
                                    <div>
                                        <p className="font-bold uppercase">{s.activityName}</p>
                                        <p className="text-xs text-gray-600">{s.durationMinutes} min • {s.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-lg border-b mb-4">CONTROLE DE CAMPO</h3>
                        <table className="w-full text-[10px]">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2">ATLETA</th>
                                    <th className="text-center py-2">PRES</th>
                                    <th className="text-center py-2">NOTA</th>
                                    <th className="text-left py-2">OBS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {athletes.map(a => (
                                    <tr key={a.id} className="border-b">
                                        <td className="py-2 font-bold">{a.name} ({a.position})</td>
                                        <td className="text-center py-2"><div className="w-4 h-4 border border-black inline-block"></div></td>
                                        <td className="text-center py-2"><div className="w-8 h-4 border-b border-black inline-block"></div></td>
                                        <td className="py-2"><div className="w-full h-4 border-b border-black border-dotted"></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* INTERFACE DO COACH (Visível) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-black/60 p-6 rounded-3xl border border-white/10 no-print">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-highlight/10 rounded-2xl">
                        <ClockIcon className="w-8 h-8 text-highlight" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">{session.title}</h2>
                        <p className="text-text-secondary text-sm font-bold">{session.startTime} - Foco: {session.focus}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2 border border-white/10 transition-all">
                        <PrinterIcon className="w-4 h-4" /> IMPRIMIR ROTEIRO
                    </button>
                    <button onClick={() => navigate(-1)} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-6 py-3 rounded-xl font-black text-xs transition-all">
                        ENCERRAR TREINO
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
                {/* ROTEIRO ATIVO */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-black text-highlight uppercase tracking-[0.3em] flex items-center gap-2 px-2">
                        <ClockIcon className="w-4 h-4" /> LINHA DO TEMPO
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {session.script?.map((item) => (
                            <div key={item.id} className="bg-secondary/20 p-4 rounded-2xl border border-white/5 group hover:border-highlight transition-all">
                                <span className="text-highlight font-mono font-bold text-lg">{item.startTime}</span>
                                <h4 className="text-white font-bold uppercase text-sm mt-1">{item.activityName}</h4>
                                <p className="text-[10px] text-text-secondary mt-1">{item.durationMinutes} MIN • {item.type}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROSTER CONFIRMADO (LZY Render) */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" /> ATLETAS NO CAMPO
                        </h3>
                        <span className="text-[10px] font-black text-text-secondary bg-white/5 px-2 py-1 rounded">
                            {athletes.length} CONFIRMADOS
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {athletes.map(player => (
                            <AthleteRow 
                                key={player.id} 
                                athlete={player} 
                                feedback={session.feedbacks?.find(f => f.playerId === player.id)}
                                onSaveFeedback={(notes) => handleSaveFeedback(player.id, notes)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeExecution;
