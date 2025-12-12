
import React, { useContext, useEffect, useState, useMemo, Suspense } from 'react';
import Card from '../components/Card';
import { TeamSettings, SocialFeedPost, Player } from '../types';
import { CalendarIcon, UsersIcon, AlertTriangleIcon, BankIcon, PlayCircleIcon, ClipboardIcon, MedicalIcon, DumbbellIcon, WifiIcon, CheckCircleIcon, SparklesIcon, LockIcon, StarIcon, ActivityIcon, FireIcon, GamepadIcon, ShareIcon } from '../components/icons/UiIcons';
import { MegaphoneIcon, WhistleIcon, TrophyIcon, BookIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import Skeleton from '../components/Skeleton';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';

// Lazy Load Modules
const PracticePlan = React.lazy(() => import('./PracticePlan'));
const CoachGameDay = React.lazy(() => import('./CoachGameDay'));
const Roster = React.lazy(() => import('./Roster'));
const Schedule = React.lazy(() => import('./Schedule'));
const Staff = React.lazy(() => import('./Staff'));
const PerformanceLab = React.lazy(() => import('./PerformanceLab'));
const VideoAnalysis = React.lazy(() => import('./VideoAnalysis'));
const TacticalLab = React.lazy(() => import('./TacticalLab'));
const Academy = React.lazy(() => import('./Academy'));

// --- MEMOIZED WIDGETS ---

const StatusWidgets = React.memo(({ systemHealth, navigate }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
            !systemHealth ? <Skeleton key={i} height="80px" /> : 
            <div key={i} className="glass-panel p-4 rounded-xl shadow-lg flex items-center justify-between">
                {i === 1 && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-full"><AlertTriangleIcon className="text-blue-400 w-5 h-5" /></div>
                        <div>
                            <h3 className="text-xs font-bold text-text-secondary uppercase">Versão</h3>
                            <p className="text-white font-mono font-bold">{systemHealth.version}</p>
                        </div>
                    </div>
                )}
                {i === 2 && (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${systemHealth.api ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                            <SparklesIcon className={`w-5 h-5 ${systemHealth.api ? 'text-green-400' : 'text-red-400'}`} />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-text-secondary uppercase">IA Gemini</h3>
                            <p className={`font-bold ${systemHealth.api ? 'text-green-400' : 'text-red-400'}`}>
                                {systemHealth.api ? 'IA Ativa (GPU)' : 'Sem Chave'}
                            </p>
                        </div>
                    </div>
                )}
                {i === 3 && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-full"><CheckCircleIcon className="text-green-400 w-5 h-5" /></div>
                        <div>
                            <h3 className="text-xs font-bold text-text-secondary uppercase">RAM DB</h3>
                            <p className="text-green-400 font-bold text-sm">Otimizado</p>
                        </div>
                    </div>
                )}
                {i === 4 && (
                    <div className="flex items-center gap-3 w-full cursor-pointer hover:bg-white/5 transition-colors" onClick={() => navigate('/admin')}>
                        <div className="p-2 bg-white/5 rounded-full"><ClipboardIcon className="text-white w-5 h-5" /></div>
                        <div>
                            <h3 className="text-xs font-bold text-text-secondary uppercase">Admin</h3>
                            <p className="text-white font-bold text-sm underline">Configurações →</p>
                        </div>
                    </div>
                )}
            </div>
        ))}
    </div>
));

const ExecutiveDashboard = React.memo(({ stats, navigate, handleCopyInvite }: any) => (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Visão Executiva (Master)</h2>
                <p className="text-text-secondary text-sm">Controle total da organização.</p>
            </div>
            
            {/* WIDGET DE CONVITE RÁPIDO */}
            <button 
                onClick={handleCopyInvite}
                className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform animate-pulse"
            >
                <ShareIcon className="w-5 h-5" />
                Copiar Convite WhatsApp
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-highlight/50 transition-all cursor-pointer" onClick={() => navigate('/finance')}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Saúde Financeira</h3>
                    <BankIcon className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">R$ 125.000</div>
                <p className="text-xs text-text-secondary">Fluxo de Caixa Projetado</p>
            </div>
            <div className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-highlight/50 transition-all cursor-pointer" onClick={() => navigate('/staff')}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Recursos Humanos</h3>
                    <UsersIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">24 Staff</div>
                <p className="text-xs text-text-secondary">4 Contratos Pendentes</p>
            </div>
            <div className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-highlight/50 transition-all cursor-pointer" onClick={() => navigate('/league')}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">Federação</h3>
                    <TrophyIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">Regular</div>
                <p className="text-xs text-text-secondary">Status de Filiação</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Acesso aos Departamentos Operacionais">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/dashboard?role=COACH')} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:bg-highlight/20 hover:border-highlight transition-all text-left">
                        <WhistleIcon className="w-8 h-8 text-highlight mb-2" />
                        <h4 className="font-bold text-white">Modo Treinador</h4>
                        <p className="text-xs text-text-secondary">Acesso a treinos, scout e playbook.</p>
                    </button>
                    <button onClick={() => navigate('/officiating')} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:bg-red-500/20 hover:border-red-500 transition-all text-left">
                        <AlertTriangleIcon className="w-8 h-8 text-red-500 mb-2" />
                        <h4 className="font-bold text-white">Modo Arbitragem</h4>
                        <p className="text-xs text-text-secondary">Súmulas e relatórios de jogo.</p>
                    </button>
                </div>
            </Card>
        </div>
    </div>
));

