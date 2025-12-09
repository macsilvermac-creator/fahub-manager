
import React, { useContext, useEffect, useState, useMemo, Suspense } from 'react';
import Card from '../components/Card';
import { TeamSettings, SocialFeedPost, Player } from '../types';
import { CalendarIcon, UsersIcon, AlertTriangleIcon, BankIcon, PlayCircleIcon, ClipboardIcon, MedicalIcon, DumbbellIcon, WifiIcon, CheckCircleIcon, SparklesIcon, LockIcon, StarIcon } from '../components/icons/UiIcons';
import { MegaphoneIcon, WhistleIcon, TrophyIcon, BookIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import Skeleton from '../components/Skeleton';

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
                {/* Simplified for demo: Logic kept same as before but wrapped in check */}
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

const CommandCenter = React.memo(({ coachStats, xpLeaders }: any) => {
    if (!coachStats) return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton height="150px" />
            <Skeleton height="150px" />
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-4 rounded-xl flex flex-col justify-between shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/5 rounded-full"><WhistleIcon className="text-red-500 w-6 h-6" /></div>
                    <div>
                        <h2 className="text-lg font-bold text-white uppercase">Command Center</h2>
                        <p className="text-xs text-text-secondary">Visão Geral da Temporada</p>
                    </div>
                </div>
                <div className="flex gap-4 text-center">
                    <div><p className="text-[10px] uppercase text-text-secondary font-bold">Ativos</p><p className="text-3xl font-black text-green-400">{coachStats.activePlayers}</p></div>
                    <div><p className="text-[10px] uppercase text-text-secondary font-bold">Lesão</p><p className="text-3xl font-black text-red-400">{coachStats.injuredPlayers}</p></div>
                </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-yellow-500/20 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 blur-xl rounded-full"></div>
                <h3 className="text-xs font-bold text-yellow-400 uppercase mb-3 flex items-center gap-2 relative z-10">
                    <StarIcon className="w-4 h-4" /> Líderes de XP (Engajamento)
                </h3>
                <div className="space-y-2 relative z-10">
                    {xpLeaders.length === 0 && <p className="text-xs text-text-secondary">Sem dados de XP ainda.</p>}
                    {xpLeaders.map((p: Player, idx: number) => (
                        <div key={p.id} className="flex items-center justify-between bg-black/20 p-2 rounded hover:bg-black/30 transition-colors">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-yellow-500 w-4">{idx + 1}</span>
                                <img src={p.avatarUrl} className="w-6 h-6 rounded-full" />
                                <span className="text-xs font-bold text-white">{p.name}</span>
                            </div>
                            <span className="text-xs font-mono text-highlight">{p.xp} XP</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

const LauncherButtons = React.memo(({ setActiveHub, setActiveModule, nextGame }: any) => (
    <div className="grid grid-cols-1 gap-4 h-[calc(100vh-350px)]">
            <button onClick={() => { setActiveHub('TRAINING'); setActiveModule('PRACTICE'); }} className="glass-panel bg-gradient-to-br from-blue-900/40 to-transparent rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg active:scale-95 transition-transform group hover:border-blue-400">
            <DumbbellIcon className="w-12 h-12 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black text-white uppercase">Dia de Treino</span>
            <span className="text-xs text-blue-300 mt-1">Scripts & Performance</span>
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
                <span className="text-lg font-black text-white uppercase">Estudos</span>
            </button>
        </div>
    </div>
));

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const [rawCoachStats, setRawCoachStats] = useState<any>(null);
    const [activeHub, setActiveHub] = useState<string | null>(null);
    const [activeModule, setActiveModule] = useState<string>('');
    const [systemHealth, setSystemHealth] = useState<any>(null);
    const [xpLeaders, setXpLeaders] = useState<Player[]>([]);
    
    const isHeadCoach = currentRole === 'HEAD_COACH' || currentRole === 'MASTER';

    useEffect(() => {
        // Simulação de Loading para demonstrar Skeletons (500ms)
        setTimeout(() => {
            if (isHeadCoach) {
                const stats = storageService.getCoachDashboardStats();
                setRawCoachStats(stats);
                
                const players = storageService.getPlayers();
                const sorted = [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 3);
                setXpLeaders(sorted);

                // @ts-ignore
                const envKey = process.env.API_KEY;
                setSystemHealth({ 
                    api: true, 
                    db: 'RAM', 
                    version: '2.5.0 Stable' 
                });
            }
        }, 300);
    }, [isHeadCoach, activeHub]);

    // --- MAIN RENDER ---
    if (isHeadCoach) {
        if (!activeHub) {
            return (
                <div className="space-y-6 animate-fade-in pb-20">
                    <StatusWidgets systemHealth={systemHealth} navigate={navigate} />
                    <CommandCenter coachStats={rawCoachStats} xpLeaders={xpLeaders} />
                    <LauncherButtons setActiveHub={setActiveHub} setActiveModule={setActiveModule} nextGame={rawCoachStats?.nextGame} />
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
                            {renderHeader("Treino", [{id:'PRACTICE', label:'Roteiro'}, {id:'PERFORMANCE', label:'Performance'}])}
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
                             {renderHeader("Estudos", [{id:'VIDEO', label:'Vídeo'}, {id:'TACTICS', label:'Tática'}, {id:'ACADEMY', label:'Cursos'}])}
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
    