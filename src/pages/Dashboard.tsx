
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
import { Objective } from '../types';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [stats, setStats] = useState({ revenue: 0, players: 0, attendance: 0 });
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [objectives, setObjectives] = useState<Objective[]>([]);

    useEffect(() => {
        const loadDashboardData = () => {
            try {
                const players = storageService.getPlayers() || [];
                const goals = storageService.getObjectives() || [];
                
                setStats({
                    revenue: 12500,
                    players: players.length,
                    attendance: 82
                });
                setObjectives(goals);
                setAuditLogs(storageService.getAuditLogs().slice(0, 5));
            } catch (err) {
                console.error("Erro ao carregar dados do dashboard:", err);
            }
        };

        loadDashboardData();
        
        // Inscrição para atualizações em tempo real
        const unsubscribe = storageService.subscribe('storage_update', loadDashboardData);
        
        return () => unsubscribe();
    }, [currentRole]);

    const handleCreateObjective = () => {
        const title = prompt("Título da Meta Estratégica:");
        if (!title) return;
        
        const newObj: Objective = {
            id: `obj-${Date.now()}`,
            title,
            category: 'SPORTING',
            status: 'ON_TRACK',
            progress: 10,
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            ownerRole: 'HEAD_COACH',
            keyResults: []
        };
        
        const updated = [...objectives, newObj];
        storageService.saveObjectives(updated);
        storageService.logAuditAction('GOAL_CREATED', `Meta "${title}" criada.`);
        toast.success("Meta definida!");
    };

    // VISÃO MASTER: CENTRO DE COMANDO
    const renderMaster = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 p-4 rounded-2xl border border-white/5 shadow-sm">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Caixa Atual</p>
                    <p className="text-2xl font-black text-green-400">R$ {stats.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl border border-white/5 shadow-sm">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Frequência</p>
                    <p className="text-2xl font-black text-blue-400">{stats.attendance}%</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl border border-white/5 shadow-sm">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Elenco</p>
                    <p className="text-2xl font-black text-white">{stats.players} Atletas</p>
                </div>
                <div className="bg-highlight/10 p-4 rounded-2xl border border-highlight/20 flex items-center justify-between shadow-glow">
                    <span className="text-xs font-black text-highlight uppercase">Status IA</span>
                    <SparklesIcon className="text-highlight animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Estratégia Nacional (Big Data)" className="lg:col-span-2">
                    <div className="space-y-4">
                        {objectives.length > 0 ? (
                            objectives.map(obj => (
                                <div key={obj.id} className="bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-highlight transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-highlight/20 rounded-xl text-highlight">
                                            <TargetIcon className="w-6 h-6"/>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-sm uppercase italic">{obj.title}</p>
                                            <div className="w-48 h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-highlight" style={{width: `${obj.progress}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-highlight font-black">{obj.progress}%</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-30 border-2 border-dashed border-white/10 rounded-2xl">
                                <p className="text-xs font-black uppercase">Nenhuma meta ativa</p>
                            </div>
                        )}
                        <button onClick={handleCreateObjective} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black uppercase text-text-secondary transition-all">
                            + Definir Nova Meta Estratégica
                        </button>
                    </div>
                </Card>

                <Card title="Atividade Recente">
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
                            <p className="text-center py-10 text-[10px] text-text-secondary italic">Sem logs recentes.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );

    // VISÃO COACH: TÉCNICA E EXECUÇÃO
    const renderCoach = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="bg-blue-600 p-6 rounded-2xl shadow-xl flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Painel do Treinador</h3>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1">Pronto para a Sideline</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                    <WhistleIcon className="text-white w-8 h-8" />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Próximos Treinos">
                     <div className="text-center py-10 opacity-30 italic font-bold uppercase text-xs">Nenhum treino hoje.</div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-secondary p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-3 hover:border-highlight transition-all group">
                         <WhistleIcon className="w-10 h-10 text-highlight group-hover:scale-110 transition-transform" />
                         <span className="text-xs font-black text-white uppercase italic">Novo Treino</span>
                    </button>
                    <button className="bg-secondary p-6 rounded-2xl border border-white/5 flex flex-col items-center gap-3 hover:border-purple-500 transition-all group">
                         <ActivityIcon className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
                         <span className="text-xs font-black text-white uppercase italic">Playbook</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // VISÃO ATLETA: CARREIRA E GAMIFICAÇÃO
    const renderPlayer = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-highlight to-cyan-400 shadow-glow">
                        <LazyImage src="" className="w-full h-full rounded-full object-cover border-4 border-black" fallbackText="Atleta" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Minha Carreira</h1>
                        <p className="text-highlight font-black text-[10px] uppercase tracking-widest mt-1">Nível 5 • QB • FAHUB STARS</p>
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 text-center">
                        <span className="text-[10px] text-text-secondary uppercase font-bold">OVR</span>
                        <p className="text-3xl font-black text-white leading-none">88</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Minhas Skills" className="md:col-span-2">
                    <div className="grid grid-cols-2 gap-6">
                        {['Explosão', 'Força', 'Tática', 'Frequência'].map(skill => (
                            <div key={skill} className="space-y-1">
                                <div className="flex justify-between text-[9px] font-black text-text-secondary uppercase">
                                    <span>{skill}</span>
                                    <span>88%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-highlight" style={{width: '88%'}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Próximo Desbloqueio">
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                         <div className="p-4 bg-white/5 rounded-2xl opacity-20">
                             <TrophyIcon className="w-10 h-10"/>
                         </div>
                         <p className="text-[10px] text-text-secondary uppercase font-bold">Nível 6: Capitão de Unidade</p>
                    </div>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="h-full">
            {currentRole === 'MASTER' && renderMaster()}
            {currentRole === 'HEAD_COACH' && renderCoach()}
            {currentRole === 'PLAYER' && renderPlayer()}
        </div>
    );
};

export default Dashboard;