const CoachHubButtons = React.memo(({ setActiveHub, setActiveModule, nextGame }: any) => (
    <div className="grid grid-cols-1 gap-4 h-[calc(100vh-250px)]">
        <button onClick={() => { setActiveHub('TRAINING'); setActiveModule('PRACTICE'); }} className="glass-panel bg-gradient-to-br from-blue-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg active:scale-95 transition-transform group hover:border-blue-400">
            <DumbbellIcon className="w-12 h-12 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black text-white uppercase">Dia de Treino</span>
            <span className="text-xs text-blue-300 mt-1">Scripts, IA & Performance</span>
        </button>
        <button onClick={() => { setActiveHub('GAME'); setActiveModule('MISSION_CONTROL'); }} className="glass-panel bg-gradient-to-br from-red-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg active:scale-95 transition-transform group hover:border-red-400">
            <TrophyIcon className="w-12 h-12 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black text-white uppercase">Dia de Jogo</span>
                {nextGame ? 
                <span className="text-xs text-red-200 bg-red-900/50 px-2 py-1 rounded mt-2">Próximo: vs {nextGame.opponent}</span> :
                <span className="text-xs text-red-200 mt-1">Nenhum jogo agendado</span>
                }
        </button>
        <div className="grid grid-cols-2 gap-4 h-full">
            <button onClick={() => { setActiveHub('PLANNING'); setActiveModule('ROSTER'); }} className="glass-panel bg-gradient-to-br from-green-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg active:scale-95 transition-transform group hover:border-green-400">
                <ClipboardIcon className="w-8 h-8 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-black text-white uppercase">Gestão</span>
            </button>
            <button onClick={() => { setActiveHub('STUDY'); setActiveModule('VIDEO'); }} className="glass-panel bg-gradient-to-br from-yellow-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg active:scale-95 transition-transform group hover:border-yellow-400">
                <BookIcon className="w-8 h-8 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-lg font-black text-white uppercase">Estudos (IA)</span>
            </button>
        </div>
    </div>
));

