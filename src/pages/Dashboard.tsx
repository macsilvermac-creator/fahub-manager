
import React, { useContext, useEffect, useState, useMemo } from 'react';
import Card from '../components/Card';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import LazyImage from '../components/LazyImage';
import { 
    AlertTriangleIcon, CheckCircleIcon, DumbbellIcon, UsersIcon, SparklesIcon, 
    ActivityIcon, ShieldCheckIcon, WalletIcon, TargetIcon,
    ClipboardIcon, BankIcon, ShareIcon, BusIcon, ClockIcon
} from '../components/icons/UiIcons';
// Add missing SettingsNavIcon import
import { TrophyIcon, BookIcon, FlagIcon, WhistleIcon, SettingsNavIcon } from '../components/icons/NavIcons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const toast = useToast();
    
    const [players, setPlayers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [me, setMe] = useState<any>(null);
    const [systemHealth, setSystemHealth] = useState<any>(null);

    useEffect(() => {
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);
        setStats(storageService.getCoachDashboardStats());
        
        const user = authService.getCurrentUser();
        const myData = allPlayers.find(p => p.name === user?.name);
        setMe(myData || allPlayers[0]);

        setSystemHealth({ api: true, version: '8.0 PRO' });
    }, [currentRole]);

    const xpLeaders = useMemo(() => {
        return [...players].sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 5);
    }, [players]);

    const handleCopyInvite = () => {
        const url = `${window.location.origin}/#/register`;
        navigator.clipboard.writeText(url);
        toast.success("Link de recrutamento copiado!");
    };

    // --- RENDERS POR PERSONA (CONSOLIDADO PARA EVITAR ERRO DE BUILD) ---

    // 1. CEO (MASTER)
    const renderMaster = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex items-center gap-3 p-4"><AlertTriangleIcon className="text-blue-400 w-5 h-5"/><div><p className="text-[10px] uppercase font-bold text-text-secondary">Build</p><p className="text-white font-black">{systemHealth?.version}</p></div></Card>
                <Card className="flex items-center gap-3 p-4"><SparklesIcon className="text-green-400 w-5 h-5"/><div><p className="text-[10px] uppercase font-bold text-text-secondary">IA Hub</p><p className="text-green-400 font-black">Sync Active</p></div></Card>
                <Card className="flex items-center gap-3 p-4"><CheckCircleIcon className="text-highlight w-5 h-5"/><div><p className="text-[10px] uppercase font-bold text-text-secondary">DB Integrity</p><p className="text-white font-black">Verified</p></div></Card>
                <Card className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5" onClick={() => navigate('/admin')}><ClipboardIcon className="text-white w-5 h-5"/><div><p className="text-[10px] uppercase font-bold text-text-secondary">Admin</p><p className="text-white font-black underline">Console →</p></div></Card>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/10 gap-4">
                <div><h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Visão Estratégica (CEO)</h2><p className="text-text-secondary">Saúde organizacional em tempo real.</p></div>
                <button onClick={handleCopyInvite} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"><ShareIcon className="w-5 h-5"/> Recrutar Atletas</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card onClick={() => navigate('/finance')} className="cursor-pointer hover:border-highlight group"><BankIcon className="w-8 h-8 text-green-400 mb-4 group-hover:scale-110 transition-transform"/><p className="text-2xl font-black text-white">R$ 12.450</p><p className="text-xs text-text-secondary uppercase">Caixa Atual</p></Card>
                <Card onClick={() => navigate('/roster')} className="cursor-pointer hover:border-highlight group"><UsersIcon className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform"/><p className="text-2xl font-black text-white">{players.length}</p><p className="text-xs text-text-secondary uppercase">Elenco Ativo</p></Card>
                <Card onClick={() => navigate('/league')} className="cursor-pointer hover:border-highlight group"><TrophyIcon className="w-8 h-8 text-yellow-400 mb-4 group-hover:scale-110 transition-transform"/><p className="text-2xl font-black text-white">LIGA BFA</p><p className="text-xs text-text-secondary uppercase">Regularidade</p></Card>
            </div>
        </div>
    );

    // 2. COACH (HEAD COACH)
    const renderCoach = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Central do Treinador</h2>
            <div className="grid grid-cols-1 gap-4">
                <button onClick={() => navigate('/practice')} className="bg-gradient-to-br from-blue-900/40 to-black p-10 rounded-3xl border border-blue-500/30 flex flex-col items-center justify-center group hover:border-blue-400 transition-all">
                    <DumbbellIcon className="w-16 h-16 text-blue-400 mb-4 group-hover:scale-110 transition-all"/>
                    <span className="text-3xl font-black text-white uppercase italic tracking-tighter">Dia de Treino</span>
                    <span className="text-sm text-blue-300 mt-2">Scripts IA & Performance Lab</span>
                </button>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/tactical-lab')} className="bg-secondary p-6 rounded-2xl border border-white/5 flex flex-col items-center group hover:border-orange-500 transition-all"><SettingsNavIcon className="w-10 h-10 text-orange-400 mb-2"/><span className="font-bold text-white uppercase text-sm">Prancheta</span></button>
                    <button onClick={() => navigate('/video')} className="bg-secondary p-6 rounded-2xl border border-white/5 flex flex-col items-center group hover:border-purple-500 transition-all"><BookIcon className="w-10 h-10 text-purple-400 mb-2"/><span className="font-bold text-white uppercase text-sm">Film Room</span></button>
                </div>
            </div>
            <Card title="Status do Elenco">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-black/20 rounded-xl">
                        <p className="text-3xl font-black text-white">{players.filter(p => p.status === 'ACTIVE').length}</p>
                        <p className="text-[10px] text-text-secondary uppercase font-bold">Atos para Treino</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <p className="text-3xl font-black text-red-500">{players.filter(p => p.status === 'INJURED' || p.status === 'IR').length}</p>
                        <p className="text-[10px] text-text-secondary uppercase font-bold">No Departamento Médico</p>
                    </div>
                </div>
            </Card>
        </div>
    );

    // 3. PLAYER (ATLETA)
    const renderPlayer = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-highlight to-cyan-400">
                        <LazyImage src={me?.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-black" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{me?.name}</h1>
                        <p className="text-highlight font-bold text-sm mb-4">{me?.position} • FAHUB Stars</p>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <div className="flex justify-between text-xs font-bold text-text-secondary uppercase mb-1"><span>Nível {me?.level}</span><span>{me?.xp} XP</span></div>
                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-highlight to-cyan-400" style={{ width: `${(me?.xp % 100) || 0}%` }}></div></div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-xl border border-white/10 min-w-[80px]"><span className="text-xs text-text-secondary font-bold uppercase">OVR</span><span className="text-4xl font-black text-white">{me?.rating}</span></div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Próxima Missão">{stats?.nextGame ? <div className="text-center py-4"><p className="text-lg font-black text-white uppercase">VS {stats.nextGame.opponent}</p><p className="text-xs text-text-secondary">{new Date(stats.nextGame.date).toLocaleDateString()}</p></div> : <p className="text-center italic opacity-50">Aguardando calendário...</p>}</Card>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/academy')} className="bg-secondary p-4 rounded-xl border border-white/5 flex flex-col items-center"><DumbbellIcon className="w-6 h-6 text-red-400 mb-2"/><span className="text-[10px] font-black uppercase">Iron Lab</span></button>
                    <button onClick={() => navigate('/gemini-playbook')} className="bg-secondary p-4 rounded-xl border border-white/5 flex flex-col items-center"><BookIcon className="w-6 h-6 text-purple-400 mb-2"/><span className="text-[10px] font-black uppercase">Playbook</span></button>
                </div>
            </div>
        </div>
    );

    // 4. REFEREE (JUIZ)
    const renderReferee = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <FlagIcon className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Modo Oficial</h2>
            <p className="text-text-secondary mb-8 max-w-md">Controle de faltas, tempo e súmula digital. A integridade do jogo depende de você.</p>
            <button onClick={() => navigate('/officiating')} className="bg-yellow-500 text-black font-black px-12 py-4 rounded-2xl uppercase shadow-glow hover:scale-105 transition-all">Abrir Súmula do Jogo</button>
        </div>
    );

    // 5. CFO (FINANCEIRO)
    const renderFinance = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Diretoria Financeira</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-emerald-900/30 to-black border-l-4 border-emerald-500 group"><WalletIcon className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform"/><p className="text-3xl font-black text-white">R$ 8.420,00</p><p className="text-xs text-emerald-300 uppercase font-bold">Mensalidades a Receber</p></Card>
                <Card className="bg-gradient-to-br from-red-900/30 to-black border-l-4 border-red-500 group"><AlertTriangleIcon className="w-8 h-8 text-red-400 mb-4 group-hover:scale-110 transition-transform"/><p className="text-3xl font-black text-white">12%</p><p className="text-xs text-red-300 uppercase font-bold">Taxa de Inadimplência</p></Card>
            </div>
            <button onClick={() => navigate('/finance')} className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl uppercase shadow-lg hover:bg-emerald-500 transition-all">Gerenciar Fluxo de Caixa</button>
            <Card title="Orçamento por Categoria">
                <div className="space-y-4">
                    {['Transporte', 'Equipamentos', 'Arbitragem', 'Eventos'].map(cat => (
                        <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase"><span>{cat}</span><span>65%</span></div>
                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: '65%' }}></div></div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    // 6. DIRECTOR (OPERAÇÕES)
    const renderDirector = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Operações & Logística</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card onClick={() => navigate('/roster')} className="text-center cursor-pointer hover:border-blue-500 transition-all"><UsersIcon className="w-6 h-6 mx-auto mb-2 text-blue-400"/><p className="font-bold text-white uppercase text-[10px]">Atletas</p></Card>
                <Card onClick={() => navigate('/staff')} className="text-center cursor-pointer hover:border-indigo-500 transition-all"><UsersIcon className="w-6 h-6 mx-auto mb-2 text-indigo-400"/><p className="font-bold text-white uppercase text-[10px]">Staff</p></Card>
                <Card onClick={() => navigate('/inventory')} className="text-center cursor-pointer hover:border-orange-500 transition-all"><ClipboardIcon className="w-6 h-6 mx-auto mb-2 text-orange-400"/><p className="font-bold text-white uppercase text-[10px]">Patrimônio</p></Card>
                <Card onClick={() => navigate('/logistics')} className="text-center cursor-pointer hover:border-yellow-500 transition-all"><BusIcon className="w-6 h-6 mx-auto mb-2 text-yellow-400"/><p className="font-bold text-white uppercase text-[10px]">Logística</p></Card>
            </div>
            <div className="bg-secondary p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><ClockIcon className="w-4 h-4 text-highlight"/> Pendências Operacionais</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-text-secondary">Contratos a assinar</span><span className="text-white font-bold">4</span></div>
                    <div className="flex justify-between text-xs border-b border-white/5 pb-2"><span className="text-text-secondary">Itens com validade vencida</span><span className="text-red-400 font-bold">2 Capacetes</span></div>
                    <div className="flex justify-between text-xs pb-2"><span className="text-text-secondary">Vistorias de campo</span><span className="text-yellow-400 font-bold">Pendente</span></div>
                </div>
            </div>
        </div>
    );

    // --- PERSONA ROUTER ---
    if (currentRole === 'PLAYER') return renderPlayer();
    if (currentRole === 'HEAD_COACH') return renderCoach();
    if (currentRole === 'REFEREE') return renderReferee();
    if (currentRole === 'FINANCIAL_MANAGER') return renderFinance();
    if (currentRole === 'SPORTS_DIRECTOR') return renderDirector();
    
    // Default Visão CEO/MASTER
    return renderMaster();
};

export default Dashboard;