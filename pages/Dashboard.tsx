
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import Card from '../components/Card';
import { 
    ActivityIcon, UsersIcon, CheckCircleIcon, ClockIcon, 
    WalletIcon, SparklesIcon, WhistleIcon, TrophyIcon, TargetIcon,
    AlertTriangleIcon, TrendingUpIcon, HeartIcon, DumbbellIcon, BookIcon, StarIcon, CalendarIcon,
    ShieldCheckIcon, ClipboardIcon, ChevronRightIcon
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';
import { Objective, Player, Game, PracticeSession } from '../types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const toast = useToast();
    const [stats, setStats] = useState({ revenue: 15400, players: 0, attendance: 82, medicalAlerts: 3 });
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [practices, setPractices] = useState<PracticeSession[]>([]);

    useEffect(() => {
        const load = () => {
            const p = storageService.getPlayers() || [];
            const obj = storageService.getObjectives() || [];
            const g = storageService.getGames() || [];
            const pr = storageService.getPracticeSessions() || [];
            setPlayers(p);
            setObjectives(obj);
            setGames(g);
            setPractices(pr);
            setStats(prev => ({ ...prev, players: p.length }));
        };
        load();
        return storageService.subscribe('storage_update', load);
    }, []);

    const fullAgenda = useMemo(() => {
        const items = [
            ...games.map(g => ({ ...g, type: 'GAME' as const, title: `VS ${g.opponent}`, timestamp: new Date(g.date).getTime(), startTime: new Date(g.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) })),
            ...practices.map(p => ({ ...p, type: 'PRACTICE' as const, title: p.title, timestamp: new Date(p.date).getTime() }))
        ];
        return items.sort((a, b) => a.timestamp - b.timestamp);
    }, [games, practices]);

    const nextEvent = useMemo(() => {
        const now = Date.now();
        return fullAgenda.find(e => e.timestamp > now) || fullAgenda[0];
    }, [fullAgenda]);

    const handleEventClick = (event: any) => {
        if (event.type === 'PRACTICE') {
            navigate(`/practice-detail/${event.id}`);
        }
    };

    const renderPlayer = () => {
        const myPlayer = players.find(p => p.name.includes("Lucas")) || players[0];
        const isRegistrationComplete = myPlayer?.registration?.documentStatus === 'COMPLETE';
        
        return (
            <div className="flex flex-col h-full gap-6 animate-fade-in pb-20 overflow-x-hidden">
                {/* 1. NEXT UP HEADER (DYNAMIC) */}
                <div 
                    onClick={() => handleEventClick(nextEvent)}
                    className={`relative p-8 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row justify-between items-center transition-all cursor-pointer group ${nextEvent?.type === 'GAME' ? 'bg-gradient-to-r from-red-600 to-black' : 'bg-gradient-to-r from-blue-700 to-black'}`}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Next Up: Sua Missão</span>
                        <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none mt-2 group-hover:text-highlight transition-colors">{nextEvent?.title}</h2>
                        <div className="flex gap-4 mt-4">
                             <div className="flex items-center gap-1.5 text-xs text-white/80 font-bold uppercase">
                                 <CalendarIcon className="w-4 h-4" /> {new Date(nextEvent?.timestamp || 0).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-1.5 text-xs text-white/80 font-bold uppercase">
                                 <ClockIcon className="w-4 h-4" /> {nextEvent?.startTime || 'TBD'}
                             </div>
                        </div>
                    </div>
                    <button className="relative z-10 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase italic shadow-2xl transform active:scale-95 transition-all mt-6 md:mt-0 w-full md:w-auto">
                        Confirmar Presença
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            
                            {/* ESTUDO DE PLAYBOOK */}
                            <Card title="Study Room (Playbook)" className="relative overflow-hidden group h-full flex flex-col">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <BookIcon className="w-32 h-32 text-purple-400" />
                                </div>
                                <div className="p-2 flex-1 flex flex-col">
                                    <div className="w-full flex-1 bg-black/40 rounded-xl border border-white/10 mb-4 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Instalação da Semana</p>
                                            <p className="text-white font-black text-2xl italic uppercase tracking-tighter">Cover 3 Disguise</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/tactical-lab')}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl uppercase text-[10px] shadow-lg transition-all active:scale-95 shrink-0"
                                    >
                                        Entrar no Lab de Estudo
                                    </button>
                                </div>
                            </Card>

                            {/* LEGACY CARD & BIO-VAULT */}
                            <div className="flex flex-col gap-6">
                                <Card title="The Legacy (Card)" className="relative overflow-hidden group">
                                    <div className="flex items-center gap-4 py-2">
                                        <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-br from-highlight to-blue-500 shadow-glow relative transform group-hover:rotate-3 transition-transform">
                                            <LazyImage src={myPlayer?.avatarUrl || ''} className="w-full h-full rounded-2xl object-cover border-2 border-black" fallbackText="Thor" />
                                            <div className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 rounded-lg border border-highlight flex items-center justify-center font-black text-xs">{myPlayer?.level || 1}</div>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-white italic">{myPlayer?.rating || 70} OVR</p>
                                            <p className="text-[10px] text-text-secondary font-bold uppercase">{myPlayer?.position} • {myPlayer?.class || 'Rookie'}</p>
                                            <div className="w-32 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-highlight" style={{width: '75%'}}></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* DOSSIÊ CADASTRAL (SÚMULA) - ESTICADO PARA ALINHAR */}
                                <Card title="Dossiê Cadastral (Súmula)" className="border-indigo-500/30 flex-1 flex flex-col">
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${isRegistrationComplete ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                                                <span className="text-[10px] font-black text-white uppercase">Status Federativo:</span>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${isRegistrationComplete ? 'text-green-400' : 'text-red-400'}`}>
                                                {isRegistrationComplete ? 'APTO PARA JOGO' : 'PENDÊNCIA NO BID'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-black/20 p-4 rounded-lg border border-white/5 text-center">
                                                <p className="text-[8px] text-text-secondary uppercase">Jersey</p>
                                                <p className="text-lg font-black text-white">#{myPlayer?.jerseyNumber || '--'}</p>
                                            </div>
                                            <div className="bg-black/20 p-4 rounded-lg border border-white/5 text-center">
                                                <p className="text-[8px] text-text-secondary uppercase">Exame Med.</p>
                                                <p className={`text-lg font-black ${isRegistrationComplete ? 'text-green-400' : 'text-red-400'}`}>VÁLIDO</p>
                                            </div>
                                        </div>

                                        <div className="flex-1"></div>

                                        <button 
                                            onClick={() => navigate('/profile')}
                                            className="w-full bg-white/5 hover:bg-indigo-600 text-white font-black py-4 rounded-xl uppercase text-[10px] border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95 mt-4"
                                        >
                                            <ClipboardIcon className="w-4 h-4" /> Gerenciar Meu Dossiê
                                        </button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* IRON LAB FAST ACCESS */}
                        <div className="bg-gradient-to-br from-orange-600/20 to-black p-6 rounded-[2.5rem] border border-orange-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between group gap-6">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-orange-600/20 rounded-2xl group-hover:scale-110 transition-transform">
                                    <DumbbellIcon className="w-10 h-10 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tight leading-none">Iron Lab (Gym)</h4>
                                    <p className="text-[10px] text-orange-300 font-bold uppercase mt-1">Prontidão Física: Alta (92%)</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/academy')}
                                className="bg-orange-600 text-white font-black px-12 py-4 rounded-2xl uppercase text-[10px] shadow-lg transform active:scale-95 transition-all w-full md:w-auto"
                            >
                                Iniciar Treino
                            </button>
                        </div>
                    </div>

                    {/* AGENDA LATERAL (MOBILE FRIENDLY) */}
                    <div className="lg:col-span-4 flex flex-col h-full">
                        <div className="bg-[#0F172A] rounded-[2.5rem] border border-white/5 flex-1 flex flex-col overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                                <h3 className="text-xs font-black text-highlight uppercase tracking-[0.4em] flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4"/> Agenda Oficial
                                </h3>
                                <span className="text-[9px] font-bold text-text-secondary bg-white/5 px-2 py-1 rounded">2025 SEASON</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                                {fullAgenda.map((item, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => handleEventClick(item)}
                                        className={`p-4 rounded-2xl border flex items-center gap-4 transition-all group cursor-pointer ${item === nextEvent ? 'bg-highlight/10 border-highlight' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-all ${item.type === 'GAME' ? 'bg-red-600/10 border-red-500 text-red-400' : 'bg-blue-600/10 border-blue-500 text-blue-400'}`}>
                                            <span className="text-[8px] font-black uppercase leading-none">{new Date(item.timestamp).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                                            <span className="text-lg font-black">{new Date(item.timestamp).getDate()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[10px] font-black text-white uppercase italic truncate">{item.title}</h4>
                                            <span className="text-[8px] text-text-secondary uppercase tracking-[0.2em] font-black">{item.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full">
            {currentRole === 'PLAYER' ? renderPlayer() : (
                <div className="p-8 text-center text-text-secondary opacity-50 italic">Interface Administrativa Ativa</div>
            )}
        </div>
    );
};

export default Dashboard;