const PlayerCareerMode = React.memo(({ player, navigate, nextGame, xpLeaders }: any) => {
    if (!player) return <div className="text-white">Carregando Carreira...</div>;

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            {/* HERO SECTION: PLAYER CARD */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar with Level Ring */}
                    <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-highlight to-cyan-400">
                            <LazyImage src={player.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-black" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-black text-white font-black text-xl w-10 h-10 flex items-center justify-center rounded-lg border-2 border-highlight shadow-lg">
                            {player.level}
                        </div>
                        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-bold text-white uppercase">Editar Foto</span>
                        </div>
                    </div>

                    {/* Stats & Progress */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{player.name}</h1>
                        <p className="text-highlight font-bold text-sm mb-4">{player.position} • {player.class} • FAHUB Stars</p>
                        
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-3">
                            <div className="flex justify-between text-xs font-bold text-text-secondary uppercase mb-1">
                                <span>XP da Temporada</span>
                                <span>{player.xp} / 5000</span>
                            </div>
                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-highlight to-cyan-400" style={{ width: `${(player.xp % 1000) / 10}%` }}></div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/profile')} 
                            className="text-xs font-bold text-text-secondary hover:text-white flex items-center gap-1 mx-auto md:mx-0 transition-colors"
                        >
                            <ClipboardIcon className="w-3 h-3" /> Atualizar Meus Dados Cadastrais
                        </button>
                    </div>

                    {/* OVR Badge */}
                    <div className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-xl border border-white/10 min-w-[80px]">
                        <span className="text-xs text-text-secondary font-bold uppercase">OVR</span>
                        <span className="text-4xl font-black text-white">{player.rating}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* NEXT MISSION */}
                <div className="lg:col-span-2">
                    <Card title="Próxima Missão" className="border-l-4 border-l-highlight h-full">
                        {nextGame ? (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-highlight/10 rounded-2xl">
                                        <TrophyIcon className="w-8 h-8 text-highlight" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase">Jogo vs {nextGame.opponent}</h3>
                                        <p className="text-sm text-text-secondary">{new Date(nextGame.date).toLocaleDateString()} • {new Date(nextGame.date).toLocaleTimeString()}</p>
                                        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Presença Obrigatória
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full md:w-auto bg-highlight hover:bg-highlight-hover text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider shadow-lg transform active:scale-95 transition-all">
                                    Confirmar Presença
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8 opacity-50">
                                <TrophyIcon className="w-12 h-12 mx-auto mb-2 text-text-secondary" />
                                <p>Nenhum jogo agendado.</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* BODY STATUS (Check-in Rápido) */}
                <div className="lg:col-span-1">
                    <Card title="Status Físico (Hoje)">
                        <div className="grid grid-cols-3 gap-2">
                            <button className="flex flex-col items-center gap-2 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all" onClick={() => alert("Check-in: 100%")}>
                                <span className="text-2xl">⚡</span>
                                <span className="text-[10px] font-bold text-green-400 uppercase">100%</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl transition-all" onClick={() => alert("Check-in: Cansado")}>
                                <span className="text-2xl">🥱</span>
                                <span className="text-[10px] font-bold text-yellow-400 uppercase">Sore</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all" onClick={() => navigate('/performance')}>
                                <span className="text-2xl">🚑</span>
                                <span className="text-[10px] font-bold text-red-400 uppercase">Dor</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* LEADERBOARD & ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Leaderboard do Time (XP)">
                    <div className="space-y-3">
                        {xpLeaders.map((p: any, idx: number) => (
                            <div key={p.id} className="flex items-center justify-between bg-secondary p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className={`font-black w-6 text-center ${idx === 0 ? 'text-yellow-400 text-lg' : 'text-gray-500'}`}>{idx + 1}</span>
                                    <LazyImage src={p.avatarUrl} className="w-8 h-8 rounded-full bg-black" />
                                    <span className={`font-bold text-sm ${p.id === player.id ? 'text-highlight' : 'text-white'}`}>{p.name}</span>
                                </div>
                                <span className="font-mono font-bold text-white text-sm">{p.xp} XP</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/gemini-playbook')} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <BookIcon className="w-8 h-8 text-purple-400" />
                        <span className="font-bold text-white text-sm">Estudar Playbook</span>
                    </button>
                    <button onClick={() => navigate('/locker-room')} className="bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <UsersIcon className="w-8 h-8 text-blue-400" />
                        <span className="font-bold text-white text-sm">Vestiário</span>
                    </button>
                    <button onClick={() => navigate('/marketplace')} className="bg-yellow-900/40 hover:bg-yellow-900/60 border border-yellow-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <TrophyIcon className="w-8 h-8 text-yellow-400" />
                        <span className="font-bold text-white text-sm">Loja & Itens</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="bg-gray-800 hover:bg-gray-700 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <ActivityIcon className="w-8 h-8 text-gray-400" />
                        <span className="font-bold text-white text-sm">Meus Highlights</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const toast = useToast();
    const [rawCoachStats, setRawCoachStats] = useState<any>(null);
    const [activeHub, setActiveHub] = useState<string | null>(null);
    const [activeModule, setActiveModule] = useState<string>('');
    const [systemHealth, setSystemHealth] = useState<any>(null);
    const [xpLeaders, setXpLeaders] = useState<Player[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
    
    const searchParams = new URLSearchParams(window.location.search);
    const roleOverride = searchParams.get('role');
    const isMasterView = currentRole === 'MASTER' && roleOverride !== 'COACH';
    const isHeadCoach = currentRole === 'HEAD_COACH' || roleOverride === 'COACH';
    const isPlayerView = currentRole === 'PLAYER';

    useEffect(() => {
        setTimeout(() => {
            const stats = storageService.getCoachDashboardStats();
            setRawCoachStats(stats);
            
            const players = storageService.getPlayers();
            const sorted = [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);
            setXpLeaders(sorted);

            const user = authService.getCurrentUser();
            if (isPlayerView && user) {
                const me = players.find(p => p.name === user.name);
                setCurrentPlayer(me || players[0]); 
            }

            setSystemHealth({ 
                api: true, 
                db: 'RAM', 
                version: '2.5.0 Stable' 
            });
        }, 300);
    }, [currentRole, activeHub, isPlayerView]);

    const handleCopyInvite = () => {
        const teamName = storageService.getTeamSettings().teamName;
        const url = window.location.origin + '/#/register';
        const msg = `🏈 *CONVOCAÇÃO OFICIAL: ${teamName.toUpperCase()}*\n\nVocê foi selecionado para participar do teste beta fechado do FAHUB Manager.\n\n*Missão:*\n1. Acesse o link abaixo.\n2. Crie sua conta (use seu CPF).\n3. Aguarde a liberação.\n\n🔗 *Link de Acesso:* ${url}\n\n_Acesso restrito. Não compartilhe._`;
        
        navigator.clipboard.writeText(msg);
        toast.success("Convite copiado para a área de transferência! Cole no WhatsApp.");
    };

    // --- MASTER EXECUTIVE DASHBOARD ---
    if (isMasterView) {
        return (
            <div className="space-y-6 animate-fade-in pb-20">
                <StatusWidgets systemHealth={systemHealth} navigate={navigate} />
                <ExecutiveDashboard stats={rawCoachStats} navigate={navigate} handleCopyInvite={handleCopyInvite} />
            </div>
        );
    }

    // --- PLAYER CAREER DASHBOARD ---
    if (isPlayerView) {
        return <PlayerCareerMode player={currentPlayer} navigate={navigate} nextGame={rawCoachStats?.nextGame} xpLeaders={xpLeaders} />;
    }

    // --- COACH OPERATIONAL DASHBOARD ---
    if (isHeadCoach) {
        if (!activeHub) {
            return (
                <div className="space-y-6 animate-fade-in pb-20">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">Central do Treinador</h2>
                        {currentRole === 'MASTER' && (
                            <button onClick={() => navigate('/dashboard')} className="text-xs text-text-secondary border border-white/10 px-3 py-1 rounded hover:text-white">
                                Voltar para Master
                            </button>
                        )}
                    </div>
                    <CoachHubButtons setActiveHub={setActiveHub} setActiveModule={setActiveModule} nextGame={rawCoachStats?.nextGame} />
                </div>
            );
        }

        // --- HUB RENDER ---
        const renderHeader = (title: string, modules: any[]) => (
            <div className="sticky top-0 z-30 bg-primary pt-2 pb-4">
                <div className="flex items-center justify-between mb-3">
                     <button onClick={() => setActiveHub(null)} className="text-white flex items-center gap-2 font-bold text-sm bg-secondary px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        ← Voltar
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
                            {renderHeader("Treino", [{id:'PRACTICE', label:'Roteiro IA'}, {id:'PERFORMANCE', label:'Performance'}])}
                            {activeModule === 'PRACTICE' && <PracticePlan />}
                            {activeModule === 'PERFORMANCE' && <PerformanceLab />}
                        </>
                    )}
                    {activeHub === 'GAME' && (
                        <>
                             {renderHeader("Jogo", [{id:'MISSION_CONTROL', label:'Ao Vivo'}, {id:'CALL_SHEET', label:'Call Sheet'}, {id:'SCOUT', label:'Scout'}])}
                             {activeModule === 'MISSION_CONTROL' && <CoachGameDay />}
                             {activeModule === 'CALL_SHEET' && <TacticalLab />}
                             {activeModule === 'SCOUT' && <VideoAnalysis />}
                        </>
                    )}
                    {activeHub === 'PLANNING' && (
                         <>
                             {renderHeader("Gestão", [{id:'ROSTER', label:'Elenco'}, {id:'SCHEDULE', label:'Agenda'}, {id:'STAFF', label:'Staff'}])}
                             {activeModule === 'ROSTER' && <Roster />}
                             {activeModule === 'SCHEDULE' && <Schedule />}
                             {activeModule === 'STAFF' && <Staff />}
                         </>
                    )}
                    {activeHub === 'STUDY' && (
                         <>
                             {renderHeader("Estudos", [{id:'VIDEO', label:'Video Core'}, {id:'TACTICS', label:'Tática'}, {id:'ACADEMY', label:'Cursos'}])}
                             {activeModule === 'VIDEO' && <VideoAnalysis />}
                             {activeModule === 'TACTICS' && <TacticalLab />}
                             {activeModule === 'ACADEMY' && <Academy />}
                         </>
                    )}
                 </Suspense>
            </div>
        );
    }

    return <div className="text-center py-20 text-white">Carregando Perfil...</div>;
};

export default Dashboard;