
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { PracticeSession, Player } from '../types';
import { 
    ClockIcon, CheckCircleIcon, UsersIcon, 
    WhistleIcon, ShieldCheckIcon, AlertTriangleIcon, 
    CalendarIcon, DumbbellIcon
} from '../components/icons/UiIcons';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';
import { UserContext } from '../components/Layout';

const PracticeDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { currentRole } = useContext(UserContext) as any;
    
    const [session, setSession] = useState<PracticeSession | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    useEffect(() => {
        const practices = storageService.getPracticeSessions();
        const found = practices.find(p => String(p.id) === id);
        if (found) {
            setSession(found);
            setPlayers(storageService.getPlayers().slice(0, 15)); // Mock de brotherhood
            
            const user = storageService.getCurrentUser();
            if (found.attendees?.includes(user.name)) {
                setHasConfirmed(true);
            }
        } else {
            navigate('/dashboard');
        }

        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setReadProgress(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [id, navigate]);

    const handleConfirm = () => {
        if (!session) return;
        const user = storageService.getCurrentUser();
        
        const updatedAttendees = hasConfirmed 
            ? (session.attendees || []).filter(a => a !== user.name)
            : [...(session.attendees || []), user.name];

        const updatedSession = { ...session, attendees: updatedAttendees };
        const all = storageService.getPracticeSessions();
        storageService.savePracticeSessions(all.map(s => String(s.id) === String(session.id) ? updatedSession : s));
        
        setSession(updatedSession);
        setHasConfirmed(!hasConfirmed);
        
        if (!hasConfirmed) {
            toast.success("+10 XP: Presença Confirmada! Prepare seu equipamento.");
        }
    };

    if (!session) return null;

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            {/* Progress Bar Tática */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-white/5 no-print">
                <div className="h-full bg-highlight shadow-glow transition-all duration-300" style={{ width: `${readProgress}%` }}></div>
            </div>

            <PageHeader title="Mission Blueprint" subtitle="Prepare sua mente antes de pisar no campo." />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content (Left) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Header imersivo */}
                    <div className="bg-gradient-to-br from-blue-900/40 to-black p-8 rounded-[3rem] border border-blue-500/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <WhistleIcon className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic shadow-lg">Session #{session.id}</span>
                                <span className="bg-white/10 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">Modalidade: Tackle</span>
                            </div>
                            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{session.title}</h1>
                            <p className="text-highlight font-black text-xl uppercase italic mt-2 tracking-widest">Foco: {session.focus}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Horário</p>
                                    <p className="text-white font-bold">{session.startTime || '19:30'}</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Equipamento</p>
                                    <p className="text-white font-bold flex items-center gap-1"><ShieldCheckIcon className="w-3 h-3 text-highlight"/> Full Pads</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Clima</p>
                                    <p className="text-white font-bold">22°C Clear</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Unidade</p>
                                    <p className="text-white font-bold">Full Team</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline do Script */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-2 px-4">
                            <ClockIcon className="w-4 h-4 text-highlight" /> Mission Timeline
                        </h3>
                        <div className="relative pl-8 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            {session.script && session.script.length > 0 ? (
                                session.script.map((item, idx) => (
                                    <div key={item.id} className="relative animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-highlight shadow-glow border-2 border-primary"></div>
                                        <div className="bg-secondary/40 p-5 rounded-2xl border border-white/5 hover:border-highlight/30 transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-highlight font-mono font-black text-sm">{item.startTime}</span>
                                                    <h4 className="text-white font-black uppercase italic text-lg leading-none mt-1 group-hover:text-highlight transition-colors">{item.activityName}</h4>
                                                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">{item.description || 'Foco técnico na execução perfeita e fundamentos.'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-text-secondary bg-white/5 px-2 py-1 rounded-lg uppercase">{item.durationMinutes} MIN</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center opacity-30 italic font-black uppercase text-xs tracking-widest">Script ainda sendo finalizado pelo Coach...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Botão de Confirmação Gigante */}
                    <button 
                        onClick={handleConfirm}
                        className={`w-full p-8 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-4 transition-all transform active:scale-95 shadow-2xl ${hasConfirmed ? 'bg-highlight border-highlight shadow-glow text-white' : 'bg-red-600/10 border-red-500/40 text-red-500 hover:bg-red-600/20'}`}
                    >
                        {hasConfirmed ? (
                            <>
                                <CheckCircleIcon className="w-16 h-16 animate-bounce" />
                                <div className="text-center">
                                    <p className="text-2xl font-black uppercase italic leading-none">Present & Ready</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Você está confirmado para hoje!</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertTriangleIcon className="w-16 h-16 animate-pulse" />
                                <div className="text-center">
                                    <p className="text-2xl font-black uppercase italic leading-none">Confirmar Agora</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Status: Pendente</p>
                                </div>
                            </>
                        )}
                    </button>

                    {/* Brotherhood Loop */}
                    <Card title="Brotherhood (Confirmados)">
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {session.attendees?.map((name, i) => (
                                    <div key={i} title={name} className="w-10 h-10 rounded-xl bg-highlight/20 border border-highlight/40 flex items-center justify-center font-black text-highlight text-xs animate-fade-in">
                                        {name.charAt(0)}
                                    </div>
                                ))}
                                {(!session.attendees || session.attendees.length === 0) && (
                                    <p className="text-xs text-text-secondary italic">Aguardando as primeiras confirmações...</p>
                                )}
                            </div>
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Atletas da Unidade: <span className="text-white">12/40</span></p>
                            </div>
                        </div>
                    </Card>

                    {/* Notas do Coach (Manual) */}
                    <div className="bg-secondary p-6 rounded-[2rem] border border-white/5">
                         <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <WhistleIcon className="w-4 h-4"/> Sideline Notes
                         </h4>
                         <div className="bg-black/40 p-4 rounded-2xl border-l-4 border-blue-500">
                             <p className="text-white text-sm italic font-medium">"Hoje o foco é 100% tático. Quero execução limpa nos bloqueios de redzone. Estudem o script e cheguem 15 min antes."</p>
                             <p className="text-[10px] text-text-secondary font-bold uppercase mt-3">— Coach Guto</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeDetail;