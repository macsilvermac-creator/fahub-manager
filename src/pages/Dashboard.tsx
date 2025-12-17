
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';
import { AlertTriangleIcon, CheckCircleIcon, DumbbellIcon, UsersIcon, PlayCircleIcon, ActivityIcon, ShieldCheckIcon } from '../components/icons/UiIcons';
import { TrophyIcon } from '../components/icons/NavIcons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const navigate = useNavigate();
    const [players, setPlayers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [me, setMe] = useState<any>(null);

    useEffect(() => {
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);
        setStats(storageService.getCoachDashboardStats());
        
        const user = authService.getCurrentUser();
        const myData = allPlayers.find(p => p.name === user?.name);
        setMe(myData || allPlayers[0]);
    }, []);

    // Alertas Médicos & Bio-Mecânicos (Cruzamento de Dados)
    const criticalAlerts = useMemo(() => {
        return players.filter(p => {
            const lastWellness = p.wellnessHistory?.[p.wellnessHistory.length - 1];
            const isHighSoreness = lastWellness && lastWellness.soreness > 7;
            const isHighLoad = p.rating > 90; // Exemplo de lógica de carga
            return isHighSoreness || p.status === 'QUESTIONABLE';
        });
    }, [players]);

    // VIEW: ATLETA
    if (currentRole === 'PLAYER' && me) {
        return (
            <div className="space-y-6 animate-fade-in pb-20">
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl">
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
                            <p className="text-highlight font-bold text-sm mb-4">{me.position} • {me.class} • FAHUB Stars</p>
                            
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-3">
                                <div className="flex justify-between text-xs font-bold text-text-secondary uppercase mb-1">
                                    <span>Nível de Comprometimento (Assiduidade)</span>
                                    <span className="text-highlight">95%</span>
                                </div>
                                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-highlight shadow-glow" style={{ width: `95%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-xl border border-white/10 min-w-[80px] shadow-inner">
                            <span className="text-xs text-text-secondary font-bold uppercase">OVR</span>
                            <span className="text-4xl font-black text-white">{me.rating}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Status Legal & Equipamento">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <ShieldCheckIcon className="w-5 h-5 text-highlight" />
                                    <span className="text-sm text-white">Inventário Aceito</span>
                                </div>
                                <CheckCircleIcon className="w-4 h-4 text-highlight" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                                    <span className="text-sm text-white">Seguro Atleta 2025</span>
                                </div>
                                <span className="text-[10px] font-black text-blue-400">APROVADO</span>
                            </div>
                        </div>
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigate('/academy')} className="bg-blue-900/40 border border-blue-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-blue-900/60 transition-all">
                            <DumbbellIcon className="w-8 h-8 text-blue-400" />
                            <span className="font-bold text-white text-sm">Iron Lab</span>
                        </button>
                        <button onClick={() => navigate('/locker-room')} className="bg-pink-900/40 border border-pink-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-pink-900/60 transition-all">
                            <UsersIcon className="w-8 h-8 text-pink-400" />
                            <span className="font-bold text-white text-sm">Vestiário</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // VIEW: MASTER/COACH
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
                    <p className="text-xs text-red-400 uppercase font-bold">Riscos Bio-Mecânicos</p>
                    <p className="text-3xl font-black text-red-500">{criticalAlerts.length}</p>
                </Card>
                <Card className="bg-secondary/80">
                    <p className="text-xs text-text-secondary uppercase font-bold">Equip. Pendente Aceite</p>
                    <p className="text-3xl font-black text-yellow-500">5</p>
                </Card>
            </div>

            {criticalAlerts.length > 0 && (
                <div className="bg-red-900/20 border-2 border-red-500/30 rounded-2xl p-6">
                    <h3 className="text-red-400 font-bold flex items-center gap-2 uppercase mb-4">
                        <AlertTriangleIcon className="w-6 h-6" /> Alertas de Risco de Lesão (Alta Carga)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {criticalAlerts.map(p => (
                            <div key={p.id} className="bg-black/40 p-3 rounded-xl border border-red-500/20 flex items-center gap-3">
                                <img src={p.avatarUrl} className="w-10 h-10 rounded-full border border-red-500" />
                                <div>
                                    <p className="text-white font-bold text-sm">{p.name}</p>
                                    <p className="text-[10px] text-red-300 uppercase font-bold">Demote Recomendado (Depth Chart)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Próximo Jogo (Logística)">
                     {stats?.nextGame ? (
                         <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-xl font-bold text-white uppercase">vs {stats.nextGame.opponent}</h4>
                                <p className="text-sm text-text-secondary">{new Date(stats.nextGame.date).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => navigate('/logistics')} className="bg-highlight text-white px-4 py-2 rounded-lg font-bold text-xs uppercase">Ver Manifesto</button>
                         </div>
                     ) : <p className="text-text-secondary italic">Sem jogos agendados.</p>}
                </Card>
                <Card title="Health Snapshot">
                    <div className="flex gap-4 items-center">
                        <div className="p-3 bg-green-500/10 rounded-full"><ActivityIcon className="text-green-400 w-8 h-8"/></div>
                        <div>
                            <p className="text-white font-bold">Time 100% Regular</p>
                            <p className="text-xs text-text-secondary">Todos os atletas com exames médicos em dia.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;