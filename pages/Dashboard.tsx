
import React, { useContext, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import Card from '../components/Card';
import { 
    UsersIcon, FinanceIcon, MegaphoneIcon, 
    WhistleIcon, TrophyIcon, BriefcaseIcon,
    SparklesIcon, TargetIcon, ShieldCheckIcon,
    ClockIcon, BrainIcon, ActivityIcon
} from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const context = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const currentRole = context.currentRole;
    const user = storageService.getCurrentUser();
    const program = user?.program || 'TACKLE';

    // --- VISÃO COMISSÃO TÉCNICA (COACH WAR ROOM) ---
    const renderCoachWarRoom = () => (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 p-8 rounded-[3rem] border border-blue-500/20 shadow-2xl flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <WhistleIcon className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Coach Command Center</h2>
                    <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mt-1">Status: {program} Operation Active</p>
                </div>
                <div className="bg-black/40 px-6 py-3 rounded-2xl border border-white/10 hidden md:block">
                    <p className="text-[10px] text-text-secondary uppercase font-black">Próximo Compromisso</p>
                    <p className="text-white font-bold">Treino Tático - 19:30</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Botão de Impacto: Treino */}
                <button 
                    onClick={() => navigate('/training-day')}
                    className="group relative bg-secondary/60 hover:bg-secondary border border-white/5 hover:border-highlight transition-all p-8 rounded-[2.5rem] text-left overflow-hidden shadow-xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                        <ActivityIcon className="w-20 h-20 text-highlight" />
                    </div>
                    <div className="p-3 bg-highlight/10 rounded-2xl w-fit mb-6">
                        <WhistleIcon className="w-8 h-8 text-highlight" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic">Dia de Treino</h3>
                    <p className="text-text-secondary text-xs mt-2 font-medium">Scripts, Drills e Frequência.</p>
                </button>

                {/* Botão de Impacto: Jogo */}
                <button 
                    onClick={() => navigate('/schedule')}
                    className="group relative bg-secondary/60 hover:bg-secondary border border-white/5 hover:border-red-500 transition-all p-8 rounded-[2.5rem] text-left overflow-hidden shadow-xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform">
                        <TrophyIcon className="w-20 h-20 text-red-500" />
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-2xl w-fit mb-6">
                        <TargetIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic">Game Day</h3>
                    <p className="text-text-secondary text-xs mt-2 font-medium">Escalação, Call Sheet e Scout.</p>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card title="Tactical Intel" className="md:col-span-2">
                    <div className="flex items-center gap-6 p-4 bg-black/20 rounded-2xl border border-white/5">
                        <div className="p-4 bg-cyan-600/20 rounded-2xl text-cyan-400">
                            <BrainIcon className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold uppercase italic text-sm">Biblioteca de Playbook</h4>
                            <p className="text-[10px] text-text-secondary mt-1">12 jogadas instaladas para esta semana. Revise o plano de instalação.</p>
                        </div>
                        <button onClick={() => navigate('/tactical-lab')} className="px-5 py-2 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase shadow-glow">Abrir Lab</button>
                    </div>
                 </Card>
                 
                 <Card title="OVR Equipe">
                    <div className="text-center py-4">
                        <p className="text-5xl font-black text-highlight italic">74.2</p>
                        <p className="text-[10px] text-text-secondary uppercase mt-2 font-bold tracking-widest">Média de Performance</p>
                    </div>
                 </Card>
            </div>
        </div>
    );

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

                <Card title="Relatório da Presidência" className="lg:col-span-1">
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

    const renderCommercialView = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-green-900/10 border border-green-500/20 p-8 rounded-[3rem] flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Diretoria Comercial</h2>
                    <p className="text-green-400 text-sm font-bold uppercase mt-1">Foco: Monetização e Contratos</p>
                </div>
                <BriefcaseIcon className="w-16 h-16 text-green-500 opacity-20" />
            </div>
            <Card title="Prospectos Atuais">
                <div className="p-10 text-center text-text-secondary italic">Nenhum contrato em negociação no momento.</div>
            </Card>
        </div>
    );

    const renderSportsView = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-blue-900/10 border border-blue-500/20 p-8 rounded-[3rem] flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Diretoria de Esportes</h2>
                    <p className="text-blue-400 text-sm font-bold uppercase mt-1">Foco: Performance e Roster Global</p>
                </div>
                <WhistleIcon className="w-16 h-16 text-blue-500 opacity-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Média OVR Elenco" className="text-center">
                    <p className="text-5xl font-black text-highlight italic">78.5</p>
                    <p className="text-[10px] text-text-secondary uppercase mt-2">Baseado em 55 atletas</p>
                </Card>
                <Card title="Tryouts / Candidatos" className="text-center">
                    <p className="text-5xl font-black text-blue-400 italic">15</p>
                    <p className="text-[10px] text-text-secondary uppercase mt-2">Novas solicitações</p>
                </Card>
            </div>
        </div>
    );

    return (
        <div className="h-full">
            {currentRole === 'MASTER' && renderMasterView()}
            {currentRole === 'COMMERCIAL_DIRECTOR' && renderCommercialView()}
            {currentRole === 'MARKETING_DIRECTOR' && renderSportsView()} {/* Fallback Marketing */}
            {currentRole === 'SPORTS_DIRECTOR' && renderSportsView()}
            
            {/* CARGOS TÉCNICOS (COMISSÃO) - VISÃO OPERACIONAL EXCLUSIVA */}
            {['HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD', 'POSITION_COACH'].includes(currentRole) && renderCoachWarRoom()}
            
            {/* ATLETA */}
            {currentRole === 'PLAYER' && <div className="p-12 text-center text-text-secondary uppercase font-black italic">Portal do Atleta em Construção</div>}
        </div>
    );
};

export default Dashboard;