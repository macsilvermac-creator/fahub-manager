
import React, { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import Card from '../components/Card';
import { 
    ActivityIcon, UsersIcon, CheckCircleIcon, ClockIcon, 
    WalletIcon, SparklesIcon
} from '../components/icons/UiIcons';
import { TrophyIcon, WhistleIcon } from '../components/icons/NavIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [objectives, setObjectives] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [stats, setStats] = useState({ revenue: 0, players: 0, attendance: 0 });
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const loadDashboardData = () => {
            setObjectives(storageService.getObjectives());
            setAuditLogs(storageService.getAuditLogs().slice(0, 10));
            
            const players = storageService.getPlayers();
            setStats({
                revenue: 12500,
                players: players.length,
                attendance: 82
            });
            setIsInitialLoad(false);
        };

        loadDashboardData();
        const unsub = storageService.subscribe('objectives', loadDashboardData);
        const unsubAudit = storageService.subscribe('audit', loadDashboardData);
        return () => { unsub(); unsubAudit(); };
    }, [currentRole]);

    const handleCreateObjective = () => {
        const title = prompt("Título da Meta Estratégica:");
        if (!title) return;
        
        const newObj = {
            id: `obj-${Date.now()}`,
            title,
            description: "Nova meta definida pelo gestor da plataforma.",
            category: 'SPORTING',
            status: 'IN_PROGRESS',
            progress: 10,
            deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            ownerRole: 'HEAD_COACH',
            keyResults: []
        };
        
        storageService.saveObjectives([...objectives, newObj]);
        storageService.logAuditAction('GOAL_CREATED', `Meta global "${title}" criada para teste de fluxo.`);
        toast.success("Meta criada!");
    };

    if (isInitialLoad) {
        return <div className="h-full w-full flex items-center justify-center text-text-secondary font-black animate-pulse uppercase tracking-[0.3em]">Carregando Command Center...</div>;
    }

    // VISÃO MASTER: CENTRO DE COMANDO
    const renderMaster = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Caixa Atual</p>
                    <p className="text-2xl font-black text-green-400">R$ {stats.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Frequência</p>
                    <p className="text-2xl font-black text-blue-400">{stats.attendance}%</p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Elenco</p>
                    <p className="text-2xl font-black text-white">{stats.players} Atletas</p>
                </div>
                <div className="bg-highlight/10 p-4 rounded-2xl border border-highlight/20 flex items-center justify-between">
                    <span className="text-xs font-black text-highlight uppercase">Status IA</span>
                    <SparklesIcon className="text-highlight animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Estratégia Global (OKRs)" className="lg:col-span-2">
                    <div className="space-y-4">
                        {objectives.map(obj => (
                            <div key={obj.id} className="bg-black/20 p-4 rounded-xl border border-white/5 group hover:border-highlight/50 transition-all">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white font-bold uppercase italic text-sm">{obj.title}</h4>
                                    <span className="text-[10px] font-black text-text-secondary uppercase">{obj.status}</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-highlight shadow-glow" style={{width: `${obj.progress}%`}}></div>
                                </div>
                            </div>
                        ))}
                        <button onClick={handleCreateObjective} className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-xs font-black text-text-secondary uppercase hover:border-highlight hover:text-white transition-all">
                            + Lançar Meta para o Time
                        </button>
                    </div>
                </Card>

                <Card title="Atividade Recente">
                    <div className="space-y-4">
                        {auditLogs.map(log => (
                            <div key={log.id} className="flex gap-3">
                                <div className="w-1 h-8 bg-highlight/30 rounded-full"></div>
                                <div>
                                    <p className="text-[10px] text-white font-bold uppercase leading-none">{log.userName}</p>
                                    <p className="text-[10px] text-text-secondary mt-1">{log.details}</p>
                                </div>
                            </div>
                        ))}
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
                     <div className="text-center py-10 opacity-50 italic">Nenhum treino hoje.</div>
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
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-highlight to-cyan-400">
                        <LazyImage src="" className="w-full h-full rounded-full object-cover border-4 border-black" fallbackText="Atleta" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Minha Carreira</h1>
                        <p className="text-highlight font-black text-[10px] uppercase tracking-widest mt-1">Nível 5 • QB • FAHUB STARS</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Minhas Skills" className="md:col-span-2">
                    <div className="grid grid-cols-2 gap-4">
                        {['Velocidade', 'Força', 'Tática', 'Frequência'].map(skill => (
                            <div key={skill} className="space-y-1">
                                <div className="flex justify-between text-[9px] font-black text-text-secondary uppercase">
                                    <span>{skill}</span>
                                    <span>88</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{width: '88%'}}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Combine">
                    <p className="text-sm font-bold text-white uppercase italic">40 Yard Dash</p>
                    <p className="text-3xl font-black text-highlight">4.52s</p>
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
