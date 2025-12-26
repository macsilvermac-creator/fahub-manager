import React, { useContext, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import Card from '../components/Card';
import { 
    UsersIcon, FinanceIcon, MegaphoneIcon, 
    WhistleIcon, TrophyIcon, BriefcaseIcon,
    SparklesIcon, TargetIcon, ShieldCheckIcon,
    ClockIcon, BrainIcon, ActivityIcon, HeartPulseIcon
} from '../components/icons/UiIcons';
// Fix: Added missing import for LazyImage component
import LazyImage from '../components/LazyImage';
import { storageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const context = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const currentRole = context.currentRole;
    const user = storageService.getCurrentUser();
    const program = user?.program || 'TACKLE';

    // --- VISÃO MASTER / PRESIDÊNCIA ---
    const renderMasterView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-900/20 to-slate-900 border-green-500/20">
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Receita Mensal</p>
                    <p className="text-2xl font-black text-white mt-1 italic">R$ 42.500</p>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-500/20">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Atletas Ativos</p>
                    <p className="text-2xl font-black text-white mt-1 italic">156</p>
                </Card>
                <Card className="bg-gradient-to-br from-orange-900/20 to-slate-900 border-orange-500/20">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Mídia & Fãs</p>
                    <p className="text-2xl font-black text-white mt-1 italic">12.4k</p>
                </Card>
                <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/20">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Metas Estratégicas</p>
                    <p className="text-2xl font-black text-white mt-1 italic">4/6</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="War Room: Centro de Missões" className="lg:col-span-2 border-highlight/20 bg-black/20">
                    <div className="space-y-4">
                        {[
                            { dir: 'Comercial', msg: 'Renovação do Patrocínio Máster', priority: 'HIGH', status: 'EM ANDAMENTO' },
                            { dir: 'Marketing', msg: 'Venda antecipada Ingressos Playoffs', priority: 'MEDIUM', status: 'AGUARDANDO' }
                        ].map((mission, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${mission.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                    <p className="text-xs font-black text-white uppercase italic">{mission.msg}</p>
                                </div>
                                <span className="text-[8px] font-black px-2 py-1 bg-black/40 rounded border border-white/10 text-text-secondary">{mission.status}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Relatório Financeiro" className="lg:col-span-1">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-text-secondary">Mensalidades</span>
                            <span className="text-white font-bold">R$ 15.200</span>
                        </div>
                        <div className="pt-4 flex justify-between items-center font-black">
                            <span className="text-highlight uppercase text-xs">Total Receita</span>
                            <span className="text-xl text-white">R$ 42.500</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- VISÃO TÉCNICA (COACHES) ---
    const renderCoachView = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 p-8 rounded-[3rem] border border-blue-500/20 flex justify-between items-center relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <WhistleIcon className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Command Center</h2>
                    <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mt-1">Operation: {program} Ready</p>
                </div>
                <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 hidden md:block shrink-0">
                    <p className="text-[10px] text-text-secondary uppercase font-black">Próximo Snap</p>
                    <p className="text-white font-bold">Treino Tático - 19:30</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => navigate('/training-day')} className="group relative bg-secondary/60 hover:bg-secondary border border-white/5 hover:border-highlight transition-all p-8 rounded-[2.5rem] text-left overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform"><ActivityIcon className="w-20 h-20 text-highlight" /></div>
                    <div className="p-3 bg-highlight/10 rounded-2xl w-fit mb-6"><WhistleIcon className="w-8 h-8 text-highlight" /></div>
                    <h3 className="text-2xl font-black text-white uppercase italic">Field Execution</h3>
                    <p className="text-text-secondary text-xs mt-2 font-medium">Scripts, Drills e Frequência ao vivo.</p>
                </button>
                <button onClick={() => navigate('/tactical-lab')} className="group relative bg-secondary/60 hover:bg-secondary border border-white/5 hover:border-cyan-500 transition-all p-8 rounded-[2.5rem] text-left overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform"><BrainIcon className="w-20 h-20 text-cyan-400" /></div>
                    <div className="p-3 bg-cyan-500/10 rounded-2xl w-fit mb-6"><BrainIcon className="w-8 h-8 text-cyan-400" /></div>
                    <h3 className="text-2xl font-black text-white uppercase italic">Tactical Library</h3>
                    <p className="text-text-secondary text-xs mt-2 font-medium">Playbook digital e análise de padrões.</p>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="OVR Equipe">
                    <div className="text-center py-4">
                        <p className="text-5xl font-black text-highlight italic">74.2</p>
                        <p className="text-[10px] text-text-secondary uppercase mt-2 font-bold tracking-widest">Baseado no último treino</p>
                    </div>
                </Card>
                <Card title="Alertas DP" className="md:col-span-2">
                    <div className="flex items-center gap-4 text-sm text-text-secondary italic h-full">
                         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                         Nenhum atleta em protocolo de concussão ou IR crítica hoje.
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- VISÃO ATLETA ---
    const renderPlayerView = () => (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[3rem] border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12">
                    <TrophyIcon className="w-64 h-64 text-white" />
                </div>
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-highlight to-cyan-400 shrink-0">
                    <LazyImage src={user?.avatarUrl || ''} className="w-full h-full rounded-full border-4 border-primary object-cover" />
                </div>
                <div className="flex-1 text-center md:text-left relative z-10">
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{user?.name}</h2>
                    <p className="text-highlight font-bold uppercase tracking-widest text-xs mt-1">Ataque • QB • #12</p>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="text-center bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[8px] text-text-secondary uppercase font-black">Level</p>
                            <p className="text-xl font-black text-white">15</p>
                        </div>
                        <div className="text-center bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[8px] text-text-secondary uppercase font-black">Rating</p>
                            <p className="text-xl font-black text-highlight">82</p>
                        </div>
                        <div className="text-center bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[8px] text-text-secondary uppercase font-black">XP</p>
                            <p className="text-xl font-black text-blue-400">420</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => navigate('/tactical-lab')} className="bg-secondary/40 border border-white/10 p-6 rounded-3xl flex items-center gap-4 hover:border-highlight transition-all">
                    <div className="p-3 bg-highlight/10 rounded-2xl text-highlight"><BrainIcon className="w-6 h-6"/></div>
                    <div className="text-left">
                        <h4 className="text-white font-black uppercase text-sm italic">Estudar Playbook</h4>
                        <p className="text-[10px] text-text-secondary uppercase">Novas jogadas instaladas</p>
                    </div>
                </button>
                <button onClick={() => navigate('/finance')} className="bg-secondary/40 border border-white/10 p-6 rounded-3xl flex items-center gap-4 hover:border-green-500 transition-all">
                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-400"><FinanceIcon className="w-6 h-6"/></div>
                    <div className="text-left">
                        <h4 className="text-white font-black uppercase text-sm italic">Financeiro</h4>
                        <p className="text-[10px] text-text-secondary uppercase">Mensalidade: Regular</p>
                    </div>
                </button>
            </div>
        </div>
    );

    // --- VISÃO DIRETORIA (ESPORTES/COMERCIAL/MARKETING) ---
    const renderDirectorView = (title: string, focus: string, icon: React.FC<any>) => (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-secondary/40 border border-white/10 p-8 rounded-[3rem] flex justify-between items-center shadow-xl">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{title}</h2>
                    <p className="text-highlight text-sm font-bold uppercase mt-1 tracking-widest">Foco: {focus}</p>
                </div>
                {React.createElement(icon, { className: "w-16 h-16 text-highlight opacity-20" })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="KPIs do Departamento" className="md:col-span-2">
                    <div className="h-40 flex items-center justify-center text-text-secondary italic">Aguardando dados consolidados...</div>
                </Card>
                <Card title="Status de Meta">
                    <div className="text-center py-6">
                        <p className="text-5xl font-black text-white italic">85%</p>
                        <p className="text-[10px] text-text-secondary uppercase mt-2">Atingido</p>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- LÓGICA DE ROTEAMENTO DE VISÃO ---
    return (
        <div className="h-full">
            {['MASTER', 'PRESIDENT', 'VICE_PRESIDENT'].includes(currentRole) && renderMasterView()}
            
            {['HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD', 'POSITION_COACH'].includes(currentRole) && renderCoachView()}
            
            {['PLAYER', 'STUDENT'].includes(currentRole) && renderPlayerView()}
            
            {currentRole === 'COMMERCIAL_DIRECTOR' && renderDirectorView('Diretoria Comercial', 'Captação e Contratos', BriefcaseIcon)}
            {currentRole === 'MARKETING_DIRECTOR' && renderDirectorView('Diretoria de Marketing', 'Marca e Comunidade', MegaphoneIcon)}
            {currentRole === 'SPORTS_DIRECTOR' && renderDirectorView('Diretoria de Esportes', 'Planejamento e Roster', WhistleIcon)}
            {currentRole === 'FINANCIAL_DIRECTOR' && renderDirectorView('Diretoria Financeira', 'Fluxo de Caixa', FinanceIcon)}

            {/* FALLBACK PARA CARGOS SEM DASHBOARD MAPEADA */}
            {!['MASTER', 'PRESIDENT', 'VICE_PRESIDENT', 'HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD', 'POSITION_COACH', 'PLAYER', 'STUDENT', 'COMMERCIAL_DIRECTOR', 'MARKETING_DIRECTOR', 'SPORTS_DIRECTOR', 'FINANCIAL_DIRECTOR'].includes(currentRole) && (
                <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <ShieldCheckIcon className="w-16 h-16 mb-4" />
                    <p className="font-black uppercase tracking-widest text-center">Dashboard Administrativo em Construção para esta Persona</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;