import React, { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import Card from '../components/Card';
import { 
    ActivityIcon, UsersIcon, CheckCircleIcon, ClockIcon, 
    WalletIcon, SparklesIcon, WhistleIcon, TrophyIcon, TargetIcon,
    AlertTriangleIcon, TrendingUpIcon, HeartIcon
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';
import { Objective, Player } from '../types';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [stats, setStats] = useState({ revenue: 15400, players: 0, attendance: 82, medicalAlerts: 3 });
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [program, setProgram] = useState('TACKLE');

    useEffect(() => {
        const load = () => {
            const p = storageService.getPlayers() || [];
            const obj = storageService.getObjectives() || [];
            setPlayers(p);
            setObjectives(obj);
            setStats(prev => ({ ...prev, players: p.length }));
            setProgram(storageService.getActiveProgram());
        };
        load();
        return storageService.subscribe('storage_update', load);
    }, []);

    // --- VISÃO MASTER (PRESIDÊNCIA) ---
    const renderMaster = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <header className="flex justify-between items-center bg-[#0F172A] p-6 rounded-[2rem] border border-white/5 shadow-xl">
                <div>
                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Business Command</h2>
                    <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Saúde Institucional e Governança</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-[10px] text-text-secondary uppercase font-bold">Faturamento Mes</p>
                        <p className="text-xl font-black text-green-400">R$ {stats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-right">
                        <p className="text-[10px] text-text-secondary uppercase font-bold">Churn Rate</p>
                        <p className="text-xl font-black text-red-400">2.4%</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Objetivos Estratégicos (OKRs)">
                    <div className="space-y-4">
                        {objectives.slice(0, 3).map(obj => (
                            <div key={obj.id} className="bg-black/20 p-3 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-black text-white uppercase">{obj.title}</span>
                                    <span className="text-highlight font-black text-xs">{obj.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-highlight shadow-glow" style={{width: `${obj.progress}%`}}></div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-text-secondary transition-all">Ver Roadmap Completo</button>
                    </div>
                </Card>

                <Card title="Radar de Elenco">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                            <span className="text-xs text-text-secondary">Atletas Federados</span>
                            <span className="text-white font-black">{stats.players}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-600/10 border border-red-500/20 rounded-xl">
                            <span className="text-xs text-red-300">Pendências Médicas</span>
                            <span className="text-red-400 font-black">{stats.medicalAlerts}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-highlight/10 border border-highlight/20 rounded-xl">
                            <span className="text-xs text-highlight">Novos Prospectos</span>
                            <span className="text-white font-black">12</span>
                        </div>
                    </div>
                </Card>

                <Card title="Ações de Diretoria">
                    <div className="grid grid-cols-2 gap-2">
                        <button className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <WalletIcon className="w-6 h-6 text-highlight" />
                            <span className="text-[10px] font-black uppercase text-white">Financeiro</span>
                        </button>
                        <button className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <UsersIcon className="w-6 h-6 text-blue-400" />
                            <span className="text-[10px] font-black uppercase text-white">Roster</span>
                        </button>
                        <button className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <TrendingUpIcon className="w-6 h-6 text-yellow-500" />
                            <span className="text-[10px] font-black uppercase text-white">Marketing</span>
                        </button>
                        <button className="p-4 bg-secondary border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:border-highlight transition-all">
                            <TargetIcon className="w-6 h-6 text-purple-400" />
                            <span className="text-[10px] font-black uppercase text-white">Tryouts</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- VISÃO COACH (TÉCNICO) ---
    const renderCoach = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-end md:items-center">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <WhistleIcon className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.4em]">Sideline Operations</span>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mt-2">Próxima Instalação</h2>
                    <p className="text-blue-100 font-bold mt-4 uppercase text-xs flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" /> Terça-feira, 19:30 • Campo de Treino
                    </p>
                </div>
                <button onClick={() => toast.info("Abrindo Script de Treino...")} className="relative z-10 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase italic shadow-xl transform active:scale-95 transition-all mt-6 md:mt-0">
                    Ver Roteiro de Hoje
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Prontidão do Elenco (Readiness)">
                    <div className="flex items-center gap-8 py-4">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="10" className="text-white/5" />
                                <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="10" strokeDasharray="364" strokeDashoffset="72" className="text-blue-400" />
                            </svg>
                            <span className="absolute text-3xl font-black text-white italic">80%</span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-text-secondary font-bold uppercase">
                                <CheckCircleIcon className="text-green-500 w-4 h-4" /> 38 Atletas Aptos
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary font-bold uppercase">
                                <AlertTriangleIcon className="text-red-500 w-4 h-4" /> 4 No Departamento Médico
                            </div>
                            <div className="flex items-center gap-2 text-xs text-text-secondary font-bold uppercase">
                                <ClockIcon className="text-yellow-500 w-4 h-4" /> 6 Em Observação
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Inteligência Tática">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 hover:border-blue-500 transition-all cursor-pointer">
                             <SparklesIcon className="w-8 h-8 text-purple-400 mb-2" />
                             <h4 className="text-white font-bold text-xs uppercase">Playbook IA</h4>
                             <p className="text-[9px] text-text-secondary mt-1">Sugerir Drills para Redzone</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 hover:border-blue-500 transition-all cursor-pointer">
                             <ActivityIcon className="w-8 h-8 text-blue-400 mb-2" />
                             <h4 className="text-white font-bold text-xs uppercase">Depth Chart</h4>
                             <p className="text-[9px] text-text-secondary mt-1">Gerenciar Rotação Ativa</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- VISÃO ATLETA (JOGADOR) ---
    const renderPlayer = () => {
        const myPlayer = players.find(p => p.name.includes("Lucas")) || players[0];
        return (
            <div className="space-y-6 animate-fade-in pb-20 max-w-4xl mx-auto">
                <div className="relative bg-gradient-to-br from-highlight via-[#0F172A] to-black p-8 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-highlight to-cyan-400 shadow-glow">
                                <LazyImage src={myPlayer?.avatarUrl || ''} className="w-full h-full rounded-full object-cover border-4 border-black" fallbackText="Player" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-black text-white font-black text-xl w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-highlight shadow-lg">
                                {myPlayer?.level || 1}
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-[10px] font-black text-highlight uppercase tracking-[0.4em] mb-1 block">Roster Ativo</span>
                            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{myPlayer?.name}</h1>
                            <p className="text-text-secondary font-bold text-sm mt-3 uppercase tracking-widest">{myPlayer?.position} • FAHUB STARS • {program}</p>
                            
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between text-[9px] font-black text-white uppercase tracking-widest">
                                    <span>Nível {myPlayer?.level || 1} Progress</span>
                                    <span>{myPlayer?.xp || 0} / 1000 XP</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <div className="h-full bg-gradient-to-r from-highlight to-cyan-400 shadow-glow" style={{width: `${(myPlayer?.xp || 0) / 10}%`}}></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 text-center min-w-[100px]">
                            <p className="text-[10px] font-black text-text-secondary uppercase mb-1">Overall</p>
                            <p className="text-4xl font-black text-white italic">{myPlayer?.rating || 70}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Próximo Treino">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl">
                                <WhistleIcon className="w-8 h-8 text-highlight" />
                            </div>
                            <div>
                                <p className="text-white font-bold uppercase italic">Instalação Tática</p>
                                <p className="text-xs text-text-secondary">Hoje às 19:30 • Estádio Municipal</p>
                                <button className="mt-3 bg-highlight text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase">Confirmar Presença</button>
                            </div>
                        </div>
                    </Card>
                    <Card title="Check-in Diário (Wellness)">
                        <p className="text-[10px] text-text-secondary uppercase font-bold mb-4 italic leading-tight">Como você está se sentindo hoje, Guerreiro? Suas respostas ajudam a IA a ajustar sua carga de treino.</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex flex-col items-center gap-1 hover:bg-green-500 hover:text-white transition-all">
                                <HeartIcon className="w-5 h-5" />
                                <span className="text-[8px] font-black uppercase">Fresco</span>
                            </button>
                            <button className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex flex-col items-center gap-1 hover:bg-yellow-500 hover:text-white transition-all">
                                <ActivityIcon className="w-5 h-5" />
                                <span className="text-[8px] font-black uppercase">Cansado</span>
                            </button>
                            <button className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col items-center gap-1 hover:bg-red-500 hover:text-white transition-all">
                                <AlertTriangleIcon className="w-5 h-5" />
                                <span className="text-[8px] font-black uppercase">Dor</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full">
            {currentRole === 'MASTER' && renderMaster()}
            {currentRole === 'HEAD_COACH' && renderCoach()}
            {currentRole === 'PLAYER' && renderPlayer()}
        </div>
    );
};

export default Dashboard;