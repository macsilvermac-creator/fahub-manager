
import React, { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import Card from '../components/Card';
import { 
    ActivityIcon, UsersIcon, CheckCircleIcon, ClockIcon, 
    WalletIcon, SparklesIcon, WhistleIcon, TrophyIcon, TargetIcon 
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [stats, setStats] = useState({ revenue: 0, players: 0, attendance: 0 });
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [objectives, setObjectives] = useState<any[]>([]);
    const [okrs, setOkrs] = useState<any[]>([]);

    useEffect(() => {
        const loadDashboardData = () => {
            try {
                const players = storageService.getPlayers() || [];
                const goals = storageService.getObjectives() || [];
                const currentOkrs = storageService.getOKRs() || [];
                
                setStats({
                    revenue: 45800,
                    players: players.length,
                    attendance: 82
                });
                setObjectives(goals);
                setOkrs(currentOkrs);
                setAuditLogs(storageService.getAuditLogs().slice(0, 5));
            } catch (err) {
                console.error("Erro ao carregar dados do dashboard:", err);
            }
        };

        loadDashboardData();
        
        const unsub = storageService.subscribe('fahub_data_change', loadDashboardData);
        window.addEventListener('storage_update', loadDashboardData);
        
        return () => {
            unsub();
            window.removeEventListener('storage_update', loadDashboardData);
        };
    }, [currentRole]);

    const handleCreateObjective = () => {
        const title = prompt("Título da Meta Estratégica:");
        if (!title) return;
        
        const newObj = {
            id: `obj-${Date.now()}`,
            title,
            category: 'SPORTING',
            status: 'ON_TRACK',
            progress: 10,
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            ownerRole: 'HEAD_COACH'
        };
        
        const updated = [...objectives, newObj];
        storageService.saveObjectives(updated);
        storageService.logAuditAction('GOAL_CREATED', `Meta "${title}" criada.`);
        toast.success("Meta definida!");
    };

    const isPresidentOrVP = ['PRESIDENT', 'VICE_PRESIDENT', 'MASTER'].includes(currentRole);

    const renderMaster = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-900/20 to-secondary border-l-4 border-l-green-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Fluxo Projetado</p>
                    <p className="text-2xl font-black text-white">R$ {stats.revenue.toLocaleString()}</p>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/20 to-secondary border-l-4 border-l-blue-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Frequência</p>
                    <p className="text-2xl font-black text-blue-400">{stats.attendance}%</p>
                </Card>
                <Card className="bg-gradient-to-br from-purple-900/20 to-secondary border-l-4 border-l-purple-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Elenco Ativo</p>
                    <p className="text-2xl font-black text-white">{stats.players} Atletas</p>
                </Card>
                <div className="bg-highlight/10 p-4 rounded-2xl border border-highlight/20 flex flex-col justify-center items-center shadow-glow">
                    <SparklesIcon className="text-highlight mb-1 animate-pulse" />
                    <span className="text-[10px] font-black text-highlight uppercase">IA Monitoring</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="FAHUB OKRs (Governança)" className="lg:col-span-2">
                    <div className="space-y-6">
                        {okrs.length > 0 ? (
                            okrs.map(okr => (
                                <div key={okr.id}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h4 className="text-white font-bold text-sm uppercase italic">{okr.title}</h4>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-widest">{okr.ownerRole}</p>
                                        </div>
                                        <span className="text-xs font-black text-highlight">
                                            {okr.currentValue}{okr.unit} / {okr.targetValue}{okr.unit}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-highlight transition-all duration-1000 shadow-glow" 
                                            style={{ width: `${(okr.currentValue / okr.targetValue) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-30 border-2 border-dashed border-white/10 rounded-2xl">
                                <p className="text-xs font-black uppercase">Nenhuma meta configurada</p>
                            </div>
                        )}
                        <button onClick={handleCreateObjective} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase text-text-secondary transition-all">
                            + Definir Novo Objetivo Estratégico
                        </button>
                    </div>
                </Card>

                <Card title="Pulso do Clube (Signals)">
                    <div className="space-y-4">
                        {auditLogs.length > 0 ? (
                            auditLogs.map(log => (
                                <div key={log.id} className="flex gap-3">
                                    <div className="w-1 h-8 bg-highlight/30 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-white font-bold uppercase leading-none">{log.userName}</p>
                                        <p className="text-[10px] text-text-secondary mt-1">{log.details}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-[10px] text-text-secondary italic">Aguardando sinais...</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderCoach = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 rounded-3xl shadow-xl flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Painel do Treinador</h3>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">Sessão Ativa: Preparação</p>
                </div>
                <WhistleIcon className="text-white w-8 h-8" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => window.location.href='#/training-day'} className="bg-secondary p-8 rounded-3xl border border-white/5 flex flex-col items-center gap-4 hover:border-blue-400 active:scale-95 transition-all group">
                    <WhistleIcon className="w-12 h-12 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black text-white uppercase italic">Iniciar Treino</span>
                </button>
                <button onClick={() => window.location.href='#/roster'} className="bg-secondary p-8 rounded-3xl border border-white/5 flex flex-col items-center gap-4 hover:border-highlight active:scale-95 transition-all group">
                    <UsersIcon className="w-12 h-12 text-highlight group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black text-white uppercase italic">Gerenciar Elenco</span>
                </button>
            </div>
        </div>
    );

    const renderPlayer = () => (
        <div className="space-y-6 animate-fade-in pb-20 text-center py-20 opacity-50 font-black uppercase italic">
            Dashboard do Atleta em Manutenção
        </div>
    );

    return (
        <div className="h-full">
            {isPresidentOrVP ? renderMaster() : currentRole === 'HEAD_COACH' ? renderCoach() : renderPlayer()}
        </div>
    );
};

export default Dashboard;