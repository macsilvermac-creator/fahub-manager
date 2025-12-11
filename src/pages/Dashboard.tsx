
import React, { useContext, useEffect, useState, Suspense } from 'react';
import Card from '../components/Card';
import { Player } from '../types';
import { CalendarIcon, UsersIcon, AlertTriangleIcon, BankIcon, ClipboardIcon, DumbbellIcon, CheckCircleIcon, SparklesIcon, ActivityIcon, TrendingUpIcon, MapPinIcon, ClockIcon } from '../components/icons/UiIcons';
import { TrophyIcon, BookIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import LazyImage from '@/components/LazyImage';

// Lazy Load Modules (Mantendo a performance alta)
const PracticePlan = React.lazy(() => import('./PracticePlan'));
const CoachGameDay = React.lazy(() => import('./CoachGameDay'));
const Roster = React.lazy(() => import('./Roster'));
const Schedule = React.lazy(() => import('./Schedule'));
const Staff = React.lazy(() => import('./Staff'));
const PerformanceLab = React.lazy(() => import('./PerformanceLab'));
const VideoAnalysis = React.lazy(() => import('./VideoAnalysis'));
const TacticalLab = React.lazy(() => import('./TacticalLab'));
const Academy = React.lazy(() => import('./Academy'));

// --- VIEW 1: ATHLETE EXPERIENCE (Gamified & Simple) ---
const AthleteDashboard = ({ player, nextGame, nextPractice, navigate }: any) => {
    if (!player) return <div className="text-white text-center py-10">Carregando Perfil...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Header com Identidade Visual */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-secondary to-primary p-6 rounded-2xl border border-white/10 shadow-lg">
                <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-highlight to-blue-500 shadow-glow relative">
                    <LazyImage src={player.avatarUrl || ''} className="w-full h-full rounded-full object-cover border-4 border-[#0B1120]" />
                    <div className="absolute -bottom-2 -right-2 bg-[#0B1120] text-white text-xs font-bold px-2 py-1 rounded-full border border-white/20">
                        LVL {player.level}
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase italic">{player.name}</h1>
                    <p className="text-text-secondary text-sm font-semibold">{player.position} • {player.class}</p>
                    <div className="mt-2 w-48 h-2 bg-black/50 rounded-full overflow-hidden">
                        <div className="h-full bg-highlight" style={{ width: `${(player.xp % 1000) / 10}%` }}></div>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-1">XP para o próximo nível</p>
                </div>
            </div>

            {/* ALERTAS DE TREINO (FIXED: CRITICAL ALERT VISIBILITY) */}
            {nextPractice ? (
                <div 
                    onClick={() => navigate('/practice')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 border-2 border-blue-400/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer hover:scale-[1.01] transition-transform relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <DumbbellIcon className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-white text-blue-700 text-xs font-black px-2 py-1 rounded uppercase animate-pulse">
                                {new Date(nextPractice.date).toDateString() === new Date().toDateString() ? 'TREINO HOJE' : 'PRÓXIMO TREINO'}
                            </span>
                            <span className="text-blue-200 text-xs font-bold uppercase">{new Date(nextPractice.date).toLocaleDateString()}</span>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-1 uppercase italic">{nextPractice.title}</h2>
                        <p className="text-white/90 font-medium text-sm mb-4 max-w-md">{nextPractice.focus}</p>
                        
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg text-sm text-white">
                                <ClockIcon className="w-4 h-4 text-blue-300" />
                                {new Date(nextPractice.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg text-sm text-white">
                                <MapPinIcon className="w-4 h-4 text-red-300" />
                                {nextPractice.locationType === 'FIELD' ? 'Campo' : 'Academia/Sala'}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-secondary/50 rounded-xl border border-white/5 text-center text-text-secondary text-sm">
                    Nenhum treino agendado nos próximos dias. Aproveite o descanso! 😴
                </div>
            )}

            {/* Ação Primária: Jogo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border-l-4 border-red-500 shadow-lg relative overflow-hidden group hover:border-red-400 transition-all cursor-pointer" onClick={() => navigate('/schedule')}>
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrophyIcon className="w-24 h-24 text-red-400" />
                    </div>
                    <h3 className="text-red-400 text-xs font-bold uppercase mb-2">Próximo Jogo</h3>
                    
                    {nextGame ? (
                        <div className="mb-4">
                            <p className="text-2xl font-black text-white mb-1 uppercase italic">vs {nextGame.opponent}</p>
                            <p className="text-sm text-gray-300 flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4"/> 
                                {new Date(nextGame.date).toLocaleDateString()} às {new Date(nextGame.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    ) : (
                        <div className="py-4 text-text-secondary">Nenhum jogo agendado.</div>
                    )}
                </div>

                <div className="bg-gradient-to-br from-purple-900/40 to-black p-6 rounded-2xl border-l-4 border-purple-500 shadow-lg relative overflow-hidden group hover:border-purple-400 transition-all cursor-pointer" onClick={() => navigate('/gemini-playbook')}>
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BookIcon className="w-24 h-24 text-purple-400" />
                    </div>
                    <h3 className="text-purple-300 text-xs font-bold uppercase mb-2">Estudo Tático</h3>
                    <p className="text-2xl font-black text-white mb-1">Playbook Digital</p>
                    <p className="text-sm text-text-secondary mb-4">Novas jogadas foram adicionadas pelo Coach.</p>
                    <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                        <SparklesIcon className="w-5 h-5"/> Estudar Agora
                    </button>
                </div>
            </div>

            {/* Atalhos Secundários */}
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate('/profile')} className="bg-secondary hover:bg-white/10 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2 transition-all">
                    <ActivityIcon className="w-8 h-8 text-green-400" />
                    <span className="font-bold text-white text-sm">Meus Highlights</span>
                </button>
                <button onClick={() => navigate('/finance')} className="bg-secondary hover:bg-white/10 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2 transition-all">
                    <BankIcon className="w-8 h-8 text-yellow-400" />
                    <span className="font-bold text-white text-sm">Mensalidades</span>
                </button>
            </div>
        </div>
    );
};

// --- VIEW 2: COACH COMMAND CENTER (Operational) ---
const CoachDashboard = React.memo(({ setActiveHub, setActiveModule, nextGame, stats }: any) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-[calc(100vh-180px)]">
        {/* Main Action: Training & Game */}
        <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex-1 bg-gradient-to-br from-highlight/20 to-secondary rounded-3xl p-8 border border-highlight/20 flex flex-col justify-center items-center text-center cursor-pointer hover:border-highlight/50 transition-all group shadow-lg relative overflow-hidden" onClick={() => { setActiveHub('TRAINING'); setActiveModule('PRACTICE'); }}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="bg-highlight/20 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform relative z-10">
                    <DumbbellIcon className="w-16 h-16 text-highlight" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight relative z-10">Gestão de Treino</h2>
                <p className="text-gray-300 mt-2 text-sm relative z-10">Planejamento, Presença e Scripts</p>
                <button className="mt-4 px-6 py-2 bg-highlight hover:bg-highlight-hover text-white font-bold rounded-full text-sm relative z-10">
                    Iniciar Sessão
                </button>
            </div>
            
            <div className="flex-1 bg-gradient-to-br from-red-900/40 to-secondary rounded-3xl p-8 border border-red-500/20 flex flex-col justify-center items-center text-center cursor-pointer hover:border-red-500/50 transition-all group shadow-lg relative overflow-hidden" onClick={() => { setActiveHub('GAME'); setActiveModule('MISSION_CONTROL'); }}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="bg-red-600/20 p-6 rounded-full mb-4 group-hover:scale-110 transition-transform relative z-10">
                    <TrophyIcon className="w-16 h-16 text-red-400" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight relative z-10">Game Day Mode</h2>
                <p className="text-red-200 mt-2 text-sm relative z-10">{nextGame ? `Próximo: vs ${nextGame.opponent}` : 'Nenhum jogo agendado'}</p>
            </div>
        </div>

        {/* Side Actions: Planning & Analysis */}
        <div className="flex flex-col gap-4">
            <div className="flex-1 bg-secondary rounded-2xl p-6 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-center" onClick={() => { setActiveHub('PLANNING'); setActiveModule('ROSTER'); }}>
                <ClipboardIcon className="w-10 h-10 text-green-400 mb-3" />
                <h3 className="font-bold text-white text-lg">Elenco & Depth</h3>
                <p className="text-xs text-text-secondary mt-1">{stats?.activePlayers || 0} Ativos</p>
            </div>
            
            <div className="flex-1 bg-secondary rounded-2xl p-6 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-center" onClick={() => { setActiveHub('STUDY'); setActiveModule('VIDEO'); }}>
                <BookIcon className="w-10 h-10 text-yellow-400 mb-3" />
                <h3 className="font-bold text-white text-lg">Vídeo & Scout</h3>
                <p className="text-xs text-text-secondary mt-1">Análise Tática</p>
            </div>

            <div className="flex-1 bg-secondary rounded-2xl p-6 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-center" onClick={() => { setActiveHub('TRAINING'); setActiveModule('PERFORMANCE'); }}>
                <ActivityIcon className="w-10 h-10 text-pink-400 mb-3" />
                <h3 className="font-bold text-white text-lg">Performance Lab</h3>
                <p className="text-xs text-text-secondary mt-1">{stats?.injuredPlayers || 0} Lesionados</p>
            </div>
        </div>
    </div>
));

// --- VIEW 3: OFFICE / ADMIN DASHBOARD (Data & Processes) ---
const OfficeDashboard = ({ stats, navigate }: any) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUpIcon className="w-6 h-6 text-green-400"/> Visão Executiva
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-secondary p-5 rounded-xl border-l-4 border-green-500 shadow-sm cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => navigate('/finance')}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase group-hover:text-green-400 transition-colors">Fluxo de Caixa</p>
                        <p className="text-2xl font-black text-white mt-1">R$ 125k</p>
                    </div>
                    <BankIcon className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-[10px] text-green-400 mt-2">▲ 12% vs mês passado</p>
            </div>

            <div className="bg-secondary p-5 rounded-xl border-l-4 border-blue-500 shadow-sm cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => navigate('/staff')}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase group-hover:text-blue-400 transition-colors">Staff & RH</p>
                        <p className="text-2xl font-black text-white mt-1">24</p>
                    </div>
                    <UsersIcon className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-[10px] text-orange-400 mt-2">3 Contratos Pendentes</p>
            </div>

            <div className="bg-secondary p-5 rounded-xl border-l-4 border-pink-500 shadow-sm cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => navigate('/marketing')}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase group-hover:text-pink-400 transition-colors">Marketing</p>
                        <p className="text-2xl font-black text-white mt-1">1.2k</p>
                    </div>
                    <SparklesIcon className="w-6 h-6 text-pink-500" />
                </div>
                <p className="text-[10px] text-text-secondary mt-2">Leads de Seletiva</p>
            </div>

            <div className="bg-secondary p-5 rounded-xl border-l-4 border-yellow-500 shadow-sm cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => navigate('/logistics')}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase group-hover:text-yellow-400 transition-colors">Logística</p>
                        <p className="text-2xl font-black text-white mt-1">Pronta</p>
                    </div>
                    <AlertTriangleIcon className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-[10px] text-text-secondary mt-2">Próxima viagem: Sábado</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Acesso Rápido">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/tasks')} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:border-highlight text-left">
                        <h4 className="font-bold text-white">Tarefas & Projetos</h4>
                        <p className="text-xs text-text-secondary">Kanban Board</p>
                    </button>
                    <button onClick={() => navigate('/inventory')} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:border-highlight text-left">
                        <h4 className="font-bold text-white">Inventário</h4>
                        <p className="text-xs text-text-secondary">Gestão de Equipamentos</p>
                    </button>
                </div>
            </Card>
        </div>
    </div>
);

