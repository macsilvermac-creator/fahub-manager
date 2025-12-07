
import React, { useContext, useEffect, useState, useMemo, Suspense } from 'react';
import Card from '../components/Card';
import { TeamSettings, SocialFeedPost, Player } from '../types';
import { CalendarIcon, UsersIcon, AlertTriangleIcon, BankIcon, PlayCircleIcon, ClipboardIcon, MedicalIcon, DumbbellIcon } from '../components/icons/UiIcons';
import { MegaphoneIcon, WhistleIcon, TrophyIcon, BookIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

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

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const [rawCoachStats, setRawCoachStats] = useState<any>({ activePlayers: 0, injuredPlayers: 0, nextGame: null });
    const [activeHub, setActiveHub] = useState<string | null>(null);
    const [activeModule, setActiveModule] = useState<string>('');
    
    // State for other roles
    const [recentNews, setRecentNews] = useState<SocialFeedPost[]>([]);
    const [myPlayer, setMyPlayer] = useState<Player | null>(null);

    const isHeadCoach = currentRole === 'HEAD_COACH';
    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        if (isHeadCoach) {
            setRawCoachStats(storageService.getCoachDashboardStats());
        } else if (isPlayer) {
            const user = authService.getCurrentUser();
            const allPlayers = storageService.getPlayers();
            setMyPlayer(allPlayers.find(p => p.name === user?.name) || null);
            setRecentNews(storageService.getSocialFeed().slice(0,3));
        }
    }, [isHeadCoach, isPlayer, activeHub]);

    // PERFORMANCE: Memoize stats to prevent re-calc on every render
    const coachStats = useMemo(() => rawCoachStats, [rawCoachStats]);

    // --- HEAD COACH SUPER APP ---
    if (isHeadCoach) {
        if (!activeHub) {
            return (
                <div className="space-y-4 animate-fade-in pb-20">
                    {/* Header Status */}
                    <div className="bg-secondary p-4 rounded-xl border border-white/5 flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-full"><WhistleIcon className="text-red-500 w-6 h-6" /></div>
                            <div>
                                <h2 className="text-lg font-bold text-white uppercase">Command Center</h2>
                                <p className="text-xs text-text-secondary">Visão Geral</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-center">
                            <div><p className="text-[10px] uppercase text-text-secondary font-bold">Ativos</p><p className="text-lg font-black text-green-400">{coachStats.activePlayers}</p></div>
                            <div><p className="text-[10px] uppercase text-text-secondary font-bold">Lesão</p><p className="text-lg font-black text-red-400">{coachStats.injuredPlayers}</p></div>
                        </div>
                    </div>

                    {/* 4 BIG BUTTONS (Launcher) */}
                    <div className="grid grid-cols-1 gap-4 h-[calc(100vh-220px)]">
                         <button onClick={() => { setActiveHub('TRAINING'); setActiveModule('PRACTICE'); }} className="bg-gradient-to-br from-blue-900/40 to-secondary border border-blue-500/30 rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg active:scale-95 transition-transform">
                            <DumbbellIcon className="w-12 h-12 text-blue-400 mb-2" />
                            <span className="text-2xl font-black text-white uppercase">Dia de Treino</span>
                        </button>
                        <button onClick={() => { setActiveHub('GAME'); setActiveModule('MISSION_CONTROL'); }} className="bg-gradient-to-br from-red-900/40 to-secondary border border-red-500/30 rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg active:scale-95 transition-transform">
                            <TrophyIcon className="w-12 h-12 text-red-400 mb-2" />
                            <span className="text-2xl font-black text-white uppercase">Dia de Jogo</span>
                             {coachStats.nextGame && <span className="text-xs text-red-200 bg-red-900/50 px-2 py-1 rounded mt-2">vs {coachStats.nextGame.opponent}</span>}
                        </button>
                        <div className="grid grid-cols-2 gap-4 h-full">
                             <button onClick={() => { setActiveHub('PLANNING'); setActiveModule('ROSTER'); }} className="bg-gradient-to-br from-green-900/40 to-secondary border border-green-500/30 rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg active:scale-95 transition-transform">
                                <ClipboardIcon className="w-8 h-8 text-green-400 mb-2" />
                                <span className="text-lg font-black text-white uppercase">Gestão</span>
                            </button>
                            <button onClick={() => { setActiveHub('STUDY'); setActiveModule('VIDEO'); }} className="bg-gradient-to-br from-yellow-900/40 to-secondary border border-yellow-500/30 rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg active:scale-95 transition-transform">
                                <BookIcon className="w-8 h-8 text-yellow-400 mb-2" />
                                <span className="text-lg font-black text-white uppercase">Estudos</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // --- HUB NAVIGATION ---
        const renderHeader = (title: string, modules: any[]) => (
            <div className="sticky top-0 z-30 bg-primary pt-2 pb-4">
                <div className="flex items-center justify-between mb-3">
                     <button onClick={() => setActiveHub(null)} className="text-white flex items-center gap-2 font-bold text-sm bg-secondary px-3 py-1.5 rounded-lg border border-white/10">
                        ← Voltar
                    </button>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{title}</span>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {modules.map(m => (
                        <button key={m.id} onClick={() => setActiveModule(m.id)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeModule === m.id ? 'bg-white text-black' : 'bg-secondary text-text-secondary border border-white/10'}`}>
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>
        );

        return (
            <div className="pb-20 min-h-screen">
                 <Suspense fallback={<LoadingScreen />}>
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

    // Fallback for other roles (Player/Admin - Keep simple)
    return (
        <div className="text-center py-20">
            <h2 className="text-2xl text-white">Bem-vindo</h2>
            <p className="text-text-secondary">Selecione uma opção no menu.</p>
        </div>
    );
};

export default Dashboard;
