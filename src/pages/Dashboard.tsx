
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { generatePlayerAnalysis } from '../services/geminiService';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';
import { 
    AlertTriangleIcon, CheckCircleIcon, DumbbellIcon, UsersIcon, SparklesIcon, 
    ActivityIcon, ShieldCheckIcon, TrendingUpIcon, LockIcon 
} from '../components/icons/UiIcons';
import { TrophyIcon, BookIcon } from '../components/icons/NavIcons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const toast = useToast();
    const [players, setPlayers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [me, setMe] = useState<any>(null);
    const [aiInsight, setAiInsight] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);

    useEffect(() => {
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);
        setStats(storageService.getCoachDashboardStats());
        
        const user = authService.getCurrentUser();
        const myData = allPlayers.find(p => p.name === user?.name);
        const activeMe = myData || allPlayers[0];
        setMe(activeMe);

        if (currentRole === 'PLAYER' && activeMe) {
            fetchAiInsight(activeMe);
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

    const radarData = useMemo(() => {
        if (!me) return [];
        return [
            { subject: 'Velocidade', A: me.rating - 5, fullMark: 100 },
            { subject: 'Força', A: me.rating + 2, fullMark: 100 },
            { subject: 'Agilidade', A: me.rating - 10, fullMark: 100 },
            { subject: 'Football IQ', A: me.rating + 5, fullMark: 100 },
            { subject: 'Técnica', A: me.rating, fullMark: 100 },
        ];
    }, [me]);

    const criticalAlerts = useMemo(() => {
        return players.filter(p => ['INJURED', 'IR', 'QUESTIONABLE', 'DOUBTFUL'].includes(p.status));
    }, [players]);

    // VIEW: ATLETA (Refinada v4.5)
    if (currentRole === 'PLAYER' && me) {
        return (
            <div className="space-y-6 animate-fade-in pb-20">
                {/* Hero Profile Premium */}
                <div className="relative bg-gradient-to-br from-[#0F172A] to-black rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                            <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-highlight to-cyan-400">
                                <LazyImage src={me.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-black" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-black text-white font-black text-xl w-10 h-10 flex items-center justify-center rounded-lg border-2 border-highlight shadow-lg">
                                {me.level}
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{me.name}</h1>
                            <p className="text-highlight font-bold text-sm mb-4">#{me.jerseyNumber} • {me.position} • {me.class}</p>
                            
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-3 max-w-md">
                                <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase mb-1">
                                    <span>Comprometimento Temporada</span>
                                    <span className="text-highlight">95%</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-highlight shadow-glow" style={{ width: `95%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-xl border border-white/10 min-w-[100px] shadow-inner">
                            <span className="text-[10px] text-text-secondary font-bold uppercase">Overall</span>
                            <span className="text-5xl font-black text-white tracking-tighter">{me.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Governança e Inventário (Faltava este controle para o atleta) */}
                    <Card title="Patrimônio & Compliance" className="lg:col-span-1">
                        <div className="space-y-4">
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShieldCheckIcon className="w-5 h-5 text-highlight" />
                                    <div>
                                        <p className="text-white text-xs font-bold">Capacete Riddell</p>
                                        <p className="text-[10px] text-text-secondary">ID: RID-2025-442</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black bg-highlight text-white px-2 py-0.5 rounded">ACEITO</span>
                            </div>
                            <div className="bg-red-900/10 p-3 rounded-xl border border-red-500/20 flex items-center justify-between group cursor-pointer hover:bg-red-900/20 transition-all">
                                <div className="flex items-center gap-3">
                                    <AlertTriangleIcon className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-white text-xs font-bold">Shoulder Pad Schutt</p>
                                        <p className="text-[10px] text-red-300">Aguardando Aceite Digital</p>
                                    </div>
                                </div>
                                <button onClick={() => toast.success("Termo de Responsabilidade assinado!")} className="text-[8px] font-black bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500">ASSINAR</button>
                            </div>
                            <div className="bg-blue-900/10 p-3 rounded-xl border border-blue-500/20 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <LockIcon className="w-5 h-5 text-blue-400" />
                                    <div>
                                        <p className="text-white text-xs font-bold">Seguro Atleta 2025</p>
                                        <p className="text-[10px] text-blue-300">Status: Regular</p>
                                    </div>
                                </div>
                                <CheckCircleIcon className="w-4 h-4 text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    {/* Skill Radar Chart */}
                    <Card title="Radar de Performance" className="lg:col-span-1">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Atleta"
                                        dataKey="A"
                                        stroke="#059669"
                                        fill="#059669"
                                        fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* AI Coach Insights */}
                    <Card title="Coach AI: PDI" className="lg:col-span-1 border-l-4 border-l-purple-500">
                        <div className="space-y-4">
                            {loadingAi ? (
                                <div className="flex flex-col items-center justify-center py-10 animate-pulse">
                                    <SparklesIcon className="w-8 h-8 text-purple-400 mb-2" />
                                    <p className="text-xs text-text-secondary">Consultando Coach Virtual...</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in h-full flex flex-col">
                                    <div className="bg-purple-900/10 p-4 rounded-2xl border border-purple-500/20 mb-4">
                                        <p className="text-white text-xs leading-relaxed italic">
                                            "{aiInsight}"
                                        </p>
                                    </div>
                                    <div className="mt-auto space-y-2">
                                        <button onClick={() => navigate('/academy')} className="w-full bg-secondary p-2 rounded-lg border border-white/5 flex items-center justify-between group hover:border-highlight transition-all">
                                            <span className="text-[10px] font-bold text-white uppercase">Ver Próximos Drills</span>
                                            <TrendingUpIcon className="w-4 h-4 text-highlight group-hover:translate-x-1 transition-transform" />
                                        </button>
                                        <button onClick={() => navigate('/gemini-playbook')} className="w-full bg-secondary p-2 rounded-lg border border-white/5 flex items-center justify-between group hover:border-purple-400 transition-all">
                                            <span className="text-[10px] font-bold text-white uppercase">Estudar Playbook</span>
                                            <BookIcon className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Health Passport & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-green-900/10 border-green-500/20">
                        <p className="text-[10px] text-green-400 font-bold uppercase mb-1">Atestado Médico</p>
                        <div className="flex items-center justify-between">
                            <p className="text-xl font-black text-white">VÁLIDO</p>
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        </div>
                    </Card>
                    <Card className="bg-blue-900/10 border-blue-500/20">
                        <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">XP Acumulado</p>
                        <p className="text-xl font-black text-white">{me.xp} <span className="text-xs font-normal text-text-secondary">/ 5000</span></p>
                    </Card>
                    <Card className="bg-red-900/10 border-red-500/20">
                        <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Dívidas Loja/Mensalidade</p>
                        <p className="text-xl font-black text-white">R$ 0,00</p>
                    </Card>
                    <Card className="bg-yellow-900/10 border-yellow-500/20">
                        <p className="text-[10px] text-yellow-400 font-bold uppercase mb-1">Próximo Compromisso</p>
                        <p className="text-sm font-black text-white uppercase truncate">vs Guardians • Sab 14h</p>
                    </Card>
                </div>
            </div>
        );
    }

    // VIEW: MASTER/COACH (Resumo Geral)
    return (
        <div className="space-y-6 animate-fade-in pb-20">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-secondary/80">
                    <p className="text-xs text-text-secondary uppercase font-bold">Atletas Ativos</p>
                    <p className="text-3xl font-black text-white">{stats?.activePlayers || 0}</p>
                </Card>
                <Card className="bg-secondary/80">
                    <p className="text-xs text-text-secondary uppercase font-bold">Assiduidade Geral</p>
                    <p className="text-3xl font-black text-green-400">88%</p>
                </Card>
                <Card className="bg-secondary/80 border-red-500/30">
                    <p className="text-xs text-red-400 uppercase font-bold">Alertas Médicos</p>
                    <p className="text-3xl font-black text-red-500">{criticalAlerts.length}</p>
                </Card>
                <Card className="bg-secondary/80">
                    <p className="text-xs text-text-secondary uppercase font-bold">Próximo Jogo</p>
                    <p className="text-xl font-bold text-white uppercase truncate">vs {stats?.nextGame?.opponent || 'N/A'}</p>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Risco de Lesão (Alta Carga)">
                    <div className="space-y-4">
                        {criticalAlerts.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-red-900/10 rounded-xl border border-red-500/20">
                                <div className="flex items-center gap-3">
                                    <LazyImage src={p.avatarUrl} className="w-10 h-10 rounded-full" />
                                    <span className="text-white font-bold">{p.name}</span>
                                </div>
                                <span className="text-[10px] font-black text-red-400 uppercase">Atenção Médica</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;