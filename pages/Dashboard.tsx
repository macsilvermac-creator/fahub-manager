
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import Card from '../components/Card';
import { 
    ActivityIcon, UsersIcon, CheckCircleIcon, ClockIcon, 
    WalletIcon, SparklesIcon, WhistleIcon, TrophyIcon, TargetIcon,
    AlertTriangleIcon, TrendingUpIcon, HeartIcon, DumbbellIcon, BookIcon, StarIcon, CalendarIcon
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
    const [program, setProgram] = useState('TACKLE');

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
            setProgram(storageService.getActiveProgram());
        };
        load();
        return storageService.subscribe('storage_update', load);
    }, []);

    // Lógica Unificada de Agenda
    /* Fix: Injected startTime into Game mapping to satisfy union type requirements for nextEvent access */
    const fullAgenda = useMemo(() => {
        const items = [
            ...games.map(g => ({ 
                ...g, 
                type: 'GAME' as const, 
                title: `VS ${g.opponent}`, 
                timestamp: new Date(g.date).getTime(),
                startTime: new Date(g.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            })),
            ...practices.map(p => ({ ...p, type: 'PRACTICE' as const, title: p.title, timestamp: new Date(p.date).getTime() }))
        ];
        return items.sort((a, b) => a.timestamp - b.timestamp);
    }, [games, practices]);

    const nextEvent = useMemo(() => {
        const now = Date.now();
        return fullAgenda.find(e => e.timestamp > now) || fullAgenda[0];
    }, [fullAgenda]);

    const handleXPGain = (amount: number, reason: string) => {
        toast.info(`+${amount} XP: ${reason}`);
    };

    // --- VISÃO MASTER (PRESIDÊNCIA) ---
    const renderMaster = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex justify-between items-center bg-[#0F172A] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Business Command</h2>
                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Saúde Institucional e Governança</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-text-secondary uppercase font-bold">Faturamento Mes</p>
                        <p className="text-xl font-black text-green-400">R$ {stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-right">
                        <p className="text-[10px] text-text-secondary uppercase font-bold">Churn Rate</p>
                        <p className="text-xl font-black text-red-400">2.4%</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Objetivos Estratégicos (OKRs)">
                    <div className="space-y-4">
                        {objectives.slice(0, 3).map(obj => (
                            <div key={obj.id} className="bg-black/20 p-3 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-white uppercase">{obj.title}</span>
                                    <span className="text-highlight font-black text-xs">{obj.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-highlight shadow-glow" style={{width: `${obj.progress}%`}}></div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-text-secondary transition-all">Ver Roadmap Completo</button>
                    </div>
                </Card>

                <Card title="Radar de Elenco">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-xs text-text-secondary">Atletas Federados</span>
                            <span className="text-white font-black">{stats.players}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-600/10 border border-red-500/20 rounded-xl">
                            <span className="text-xs text-red-300">Pendências Médicas</span>
                            <span className="text-red-400 font-black">{stats.medicalAlerts}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-highlight/10 border border-highlight/20 rounded-xl">
                            <span className="text-xs text-highlight">Novos Prospectos</span>
                            <span className="text-white font-black">12</span>
                        </div>
                    </div>
                </Card>

                <Card title="Ações de Diretoria">
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => navigate('/finance')} className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <WalletIcon className="w-6 h-6 text-highlight" />
                            <span className="text-[10px] font-black uppercase text-white">Financeiro</span>
                        </button>
                        <button onClick={() => navigate('/roster')} className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <UsersIcon className="w-6 h-6 text-blue-400" />
                            <span className="text-[10px] font-black uppercase text-white">Roster</span>
                        </button>
                        <button onClick={() => navigate('/digital-store')} className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <TrendingUpIcon className="w-6 h-6 text-yellow-500" />
                            <span className="text-[10px] font-black uppercase text-white">Marketing</span>
                        </button>
                        <button onClick={() => navigate('/recruitment')} className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <TargetIcon className="w-6 h-6 text-purple-400" />
                            <span className="text-[10px] font-black uppercase text-white">Tryouts</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- VISÃO COACH (TÉCNICO) ---
    const renderCoach = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-end md:items-center">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <WhistleIcon className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.4em]">Sideline Operations</span>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mt-2">Próxima Instalação</h2>
                    <p className="text-blue-100 font-bold mt-4 uppercase text-xs flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" /> Terça-feira, 19:30 • Campo de Treino
                    </p>
                </div>
                <button onClick={() => navigate('/training-day')} className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase italic shadow-xl transform active:scale-95 transition-all mt-6 md:mt-0">
                    Ver Roteiro de Hoje
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Prontidão do Elenco (Readiness)">
                    <div className="flex items-center gap-8 py-4">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-white/5" />
                                <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray="364" strokeDashoffset="72" className="text-blue-400" />
                            </svg>
                            <span className="absolute text-3xl font-black text-white italic">80%</span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-text-secondary font-bold uppercase">
                                <CheckCircleIcon className="text-green-500 w-4 h-4" /> 38 Atletas Aptos
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary font-bold uppercase">
                                <AlertTriangleIcon className="text-red-500 w-4 h-4" /> 4 No Departamento Médico
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary font-bold uppercase">
                                <ClockIcon className="text-yellow-500 w-4 h-4" /> 6 Em Observação
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Inteligência Tática">
                    <div className="grid grid-cols-2 gap-4">
                        <div onClick={() => navigate('/tactical-lab')} className="bg-black/20 p-4 rounded-2xl border border-white/5 hover:border-blue-500 transition-all cursor-pointer">
                             <SparklesIcon className="w-8 h-8 text-purple-400 mb-2" />
                             <h4 className="text-white font-bold text-xs uppercase">Playbook IA</h4>
                             <p className="text-[9px] text-text-secondary mt-1">Sugerir Drills para Redzone</p>
                        </div>
                        <div onClick={() => navigate('/roster')} className="bg-black/20 p-4 rounded-2xl border border-white/5 hover:border-blue-500 transition-all cursor-pointer">
                             <ActivityIcon className="w-8 h-8 text-blue-400 mb-2" />
                             <h4 className="text-white font-bold text-xs uppercase">Depth Chart</h4>
                             <p className="text-[9px] text-text-secondary mt-1">Gerenciar Rotação Ativa</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- VISÃO ATLETA (JOGADOR) ---
    const renderPlayer = () => {
        const myPlayer = players.find(p => p.name.includes("Lucas")) || players[0];
        
        return (
            <div className="flex flex-col h-full gap-6 animate-fade-in pb-20">
                {/* 1. NEXT UP HEADER (DYNAMIC) */}
                <div className={`relative p-8 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row justify-between items-center transition-all ${nextEvent?.type === 'GAME' ? 'bg-gradient-to-r from-red-600 to-black' : 'bg-gradient-to-r from-blue-700 to-black'}`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative z-10">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Next Up: Sua Missão</span>
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mt-2">{nextEvent?.title}</h2>
                        <div className="flex gap-4 mt-4">
                             <div className="flex items-center gap-1.5 text-xs text-white/80 font-bold uppercase">
                                 <CalendarIcon className="w-4 h-4" /> {new Date(nextEvent?.timestamp || 0).toLocaleDateString()}
                             </div>
                             <div className="flex items-center gap-1.5 text-xs text-white/80 font-bold uppercase">
                                 <ClockIcon className="w-4 h-4" /> {nextEvent?.startTime || 'TBD'}
                             </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleXPGain(10, "Presença Confirmada")}
                        className="relative z-10 bg-white text-black px-10 py-5 rounded-2xl font-black uppercase italic shadow-2xl transform active:scale-95 transition-all mt-6 md:mt-0"
                    >
                        Confirmar Presença
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COMMAND AREA (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* STUDY ROOM */}
                            <Card title="Study Room (Playbook)" className="relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <BookIcon className="w-32 h-32 text-purple-400" />
                                </div>
                                <div className="p-2">
                                    <div className="w-full h-32 bg-black/40 rounded-xl border border-white/10 mb-4 flex items-center justify-center">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-purple-400 uppercase">Instalação da Semana</p>
                                            <p className="text-white font-bold italic">Cover 3 Disguise</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { navigate('/tactical-lab'); handleXPGain(5, "Estudo de Playbook"); }}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-xl uppercase text-[10px] shadow-lg transition-all"
                                    >
                                        Entrar no Lab de Estudo
                                    </button>
                                </div>
                            </Card>

                            {/* THE LEGACY */}
                            <Card title="The Legacy (Stats)" className="relative overflow-hidden group">
                                <div className="flex items-center gap-4 py-2">
                                    <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-br from-highlight to-blue-500 shadow-glow relative transform group-hover:rotate-3 transition-transform">
                                        <LazyImage src={myPlayer?.avatarUrl || ''} className="w-full h-full rounded-2xl object-cover border-2 border-black" fallbackText="Thor" />
                                        <div className="absolute -top-2 -right-2 bg-black text-white w-8 h-8 rounded-lg border border-highlight flex items-center justify-center font-black text-xs">{myPlayer?.level}</div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-white italic">{myPlayer?.rating} OVR</p>
                                        <p className="text-[10px] text-text-secondary font-bold uppercase">{myPlayer?.position} • FAHUB STARS</p>
                                        <div className="w-32 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-highlight" style={{width: '75%'}}></div>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate('/profile')}
                                    className="w-full bg-white/5 hover:bg-white/10 text-white font-black py-3 rounded-xl uppercase text-[10px] mt-4 border border-white/10 transition-all"
                                >
                                    Ver Meu Dossiê
                                </button>
                            </Card>
                        </div>

                        {/* IRON LAB */}
                        <div className="bg-gradient-to-br from-orange-600/20 to-black p-6 rounded-[2.5rem] border border-orange-500/20 shadow-xl flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-orange-600/20 rounded-2xl group-hover:scale-110 transition-transform">
                                    <DumbbellIcon className="w-10 h-10 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tight leading-none">Iron Lab (Gym)</h4>
                                    <p className="text-[10px] text-orange-300 font-bold uppercase mt-1">Status: Prontidão Física 92%</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/academy')}
                                className="bg-orange-600 text-white font-black px-8 py-3 rounded-2xl uppercase text-[10px] shadow-lg transform active:scale-95 transition-all"
                            >
                                Iniciar Treino
                            </button>
                        </div>
                    </div>

                    {/* RIGHT AGENDA AREA (4 cols) */}
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
                                    <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all group cursor-pointer ${item === nextEvent ? 'bg-highlight/10 border-highlight' : 'bg-black/20 border-white/5 hover:border-white/20'}`}>
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
            {currentRole === 'MASTER' && renderMaster()}
            {currentRole === 'HEAD_COACH' && renderCoach()}
            {currentRole === 'PLAYER' && renderPlayer()}
        </div>
    );
};

export default Dashboard;