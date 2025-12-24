
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { PracticeSession, Player, PracticeFeedback } from '../types';
// Fix: Added WhistleIcon to the import list from UiIcons
import { ClockIcon, CheckCircleIcon, UsersIcon, PrinterIcon, SparklesIcon, PenIcon, MessageIcon, WhistleIcon } from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

// COMPONENTE LZY: AthleteRow isolado para evitar re-render da lista toda ao digitar feedback
const AthleteRow = memo(({ athlete, feedback, onSaveFeedback }: { 
    athlete: Player, 
    feedback?: PracticeFeedback, 
    onSaveFeedback: (notes: string) => void 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localNotes, setLocalNotes] = useState(feedback?.notes || '');

    const handleSave = () => {
        onSaveFeedback(localNotes);
        setIsEditing(false);
    };

    return (
        <div className="bg-secondary/40 border border-white/5 rounded-3xl p-5 flex flex-col gap-4 transition-all hover:border-highlight/30 no-print group">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <LazyImage src={athlete.avatarUrl} className="w-14 h-14 rounded-full border-2 border-white/10 object-cover" />
                        <div className="absolute -bottom-1 -right-1 bg-black text-white text-[8px] font-black w-6 h-6 flex items-center justify-center rounded-full border border-white/20">
                            #{athlete.jerseyNumber}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase italic tracking-tight">{athlete.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-black bg-white/10 text-text-secondary px-2 py-0.5 rounded uppercase">{athlete.position}</span>
                            <span className="text-[9px] text-text-secondary uppercase font-bold">OVR {athlete.rating}</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-highlight text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'}`}
                >
                    <PenIcon className="w-4 h-4" />
                </button>
            </div>
            
            {isEditing && (
                <div className="space-y-3 animate-slide-up">
                    <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white focus:border-highlight outline-none min-h-[80px]"
                        placeholder="Notas técnicas: Alinhamento, esforço, recepção..."
                        value={localNotes}
                        onChange={(e) => setLocalNotes(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button 
                            onClick={handleSave}
                            className="flex-1 bg-highlight text-white font-black py-3 rounded-xl text-[10px] uppercase shadow-glow"
                        >
                            SALVAR FEEDBACK
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-4 py-3 bg-white/5 text-text-secondary rounded-xl text-[10px] font-black uppercase">Cancelar</button>
                    </div>
                </div>
            )}
            
            {feedback && !isEditing && (
                <div className="flex items-start gap-2 bg-highlight/5 p-3 rounded-xl border border-highlight/10">
                    <MessageIcon className="w-3 h-3 text-highlight mt-0.5 shrink-0" />
                    <p className="text-[10px] text-highlight italic leading-relaxed">{feedback.notes}</p>
                </div>
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
            // Simular atletas que deram RSVP "Vou"
            setAthletes(storageService.getPlayers().slice(0, 24));
        } else {
            navigate('/training-day');
        }
    }, [id, navigate]);

    const handleSaveFeedback = useCallback((playerId: string | number, notes: string) => {
        setSession(prev => {
            if (!prev) return null;
            const newFeedback: PracticeFeedback = {
                playerId,
                notes,
                timestamp: new Date()
            };
            const currentFeedbacks = prev.feedbacks || [];
            const updatedFeedbacks = [...currentFeedbacks.filter(f => f.playerId !== playerId), newFeedback];
            const updatedSession = { ...prev, feedbacks: updatedFeedbacks };
            
            // Persistência
            const all = storageService.getPracticeSessions();
            storageService.savePracticeSessions(all.map(s => String(s.id) === String(prev.id) ? updatedSession : s));
            
            return updatedSession;
        });
        toast.success("Histórico atualizado!");
    }, [toast]);

    if (!session) return null;

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            {/* 📋 LAYOUT DE IMPRESSÃO (PROFISSIONAL CLIPBOARD) */}
            <div className="hidden print:block text-black p-10 font-sans bg-white min-h-screen">
                <div className="flex justify-between items-center border-b-4 border-black pb-6 mb-10">
                    <div className="flex items-center gap-6">
                        <img src={storageService.getTeamSettings().logoUrl} className="h-24 w-24 object-contain" alt="Logo" />
                        <div>
                            <h1 className="text-4xl font-black uppercase tracking-tighter">{storageService.getTeamSettings().teamName}</h1>
                            <h2 className="text-2xl font-bold text-gray-700 italic">FOOTBALL PRACTICE PLAN</h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black">{new Date(session.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }).toUpperCase()}</p>
                        <p className="text-sm font-bold text-gray-500">Kickoff: {session.startTime} | Foco: {session.focus}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12">
                    {/* Lado Esquerdo: O Script */}
                    <div>
                        <div className="bg-black text-white py-2 px-4 mb-6">
                            <h3 className="font-black text-sm uppercase tracking-widest">I. PRACTICE SCRIPT (TEMPOS)</h3>
                        </div>
                        <div className="space-y-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-black text-[10px] font-black uppercase">
                                        <th className="text-left py-2 w-20">HORA</th>
                                        <th className="text-left py-2 w-16">DUR</th>
                                        <th className="text-left py-2">ATIVIDADE / DRILL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {session.script?.map(s => (
                                        <tr key={s.id} className="border-b border-gray-300">
                                            <td className="py-3 font-mono font-bold text-sm">{s.startTime}</td>
                                            <td className="py-3 text-xs">{s.durationMinutes}'</td>
                                            <td className="py-3">
                                                <p className="font-black text-sm uppercase leading-none">{s.activityName}</p>
                                                <p className="text-[9px] text-gray-500 mt-1 italic">{s.description || 'Foco técnico na execução.'}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Lado Direito: A Lista de Avaliação */}
                    <div>
                        <div className="bg-black text-white py-2 px-4 mb-6">
                            <h3 className="font-black text-sm uppercase tracking-widest">II. FIELD EVALUATION (NOTAS)</h3>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-black text-[9px] font-black uppercase">
                                    <th className="text-left py-2">ATLETA</th>
                                    <th className="text-center py-2 w-10">PRES</th>
                                    <th className="text-center py-2 w-12">GRADE</th>
                                    <th className="text-left py-2">OBSERVAÇÕES DE CAMPO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {athletes.map(a => (
                                    <tr key={a.id} className="border-b border-gray-200">
                                        <td className="py-2">
                                            <p className="font-bold text-[10px] uppercase leading-none">{a.name.split(' ').slice(0,2).join(' ')}</p>
                                            <p className="text-[8px] text-gray-500">#{a.jerseyNumber} • {a.position}</p>
                                        </td>
                                        <td className="py-2 text-center"><div className="w-4 h-4 border border-black mx-auto"></div></td>
                                        <td className="py-2 text-center"><div className="w-8 h-4 border-b border-black mx-auto"></div></td>
                                        <td className="py-2"><div className="w-full h-4 border-b border-black border-dotted"></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 📱 INTERFACE DO COACH (VISÍVEL NO APP) */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-secondary/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl no-print">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-highlight/10 rounded-3xl border border-highlight/20 shadow-glow">
                        <WhistleIcon className="w-10 h-10 text-highlight" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-highlight uppercase tracking-[0.4em] mb-1 block">Sessão Ativa</span>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{session.title}</h2>
                        <div className="flex gap-4 mt-3">
                             <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold">
                                 <ClockIcon className="w-4 h-4" /> {session.startTime}
                             </div>
                             <div className="flex items-center gap-1.5 text-xs text-text-secondary font-bold">
                                 <UsersIcon className="w-4 h-4" /> {athletes.length} Atletas em Campo
                             </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => window.print()} className="flex-1 md:flex-none bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all">
                        <PrinterIcon className="w-4 h-4" /> IMPRIMIR ROTEIRO
                    </button>
                    <button onClick={() => navigate('/training-day')} className="flex-1 md:flex-none bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-8 py-4 rounded-2xl font-black text-xs border border-red-500/20 transition-all">
                        ENCERRAR TREINO
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
                {/* LINHA DO TEMPO ATIVA */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-black text-highlight uppercase tracking-[0.3em] flex items-center gap-2 px-4">
                        <ClockIcon className="w-4 h-4" /> LINHA DO TEMPO
                    </h3>
                    <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {session.script?.map((item) => (
                            <div key={item.id} className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 group hover:border-highlight transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <SparklesIcon className="w-12 h-12 text-white" />
                                </div>
                                <span className="text-highlight font-mono font-black text-xl leading-none">{item.startTime}</span>
                                <h4 className="text-white font-black uppercase italic text-sm mt-1">{item.activityName || 'Drill Sem Nome'}</h4>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{item.durationMinutes} MIN • TÉCNICO</span>
                                    {/* Simulação de Timer Rápido */}
                                    <button className="p-2 bg-white/5 rounded-full hover:bg-highlight text-text-secondary hover:text-white transition-all"><ClockIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LISTA DE ATLETAS (LZY RENDER) */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <UsersIcon className="w-4 h-4" /> ATLETAS CONFIRMADOS
                        </h3>
                        <span className="text-[10px] font-black text-text-secondary bg-white/5 px-3 py-1.5 rounded-full uppercase tracking-widest">
                            {athletes.length} PRONTOS PARA O SNAP
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {athletes.map(player => (
                            <AthleteRow 
                                key={player.id} 
                                athlete={player} 
                                feedback={session.feedbacks?.find(f => String(f.playerId) === String(player.id))}
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