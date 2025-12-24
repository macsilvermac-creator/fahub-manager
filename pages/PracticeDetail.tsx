import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { PracticeSession, Player } from '../types';
import { 
    ClockIcon, CheckCircleIcon, UsersIcon, 
    WhistleIcon, ShieldCheckIcon, AlertTriangleIcon, 
    CalendarIcon, DumbbellIcon, BookIcon
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
    const [hasConfirmed, setHasConfirmed] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    useEffect(() => {
        const practices = storageService.getPracticeSessions();
        const found = practices.find(p => String(p.id) === id);
        if (found) {
            setSession(found);
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
            {/* Barra de Progresso Tática */}
            <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-white/5 no-print">
                <div className="h-full bg-highlight shadow-glow transition-all duration-300" style={{ width: `${readProgress}%` }}></div>
            </div>

            <PageHeader title="Mission Detail" subtitle="Manual de Preparação Técnica." />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Lado Esquerdo: O Plano */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Header Imersivo */}
                    <div className="bg-gradient-to-br from-blue-900/40 to-black p-8 rounded-[3rem] border border-blue-500/20 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <WhistleIcon className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest shadow-lg">TREINO #{session.id}</span>
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 ${session.source === 'AI' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white'}`}>
                                    Fonte: {session.source || 'Manual'}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{session.title}</h1>
                            <p className="text-highlight font-black text-xl uppercase italic mt-2 tracking-widest">Foco: {session.focus}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Kickoff</p>
                                    <p className="text-white font-bold">{session.startTime || '19:30'}</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Equipamento</p>
                                    <p className="text-white font-bold flex items-center gap-1"><ShieldCheckIcon className="w-3 h-3 text-highlight"/> Full Pads</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Pilar</p>
                                    <p className="text-white font-bold uppercase">{session.category || 'Tático'}</p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-text-secondary uppercase mb-1">Unidade</p>
                                    <p className="text-white font-bold uppercase">{session.target || 'Full Team'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mission Timeline (Script do Coach) */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-4">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-2">
                                <ClockIcon className="w-4 h-4 text-highlight" /> Mission Timeline
                            </h3>
                            {readProgress > 95 && (
                                <span className="text-[9px] font-black text-green-400 uppercase animate-pulse">+5 XP IQ TÁTICO ADQUIRIDO</span>
                            )}
                        </div>
                        
                        <div className="relative pl-8 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            {session.script && session.script.length > 0 ? (
                                session.script.map((item, idx) => (
                                    <div key={item.id} className="relative animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="absolute -left-8 top-1.5 w-3 h-3 rounded-full bg-highlight shadow-glow border-2 border-primary"></div>
                                        <div className="bg-secondary/40 p-5 rounded-2xl border border-white/5 hover:border-highlight/30 transition-all group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <span className="text-highlight font-mono font-black text-sm">{item.startTime}</span>
                                                    <h4 className="text-white font-black uppercase italic text-lg leading-none mt-1 group-hover:text-highlight transition-colors">{item.activityName}</h4>
                                                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">{item.description || 'Execução técnica e ajustes de alinhamento conforme o playbook.'}</p>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <span className="text-[10px] font-black text-text-secondary bg-white/5 px-2 py-1 rounded-lg uppercase whitespace-nowrap">{item.durationMinutes} MIN</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center opacity-30 italic font-black uppercase text-xs tracking-widest border-2 border-dashed border-white/10 rounded-[2rem]">
                                    Aguardando publicação do roteiro pelo Coach...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Lado Direito: Ações & Notas */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Botão de Confirmação */}
                    <button 
                        onClick={handleConfirm}
                        className={`w-full p-8 rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-4 transition-all transform active:scale-95 shadow-2xl ${hasConfirmed ? 'bg-highlight border-highlight shadow-glow text-white' : 'bg-red-600/10 border-red-500/40 text-red-500 hover:bg-red-600/20'}`}
                    >
                        {hasConfirmed ? (
                            <>
                                <CheckCircleIcon className="w-16 h-16 animate-bounce" />
                                <div className="text-center">
                                    <p className="text-2xl font-black uppercase italic leading-none">Present & Ready</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Confirmado no Roster de Hoje</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertTriangleIcon className="w-16 h-16 animate-pulse" />
                                <div className="text-center">
                                    <p className="text-2xl font-black uppercase italic leading-none">Confirmar Presença</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">Ação Obrigatória</p>
                                </div>
                            </>
                        )}
                    </button>

                    {/* Notas do Coach (Por que estamos treinando isso?) */}
                    <Card title="Sideline Notes (Foco)">
                         <div className="space-y-4">
                            <div className="bg-black/40 p-5 rounded-2xl border-l-4 border-highlight">
                                <p className="text-white text-sm italic font-medium leading-relaxed">
                                    "Atenção unidade de {session.target || 'Ataque/Defesa'}. Hoje o foco é 100% na execução do playbook. Quero ver intensidade máxima nos drills individuais. Estudem o roteiro e cheguem aquecidos."
                                </p>
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-black">HC</div>
                                    <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">— Coach Guto</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => navigate('/tactical-lab')}
                                className="w-full bg-white/5 hover:bg-highlight hover:text-white border border-white/10 text-text-secondary py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all"
                            >
                                <BookIcon className="w-4 h-4"/> Ver Playbook Relacionado
                            </button>
                         </div>
                    </Card>

                    {/* Brotherhood (Quem mais vai?) */}
                    <div className="bg-[#0F172A] rounded-[2rem] border border-white/5 p-6">
                        <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4">Unidade Confirmada</h4>
                        <div className="flex flex-wrap gap-2">
                            {session.attendees?.map((name, i) => (
                                <div key={i} title={name} className="w-10 h-10 rounded-xl bg-highlight/10 border border-highlight/20 flex items-center justify-center font-black text-highlight text-xs animate-fade-in">
                                    {name.charAt(0)}
                                </div>
                            ))}
                            {(!session.attendees || session.attendees.length === 0) && (
                                <p className="text-xs text-text-secondary italic opacity-50 py-4">Aguardando confirmações...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeDetail;