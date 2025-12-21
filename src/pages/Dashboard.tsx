
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import Card from '../components/Card';
import { 
    ActivityIcon, UsersIcon, CheckCircleIcon, ClockIcon, 
    WalletIcon, SparklesIcon, TargetIcon, AlertTriangleIcon,
    TrendingUpIcon, ShieldCheckIcon
} from '../components/icons/UiIcons';
import { TrophyIcon, WhistleIcon, BriefcaseIcon } from '../components/icons/NavIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [okrs, setOkrs] = useState<any[]>([]);
    const [signals, setSignals] = useState<any[]>([]);
    const [stats, setStats] = useState({ revenue: 0, athletes: 0, compliance: 0 });

    useEffect(() => {
        const load = () => {
            const allOkrs = storageService.getOKRs();
            setOkrs(allOkrs);
            setSignals(storageService.getSignals());
            
            const players = storageService.getPlayers();
            const eligible = players.filter(p => storageService.validateAthleteEligibility(p.id).eligible).length;
            
            setStats({
                revenue: 45800,
                athletes: players.length,
                compliance: players.length > 0 ? Math.round((eligible / players.length) * 100) : 0
            });
        };
        load();
        window.addEventListener('storage_update', load);
        return () => window.removeEventListener('storage_update', load);
    }, []);

    const isPresidentOrVP = ['PRESIDENT', 'VICE_PRESIDENT', 'MASTER'].includes(currentRole);
    const isTechnical = ['HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD'].includes(currentRole);

    const renderWarRoom = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* KPI Macro - O Pulso do Presidente */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-900/20 to-secondary border-l-4 border-l-green-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Ebitda Estimado</p>
                    <p className="text-2xl font-black text-white">R$ {stats.revenue.toLocaleString()}</p>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/20 to-secondary border-l-4 border-l-blue-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Prontidão de Elenco</p>
                    <p className="text-2xl font-black text-white">{stats.compliance}% <span className="text-xs font-normal opacity-50">Elegível</span></p>
                </Card>
                <Card className="bg-gradient-to-br from-purple-900/20 to-secondary border-l-4 border-l-purple-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase">Market Share Local</p>
                    <p className="text-2xl font-black text-white">High</p>
                </Card>
                <div className="bg-highlight/10 p-4 rounded-2xl border border-highlight/20 flex flex-col justify-center items-center shadow-glow">
                    <SparklesIcon className="text-highlight mb-1 animate-pulse" />
                    <span className="text-[10px] font-black text-highlight uppercase">IA Governance On</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metas Hierárquicas (OKRs) */}
                <Card title="FAHUB OKRs (Cascateamento)" className="lg:col-span-2">
                    <div className="space-y-6">
                        {okrs.map(okr => (
                            <div key={okr.id} className="group relative">
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <h4 className="text-white font-bold text-sm uppercase italic">{okr.title}</h4>
                                        <p className="text-[10px] text-text-secondary uppercase tracking-widest">{okr.ownerRole}</p>
                                    </div>
                                    <span className={`text-xs font-black ${okr.status === 'AT_RISK' ? 'text-red-400' : 'text-highlight'}`}>
                                        {okr.currentValue}{okr.unit} / {okr.targetValue}{okr.unit}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${okr.status === 'AT_RISK' ? 'bg-red-500' : 'bg-highlight shadow-glow'}`} 
                                        style={{ width: `${(okr.currentValue / okr.targetValue) * 100}%` }}
                                    ></div>
                                </div>
                                {okr.parentOkrId && (
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/10 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Timeline de Sinais Críticos */}
                <Card title="Pulso do Clube (Sinais)">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {signals.length > 0 ? (
                            signals.map(sig => (
                                <div key={sig.id} className="p-3 bg-black/20 rounded-xl border border-white/5 flex gap-3 items-start animate-slide-in">
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${sig.type === 'ALERT' ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-highlight'}`}></div>
                                    <div>
                                        <p className="text-[10px] text-white font-bold leading-tight">
                                            <span className="text-highlight uppercase">{sig.fromRole}</span>: {sig.message}
                                        </p>
                                        <p className="text-[8px] text-text-secondary mt-1">{new Date(sig.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 opacity-30 italic text-xs uppercase">Aguardando sinais das diretorias...</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderTechnical = () => (
        <div className="space-y-6 animate-fade-in pb-20">
             <header className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 rounded-3xl shadow-xl flex justify-between items-center relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10">
                    <WhistleIcon className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Campo de Batalha</h3>
                    <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Status: Modo Sideline Ativo</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md">
                    <span className="text-[10px] font-black text-white uppercase block mb-1">Próximo Kickoff</span>
                    <span className="text-xl font-mono font-bold text-white">14:20:05</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => window.location.href='#/training-day'} className="glass-panel bg-secondary/40 border-2 border-blue-500/30 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-blue-400 transition-all group active:scale-95">
                    <div className="p-5 bg-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                        <WhistleIcon className="w-12 h-12 text-blue-400" />
                    </div>
                    <span className="text-xl font-black text-white uppercase italic">Iniciar Sessão de Treino</span>
                    <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Acesso ao Script & RPE</span>
                </button>

                <button onClick={() => window.location.href='#/tactical-lab'} className="glass-panel bg-secondary/40 border-2 border-purple-500/30 p-8 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-purple-400 transition-all group active:scale-95">
                    <div className="p-5 bg-purple-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                        <TargetIcon className="w-12 h-12 text-purple-400" />
                    </div>
                    <span className="text-xl font-black text-white uppercase italic">Playbook & Simulação</span>
                    <span className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">Estudo de formação IA</span>
                </button>
            </div>

            <Card title="Alertas do Diretor de Esportes">
                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-red-900/10 border border-red-500/20 rounded-2xl">
                        <AlertTriangleIcon className="w-6 h-6 text-red-500 animate-pulse" />
                        <div>
                            <p className="text-sm font-bold text-white uppercase">Atleta Suspenso (Financeiro)</p>
                            <p className="text-xs text-text-secondary">#12 Lucas "Thor" não pode participar do treino coletivo hoje.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-2xl">
                        <ClockIcon className="w-6 h-6 text-yellow-500" />
                        <div>
                            <p className="text-sm font-bold text-white uppercase">Atestado Vencido</p>
                            <p className="text-xs text-text-secondary">5 atletas precisam de reavaliação médica para o próximo jogo.</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );

    return (
        <div className="h-full">
            {isPresidentOrVP && renderWarRoom()}
            {isTechnical && renderTechnical()}
            {!isPresidentOrVP && !isTechnical && (
                <div className="flex flex-col items-center justify-center h-[70vh] opacity-30 italic font-black uppercase">
                    <ShieldCheckIcon className="w-20 h-20 mb-4" />
                    Selecione sua Persona no Menu para Testar o Fluxo
                </div>
            )}
        </div>
    );
};

export default Dashboard;
