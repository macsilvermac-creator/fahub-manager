
import React, { useContext, useMemo, Suspense, useState, useEffect } from 'react';
import { ProgramType, Game } from '../types';
import { ShieldCheckIcon } from '../components/icons/UiIcons';
import { FlagIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import { useToast } from '../contexts/ToastContext';
import { useAppStore } from '@/utils/storeHooks';

// --- LAZY COMPONENTS (Code Splitting) ---
const StatusWidgets = React.lazy(() => import('../features/dashboard/StatusWidgets'));
const ExecutiveDashboard = React.lazy(() => import('../features/dashboard/ExecutiveDashboard'));
const CoachHubButtons = React.lazy(() => import('../features/dashboard/CoachHubButtons'));
const PlayerCareerMode = React.lazy(() => import('../features/dashboard/PlayerCareerMode'));

// Lazy Modules
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
const StatusWidgetsMemo = React.memo(StatusWidgets);
const ExecutiveDashboardMemo = React.memo(ExecutiveDashboard);
const CoachHubButtonsMemo = React.memo(CoachHubButtons);

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const toast = useToast();
    const [activeHub, setActiveHub] = useState<string | null>(null);
    const [activeModule, setActiveModule] = useState<string>('');
    const [userProgram, setUserProgram] = useState<ProgramType>('BOTH'); 
    
    // --- REATIVIDADE MÁXIMA ---
    // Substituímos storageService.getPlayers() direto por este hook.
    // Agora, se você mudar um dado em outra aba, o Dashboard atualiza sozinho.
    const players = useAppStore('players', storageService.getPlayers);
    const games = useAppStore('games', storageService.getGames);
    // @ts-ignore
    const activeProgram = useAppStore('activeProgram', storageService.getActiveProgram);

    // --- PERFORMANCE OPTIMIZATION ---
    // Cálculos pesados isolados. Só rodam se players ou games mudarem.
    const { xpLeaders, nextGame, systemHealth } = useMemo(() => {
        const now = new Date();
        const next = games
            .filter((g: Game) => new Date(g.date) >= now && g.status === 'SCHEDULED')
            .sort((a: Game, b: Game) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
            
        const sortedPlayers = [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);
        
        return {
            xpLeaders: sortedPlayers,
            nextGame: next,
            systemHealth: { api: true, db: 'RAM Optimized', version: '3.6 Turbo' }
        };
    }, [players, games]);

    // Check role views
    const searchParams = new URLSearchParams(window.location.search);
    const roleOverride = searchParams.get('role');
    const isMasterView = currentRole === 'MASTER' && roleOverride !== 'COACH';
    const isHeadCoach = currentRole === 'HEAD_COACH' || roleOverride === 'COACH';
    const isPlayerView = currentRole === 'PLAYER';

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUserProgram(user.program || 'BOTH');
            // Se o usuário tem programa fixo (ex: FLAG), força o contexto
            if (user.program === 'FLAG' || user.program === 'TACKLE') {
                if (activeProgram !== user.program) {
                     storageService.setActiveProgram(user.program);
                }
            }
        }
    }, [activeProgram]);

    const handleProgramSwitch = (program: 'TACKLE' | 'FLAG') => {
        storageService.setActiveProgram(program);
        toast.info(`Modo Treinador: ${program}`);
    };

    const handleCopyInvite = () => {
        const teamName = storageService.getTeamSettings().teamName;
        const url = window.location.origin + '/#/register';
        const msg = `🏈 *CONVOCAÇÃO OFICIAL: ${teamName.toUpperCase()}*\n\n🔗 *Link de Acesso:* ${url}`;
        navigator.clipboard.writeText(msg);
        toast.success("Convite copiado!");
    };

    // --- RENDER ---
    return (
        <Suspense fallback={<div className="p-8 space-y-4"><Skeleton height="100px" /><Skeleton height="300px" /></div>}>
            
            {/* MASTER VIEW */}
            {isMasterView && (
                <div className="space-y-6 animate-fade-in pb-20">
                    <StatusWidgetsMemo systemHealth={systemHealth} />
                    <ExecutiveDashboardMemo handleCopyInvite={handleCopyInvite} />
                </div>
            )}

            {/* PLAYER VIEW */}
            {isPlayerView && (
                <PlayerCareerMode 
                    player={players.find(p => p.name === authService.getCurrentUser()?.name) || players[0]} 
                    nextGame={nextGame} 
                    xpLeaders={xpLeaders} 
                />
            )}

            {/* COACH VIEW */}
            {isHeadCoach && (
                <>
                    {!activeHub ? (
                        <div className="space-y-6 animate-fade-in pb-20">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Central do Treinador</h2>
                                    <p className="text-text-secondary text-sm">
                                        Programa Ativo: <strong className="text-highlight">{activeProgram}</strong>
                                    </p>
                                </div>
                                
                                {userProgram === 'BOTH' && (
                                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                        <button onClick={() => handleProgramSwitch('TACKLE')} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeProgram === 'TACKLE' ? 'bg-blue-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}>
                                            <ShieldCheckIcon className="w-4 h-4" /> Full Pads
                                        </button>
                                        <button onClick={() => handleProgramSwitch('FLAG')} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeProgram === 'FLAG' ? 'bg-yellow-500 text-black shadow-lg' : 'text-text-secondary hover:text-white'}`}>
                                            <FlagIcon className="w-4 h-4" /> Flag 5x5
                                        </button>
                                    </div>
                                )}

                                {currentRole === 'MASTER' && (
                                    <button onClick={() => navigate('/dashboard')} className="text-xs text-text-secondary border border-white/10 px-3 py-1 rounded hover:text-white">
                                        Voltar para Master
                                    </button>
                                )}
                            </div>
                            
                            <CoachHubButtonsMemo setActiveHub={setActiveHub} setActiveModule={setActiveModule} nextGame={nextGame} program={activeProgram} />
                        </div>
                    ) : (
                        <div className="pb-20 min-h-screen">
                            <div className="bg-primary pt-2 pb-4 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                     <button onClick={() => setActiveHub(null)} className="text-white flex items-center gap-2 font-bold text-sm bg-secondary px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                                        ← Voltar
                                    </button>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest block">{activeHub} Hub</span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeProgram === 'TACKLE' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'}`}>{activeProgram}</span>
                                    </div>
                                </div>
                            </div>

                            <Suspense fallback={<div className="p-4 space-y-4"><Skeleton height="50px" /><Skeleton height="400px" /></div>}>
                                {activeHub === 'TRAINING' && (
                                    <>
                                        {activeModule === 'PRACTICE' && <PracticePlan />}
                                    </>
                                )}
                                {activeHub === 'GAME' && (
                                    <>
                                         {activeModule === 'MISSION_CONTROL' && <CoachGameDay />}
                                    </>
                                )}
                                {activeHub === 'PLANNING' && (
                                     <>
                                         {activeModule === 'ROSTER' && <Roster />}
                                     </>
                                )}
                                {activeHub === 'STUDY' && (
                                     <>
                                         {activeModule === 'VIDEO' && <VideoAnalysis />}
                                     </>
                                )}
                             </Suspense>
                        </div>
                    )}
                </>
            )}
        </Suspense>
    );
};

export default Dashboard;