// --- MAIN CONTAINER ---
const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const [rawCoachStats, setRawCoachStats] = useState<any>(null);
    const [nextPractice, setNextPractice] = useState<any>(null);
    const [activeHub, setActiveHub] = useState<string | null>(null);
    const [activeModule, setActiveModule] = useState<string>('');
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    
    // Role Checks
    const isBackoffice = ['MASTER', 'FINANCIAL_MANAGER', 'MARKETING_MANAGER', 'COMMERCIAL_MANAGER'].includes(currentRole);
    const isCoach = ['HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD'].includes(currentRole);
    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        // PERFORMANCE: Separação de threads e carregamento otimizado
        setTimeout(() => {
            // 1. DADOS DE TREINO (CRÍTICO PARA ATLETA)
            const practices = storageService.getPracticeSessions();
            const now = new Date();
            // TOLERÂNCIA EXPANDIDA: Olha 6 horas para trás para pegar treinos que "acabaram de começar" ou estão rolando
            const lookback = new Date(now.getTime() - 6 * 60 * 60 * 1000);
            
            const upcoming = practices
                .filter(p => new Date(p.date) >= lookback)
                .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (upcoming.length > 0) setNextPractice(upcoming[0]);

            // 2. DADOS DO USUÁRIO (Leve)
            const user = authService.getCurrentUser();
            const players = storageService.getPlayers();
            if (isPlayer && user) {
                const me = players.find(p => p.name === user.name);
                setCurrentPlayer(me || players[0]); 
            }

            // 3. DADOS DE COACH/ADMIN (Pesado - só carrega se não for atleta)
            if (!isPlayer) {
                const stats = storageService.getCoachDashboardStats();
                setRawCoachStats(stats);
            } else {
                // Para atleta, carregamos apenas o próximo jogo de forma leve
                const games = storageService.getGames();
                const nextGame = games
                    .filter(g => new Date(g.date) > now && g.status === 'SCHEDULED')
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
                setRawCoachStats({ nextGame });
            }

        }, 50);
    }, [currentRole, activeHub, isPlayer]);

    // --- RENDERIZADORES DE SUB-MÓDULOS DO COACH ---
    if (activeHub) {
        const renderHeader = (title: string, modules: any[]) => (
            <div className="sticky top-0 z-30 bg-primary pt-2 pb-4">
                <div className="flex items-center justify-between mb-3">
                     <button onClick={() => setActiveHub(null)} className="text-white flex items-center gap-2 font-bold text-sm bg-secondary px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        ← Voltar para Dashboard
                    </button>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{title} Hub</span>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {modules.map(m => (
                        <button key={m.id} onClick={() => setActiveModule(m.id)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeModule === m.id ? 'bg-white text-black shadow-glow' : 'bg-secondary text-text-secondary border border-white/10 hover:text-white'}`}>
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>
        );

        return (
            <div className="pb-20 min-h-screen">
                 <Suspense fallback={<div className="p-4 space-y-4"><Skeleton height="50px" /><Skeleton height="400px" /></div>}>
                    {activeHub === 'TRAINING' && (
                        <>
                            {renderHeader("Treino & Físico", [{id:'PRACTICE', label:'Roteiro IA'}, {id:'PERFORMANCE', label:'Performance Lab'}])}
                            {activeModule === 'PRACTICE' && <PracticePlan />}
                            {activeModule === 'PERFORMANCE' && <PerformanceLab />}
                        </>
                    )}
                    {activeHub === 'GAME' && (
                        <>
                             {renderHeader("Dia de Jogo", [{id:'MISSION_CONTROL', label:'Mission Control'}, {id:'CALL_SHEET', label:'Call Sheet'}, {id:'SCOUT', label:'Scout Report'}])}
                             {activeModule === 'MISSION_CONTROL' && <CoachGameDay />}
                             {activeModule === 'CALL_SHEET' && <TacticalLab />}
                             {activeModule === 'SCOUT' && <VideoAnalysis />}
                        </>
                    )}
                    {activeHub === 'PLANNING' && (
                         <>
                             {renderHeader("Gestão Técnica", [{id:'ROSTER', label:'Elenco & Depth'}, {id:'SCHEDULE', label:'Calendário'}, {id:'STAFF', label:'Staff'}])}
                             {activeModule === 'ROSTER' && <Roster />}
                             {activeModule === 'SCHEDULE' && <Schedule />}
                             {activeModule === 'STAFF' && <Staff />}
                         </>
                    )}
                    {activeHub === 'STUDY' && (
                         <>
                             {renderHeader("Inteligência", [{id:'VIDEO', label:'Vision Core (Vídeo)'}, {id:'TACTICS', label:'Laboratório Tático'}, {id:'ACADEMY', label:'Playbook Academy'}])}
                             {activeModule === 'VIDEO' && <VideoAnalysis />}
                             {activeModule === 'TACTICS' && <TacticalLab />}
                             {activeModule === 'ACADEMY' && <Academy />}
                         </>
                    )}
                 </Suspense>
            </div>
        );
    }

    if (isBackoffice) {
        return <OfficeDashboard stats={rawCoachStats} navigate={navigate} />;
    }

    if (isPlayer) {
        return <AthleteDashboard player={currentPlayer} nextGame={rawCoachStats?.nextGame} nextPractice={nextPractice} navigate={navigate} />;
    }

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-white">Central de Comando</h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-secondary rounded-full text-xs font-bold text-text-secondary border border-white/10">
                        {rawCoachStats?.activePlayers || 0} Atletas Prontos
                    </span>
                </div>
            </div>
            <CoachDashboard setActiveHub={setActiveHub} setActiveModule={setActiveModule} nextGame={rawCoachStats?.nextGame} stats={rawCoachStats} />
        </div>
    );
};

export default Dashboard;