
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { generatePlayerAnalysis } from '../services/geminiService';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';
import { 
    AlertTriangleIcon, CheckCircleIcon, DumbbellIcon, UsersIcon, SparklesIcon, 
    ActivityIcon, ShieldCheckIcon, TrendingUpIcon, LockIcon, WalletIcon, TargetIcon
} from '../components/icons/UiIcons';
// Added FlagIcon to the imports from NavIcons to fix 'Cannot find name FlagIcon'
import { TrophyIcon, BookIcon, FinanceIcon, FlagIcon } from '../components/icons/NavIcons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';

// Importação das Visões Segmentadas do Dashboard
import StatusWidgets from '../features/dashboard/StatusWidgets';
import ExecutiveDashboard from '../features/dashboard/ExecutiveDashboard';
import CoachHubButtons from '../features/dashboard/CoachHubButtons';
import PlayerCareerMode from '../features/dashboard/PlayerCareerMode';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const toast = useToast();
    
    // States Centralizados
    const [players, setPlayers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [objectives, setObjectives] = useState<any[]>([]);
    const [me, setMe] = useState<any>(null);
    const [aiInsight, setAiInsight] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [systemHealth, setSystemHealth] = useState<any>(null);

    // States de Navegação Interna (Modo Coach)
    const [activeHub, setActiveHub] = useState<string | null>(null);
    const [activeModule, setActiveModule] = useState<string>('');

    useEffect(() => {
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);
        setStats(storageService.getCoachDashboardStats());
        setObjectives(storageService.getObjectives());
        
        const user = authService.getCurrentUser();
        const myData = allPlayers.find(p => p.name === user?.name);
        setMe(myData || allPlayers[0]);

        setSystemHealth({ 
            api: true, 
            db: 'IndexedDB', 
            version: '6.5 PRO' 
        });

        if (currentRole === 'PLAYER' && (myData || allPlayers[0])) {
            fetchAiInsight(myData || allPlayers[0]);
        }
    }, [currentRole]);

    const fetchAiInsight = async (player: any) => {
        setLoadingAi(true);
        try {
            const context = `Atleta ${player.position}, rating ${player.rating}. Foco em evolução técnica.`;
            const insight = await generatePlayerAnalysis(player, context);
            setAiInsight(insight);
        } catch (e) {
            setAiInsight("Analise seus últimos drills no Iron Lab para novos insights de performance.");
        } finally {
            setLoadingAi(false);
        }
    };

    const xpLeaders = useMemo(() => {
        return [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);
    }, [players]);

    const handleCopyInvite = () => {
        const url = `${window.location.origin}/#/register`;
        navigator.clipboard.writeText(url);
        toast.success("Link de convite para atletas copiado!");
    };

    // --- RENDERIZAÇÃO POR ENTIDADE ---

    // 1. VISÃO ATLETA
    if (currentRole === 'PLAYER' && me) {
        return <PlayerCareerMode player={me} nextGame={stats?.nextGame} xpLeaders={xpLeaders} />;
    }

    // 2. VISÃO COACH
    if (currentRole === 'HEAD_COACH') {
        return (
            <div className="space-y-6 animate-fade-in pb-20">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Central do Treinador</h2>
                </div>
                <CoachHubButtons 
                    setActiveHub={setActiveHub} 
                    setActiveModule={setActiveModule} 
                    nextGame={stats?.nextGame} 
                    program={storageService.getActiveProgram()} 
                />
            </div>
        );
    }

    // 3. VISÃO ÁRBITRO (Pode ir direto para a página de Oficiais se preferir)
    if (currentRole === 'REFEREE') {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <FlagIcon className="w-16 h-16 text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-white">Modo Oficial Ativado</h2>
                <p className="text-text-secondary mb-6">Acesse a Súmula Digital no menu lateral para iniciar o jogo.</p>
                <button onClick={() => navigate('/officiating')} className="bg-yellow-500 text-black font-black px-8 py-3 rounded-xl uppercase shadow-lg">Ir para o Campo</button>
            </div>
        );
    }

    // 4. VISÃO MASTER (PADRÃO)
    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <StatusWidgets systemHealth={systemHealth} />
            <ExecutiveDashboard handleCopyInvite={handleCopyInvite} />
        </div>
    );
};

export default Dashboard;