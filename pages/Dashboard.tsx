
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext, UserContextType } from '@/components/Layout';
import { storageService } from '@/services/storageService';
import Card from '@/components/Card';
import { 
    UsersIcon, CheckCircleIcon, ClockIcon, 
    BookIcon, StarIcon, CalendarIcon,
    ShieldCheckIcon, ClipboardIcon, ChevronRightIcon,
    DumbbellIcon, WhistleIcon, AlertTriangleIcon, ActivityIcon, SparklesIcon
} from '@/components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';
import { Player, Game, PracticeSession } from '@/types';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [practices, setPractices] = useState<PracticeSession[]>([]);

    useEffect(() => {
        const load = () => {
            const p = storageService.getPlayers();
            const g = storageService.getGames();
            const pr = storageService.getPracticeSessions();
            
            setPlayers(prev => JSON.stringify(prev) !== JSON.stringify(p) ? p : prev);
            setGames(prev => JSON.stringify(prev) !== JSON.stringify(g) ? g : prev);
            setPractices(prev => JSON.stringify(prev) !== JSON.stringify(pr) ? pr : prev);
        };
        
        load();
        const unsubscribe = storageService.subscribe('storage_update', load);
        return () => unsubscribe();
    }, []);

    const fullAgenda = useMemo(() => {
        const items = [
            ...games.map(g => ({ ...g, type: 'GAME' as const, title: `VS ${g.opponent}`, timestamp: new Date(g.date).getTime() })),
            ...practices.map(p => ({ ...p, type: 'PRACTICE' as const, title: p.title, timestamp: new Date(p.date).getTime() }))
        ];
        return items.sort((a, b) => a.timestamp - b.timestamp);
    }, [games, practices]);

    const nextEvent = useMemo(() => {
        const now = Date.now();
        return fullAgenda.find(e => e.timestamp > now) || fullAgenda[0];
    }, [fullAgenda]);

    const renderCoach = () => {
        const activePlayers = players.filter(p => p.status === 'ACTIVE').length;
        const injuredPlayers = players.filter(p => p.status === 'INJURED' || p.status === 'IR').length;
        const pendingBid = players.filter(p => p.registration?.documentStatus !== 'COMPLETE').length;

        return (
            <div className="flex flex-col h-full gap-6 animate-fade-in pb-20 overflow-x-hidden">
                {/* Banner de Missão do Coach */}
                <div 
                    onClick={() => navigate('/schedule')}
                    className="relative p-8 min-h-[160px] rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row justify-between items-center transition-all cursor-pointer group bg-gradient-to-r from-[#1e293b] to-black"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-16 h-16 bg-highlight rounded-2xl flex items-center justify-center shadow-glow">
                            <WhistleIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-highlight uppercase tracking-[0.4em]">War Room Status</span>
                            <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter leading-none mt-2">
                                {nextEvent?.type === 'GAME' ? `Preparação: ${nextEvent.title}` : 'Sem jogos agendados'}
                            </h2>
                            <p className="text-text-secondary text-[10px] font-bold uppercase mt-1">Clique para ajustar a Call Sheet</p>
                        </div>
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <div className="text-center px-6 border-r border-white/10">
                            <p className="text-[10px] text-text-secondary uppercase font-black">Ready</p>
                            <p className="text-2xl font-black text-white italic">{activePlayers}</p>
                        </div>
                        <div className="text-center px-6">
                            <p className="text-[10px] text-red-500 uppercase font-black">Out</p>
                            <p className="text-2xl font-black text-red-500 italic">{injuredPlayers}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Widgets de Prontidão */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                                    <UsersIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-text-secondary font-black uppercase">Presença (3T)</p>
                                    <p className="text-lg font-black text-white">84% <span className="text-[8px] text-green-400">▲ 2%</span></p>
                                </div>
                            </div>
                            <div className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-orange-600/20 rounded-xl text-orange-400">
                                    <ActivityIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-text-secondary font-black uppercase">Média RPE</p>
                                    <p className="text-lg font-black text-white">7.2 <span className="text-[8px] text-text-secondary">/ 10</span></p>
                                </div>
                            </div>
                            <div className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 flex items-center gap-4">
                                <div className="p-3 bg-red-600/20 rounded-xl text-red-400">
                                    <AlertTriangleIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-text-secondary font-black uppercase">Bloqueio BID</p>
                                    <p className="text-lg font-black text-red-400">{pendingBid} Atletas</p>
                                </div>
                            </div>
                        </div>

                        {/* IA Tactical Intel */}
                        <Card title="Intelligence Center (IA)" className="border-purple-500/20 bg-gradient-to-br from-purple-900/5 to-transparent">
                             <div className="flex items-start gap-4">
                                 <div className="p-3 bg-purple-600/20 rounded-2xl animate-pulse">
                                     <SparklesIcon className="w-6 h-6 text-purple-400" />
                                 </div>
                                 <div className="flex-1">
                                     <h4 className="text-white font-bold text-sm uppercase italic">Sugestão Técnica da Semana</h4>
                                     <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                                         Detectamos baixa eficiência em terceiras descidas curtas no último treino. 
                                         <strong className="text-purple-400"> Recomendação:</strong> Incluir 15min de Drills de Inside Run focados em "Lead Block" para a Unidade Ofensiva.
                                     </p>
                                     <button onClick={() => navigate('/intel')} className="mt-4 text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors">Abrir Análise de Vídeo →</button>
                                 </div>
                             </div>
                        </Card>

                        {/* Roster Quick View */}
                        <Card title="Recent Activity (Team Feed)">
                            <div className="space-y-4">
                                {storageService.getSocialFeed().slice(0, 3).map(post => (
                                    <div key={post.id} className="flex gap-4 p-3 bg-black/20 rounded-2xl border border-white/5">
                                        <LazyImage src={post.authorAvatar} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="text-xs font-bold text-white leading-none">{post.authorName}</p>
                                            <p className="text-[10px] text-text-secondary mt-1">{post.content}</p>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => navigate('/locker-room')} className="w-full py-3 text-[10px] font-black text-text-secondary uppercase hover:text-white transition-colors border-t border-white/5">Ver Vestiário Completo</button>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar da Agenda */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#0F172A] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl min-h-[500px] flex flex-col">
                            <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                                <h3 className="text-xs font-black text-highlight uppercase tracking-[0.4em] flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4"/> Agenda Operacional
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                                {fullAgenda.map((item, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${item === nextEvent ? 'bg-highlight/10 border-highlight' : 'bg-black/20 border-white/5'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border ${item.type === 'GAME' ? 'bg-red-600/10 border-red-500 text-red-400' : 'bg-blue-600/10 border-blue-500 text-blue-400'}`}>
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

    const renderPlayer = () => {
        const myPlayer = players.find(p => p.name.includes("Lucas")) || players[0];
        const isRegistrationComplete = myPlayer?.registration?.documentStatus === 'COMPLETE';
        
        return (
            <div className="flex flex-col h-full gap-6 animate-fade-in pb-20 overflow-x-hidden">
                <div 
                    onClick={() => nextEvent?.type === 'PRACTICE' && navigate(`/practice-detail/${nextEvent.id}`)}
                    className={`relative p-8 min-h-[160px] rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row justify-between items-center transition-all cursor-pointer group ${nextEvent?.type === 'GAME' ? 'bg-gradient-to-r from-red-600 to-black' : 'bg-gradient-to-r from-blue-700 to-black'}`}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative z-10 max-w-[75%]">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Próximo Compromisso</span>
                        <h2 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter leading-none mt-3 whitespace-nowrap overflow-hidden text-ellipsis">
                            {nextEvent?.title || 'Agenda Vazia'}
                        </h2>
                    </div>
                    <button className="relative z-10 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase italic shadow-2xl transform active:scale-95 hover:scale-105 transition-all mt-4 md:mt-0 min-w-[140px] text-sm">
                        START
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-stretch">
                            <Card title="Study Room (Playbook)" className="relative overflow-hidden group h-full flex flex-col border-purple-500/20">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <BookIcon className="w-32 h-32 text-purple-400" />
                                </div>
                                <div className="p-2 flex-1 flex flex-col">
                                    <div className="w-full flex-1 bg-black/40 rounded-[2rem] border border-white/10 mb-4 flex items-center justify-center min-h-[160px]">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Instalação da Semana</p>
                                            <p className="text-white font-black text-2xl italic uppercase tracking-tighter">Cover 3 Disguise</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate('/tactical-lab')}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl uppercase text-[10px] shadow-lg transition-all active:scale-95"
                                    >
                                        Entrar no Lab de Estudo
                                    </button>
                                </div>
                            </Card>

                            <div className="flex flex-col gap-6 h-full">
                                <Card title="The Legacy" className="relative overflow-hidden group border-highlight/20 shrink-0">
                                    <div className="flex items-center gap-4 py-1">
                                        <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-br from-highlight to-blue-500 shadow-glow relative transform group-hover:rotate-3 transition-transform">
                                            <LazyImage src={myPlayer?.avatarUrl || ''} className="w-full h-full rounded-2xl object-cover border-2 border-black" fallbackText="Thor" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-white italic">{myPlayer?.rating || 70} OVR</p>
                                            <p className="text-[10px] text-text-secondary font-bold uppercase">{myPlayer?.position} • {myPlayer?.class || 'Rookie'}</p>
                                        </div>
                                    </div>
                                </Card>

                                <Card title="Dossiê Cadastral (Súmula)" className="border-indigo-500/30 flex-1 flex flex-col bg-gradient-to-br from-secondary to-[#0f172a]">
                                    <div className="space-y-4 flex-1 flex flex-col justify-between">
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
                                            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                                                <p className="text-[8px] text-text-secondary uppercase font-bold mb-1">Jersey</p>
                                                <p className="text-2xl font-black text-white italic">#{myPlayer?.jerseyNumber || '--'}</p>
                                            </div>
                                            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-center">
                                                <p className="text-[8px] text-text-secondary uppercase font-bold mb-1">Exame Med.</p>
                                                <p className={`text-sm font-black uppercase ${isRegistrationComplete ? 'text-green-400' : 'text-red-400'}`}>Válido 2025</p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => navigate('/profile')}
                                            className="w-full bg-white/5 hover:bg-indigo-600 text-white font-black py-4 rounded-xl uppercase text-[10px] border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <ClipboardIcon className="w-4 h-4" /> Gerenciar Meu Dossiê
                                        </button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-600/20 to-black p-6 rounded-[2.5rem] border border-orange-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between group gap-6 shrink-0">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-orange-600/20 rounded-2xl group-hover:scale-110 transition-transform">
                                    <DumbbellIcon className="w-10 h-10 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black text-white italic uppercase tracking-tight leading-none">Iron Lab (Gym)</h4>
                                    <p className="text-[10px] text-orange-300 font-bold uppercase mt-1">Status Físico: 92% Ready</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/academy')} className="bg-orange-600 text-white font-black px-12 py-4 rounded-2xl uppercase text-[10px] shadow-lg transform active:scale-95 transition-all w-full md:w-auto">
                                Iniciar Treino
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 h-full">
                        <div className="bg-[#0F172A] rounded-[2.5rem] border border-white/5 h-full flex flex-col overflow-hidden shadow-2xl min-h-[500px]">
                            <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center">
                                <h3 className="text-xs font-black text-highlight uppercase tracking-[0.4em] flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4"/> Agenda Oficial
                                </h3>
                                <span className="text-[9px] font-bold text-text-secondary bg-white/5 px-2 py-1 rounded">2025</span>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                                {fullAgenda.map((item, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${item === nextEvent ? 'bg-highlight/10 border-highlight' : 'bg-black/20 border-white/5'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 border ${item.type === 'GAME' ? 'bg-red-600/10 border-red-500 text-red-400' : 'bg-blue-600/10 border-blue-500 text-blue-400'}`}>
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
            {currentRole === 'PLAYER' ? renderPlayer() : 
             (currentRole === 'HEAD_COACH' || currentRole === 'OFFENSIVE_COORD' || currentRole === 'DEFENSIVE_COORD') ? renderCoach() :
                <div className="p-20 text-center text-text-secondary opacity-30 italic font-black uppercase">Interface Administrativa Ativa</div>
            }
        </div>
    );
};

export default Dashboard;
