
import React, { useContext } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import Card from '../components/Card';
import { 
    UsersIcon, FinanceIcon, MegaphoneIcon, 
    WhistleIcon, TrophyIcon, BriefcaseIcon,
    SparklesIcon, TargetIcon, ShieldCheckIcon,
    ClockIcon
} from '../components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const context = useContext(UserContext) as UserContextType;
    const currentRole = context.currentRole;

    const renderMasterView = () => (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Macro Presidência */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-900/20 to-slate-900 border-green-500/20">
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Receita Mensal</p>
                    <p className="text-2xl font-black text-white mt-1 italic">R$ 42.500</p>
                    <div className="h-1 w-full bg-black/40 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[70%]"></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/20 to-slate-900 border-blue-500/20">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Atletas Ativos</p>
                    <p className="text-2xl font-black text-white mt-1 italic">156</p>
                    <div className="h-1 w-full bg-black/40 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[92%]"></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-orange-900/20 to-slate-900 border-orange-500/20">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Mídia & Fãs</p>
                    <p className="text-2xl font-black text-white mt-1 italic">12.4k</p>
                    <div className="h-1 w-full bg-black/40 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 w-[45%]"></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/20">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Metas Estratégicas</p>
                    <p className="text-2xl font-black text-white mt-1 italic">4/6</p>
                    <div className="h-1 w-full bg-black/40 mt-3 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[66%]"></div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* War Room - Centro de Delegação */}
                <Card title="War Room: Centro de Missões" className="lg:col-span-2 border-highlight/20 bg-black/20">
                    <div className="space-y-4">
                        {[
                            { dir: 'Comercial', msg: 'Renovação do Patrocínio Máster', priority: 'HIGH', status: 'EM ANDAMENTO' },
                            { dir: 'Marketing', msg: 'Venda antecipada Ingressos Playoffs', priority: 'MEDIUM', status: 'AGUARDANDO' },
                            { dir: 'Esportes', msg: 'Auditoria de Capacetes (Vencimento)', priority: 'HIGH', status: 'CRÍTICO' }
                        ].map((mission, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${mission.priority === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase italic">{mission.msg}</p>
                                        <p className="text-[9px] text-text-secondary uppercase">Responsável: Diretoria de {mission.dir}</p>
                                    </div>
                                </div>
                                <span className="text-[8px] font-black px-2 py-1 bg-black/40 rounded border border-white/10 text-text-secondary">{mission.status}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-highlight text-white font-black uppercase italic text-xs rounded-xl shadow-glow">+ Delegar Nova Missão</button>
                </Card>

                {/* Resumo Consolidado */}
                <Card title="Relatório da Presidência" className="lg:col-span-1">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-text-secondary">Mensalidades</span>
                            <span className="text-white font-bold">R$ 15.200</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-text-secondary">Patrocínios</span>
                            <span className="text-white font-bold">R$ 22.000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                            <span className="text-text-secondary">Loja/Produtos</span>
                            <span className="text-white font-bold">R$ 5.300</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card title="Patrocínios Ativos">
                    <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-white text-xs">Academia FitPro</span>
                            <span className="text-green-400 font-bold text-xs">R$ 2.500/mês</span>
                        </div>
                        <div className="flex justify-between p-2 bg-white/5 rounded">
                            <span className="text-white text-xs">Posto Combustível</span>
                            <span className="text-green-400 font-bold text-xs">Permuta 100%</span>
                        </div>
                    </div>
                    <button className="w-full mt-4 py-3 bg-green-600 text-white font-black uppercase text-[10px] rounded-xl">Novo Prospecto CRM</button>
                 </Card>
                 <Card title="Cobrança de Mensalidades">
                    <div className="text-center py-4">
                        <p className="text-4xl font-black text-red-500">12%</p>
                        <p className="text-[10px] text-text-secondary uppercase mt-2">Inadimplência Atual</p>
                        <button className="mt-4 text-xs text-highlight underline">Enviar Avisos WhatsApp</button>
                    </div>
                 </Card>
            </div>
        </div>
    );

    const renderMarketingView = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-orange-900/10 border border-orange-500/20 p-8 rounded-[3rem] flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Diretoria de Marketing</h2>
                    <p className="text-orange-400 text-sm font-bold uppercase mt-1">Foco: Marca e Engajamento de Fãs</p>
                </div>
                <MegaphoneIcon className="w-16 h-16 text-orange-500 opacity-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card title="Assistente de Conteúdo (IA)">
                    <p className="text-text-secondary text-sm mb-4">Gere legendas, roteiros e artes para as redes sociais em segundos.</p>
                    <button className="w-full py-4 bg-orange-600 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2">
                        <SparklesIcon className="w-5 h-5"/> Criar Hype Agora
                    </button>
                 </Card>
                 <Card title="Engajamento Semanal">
                    <div className="flex items-center justify-center h-24">
                        <span className="text-5xl font-black text-white">+24%</span>
                        <span className="text-green-400 ml-2">▲</span>
                    </div>
                    <p className="text-[10px] text-center text-text-secondary uppercase">Crescimento em relação à semana passada</p>
                 </Card>
            </div>
        </div>
    );

    const renderSportsView = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-blue-900/10 border border-blue-500/20 p-8 rounded-[3rem] flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Diretoria de Esportes</h2>
                    <p className="text-blue-400 text-sm font-bold uppercase mt-1">Foco: Performance e Roster</p>
                </div>
                <WhistleIcon className="w-16 h-16 text-blue-500 opacity-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Média OVR Elenco" className="text-center">
                    <p className="text-5xl font-black text-highlight italic">78.5</p>
                    <p className="text-[10px] text-text-secondary uppercase mt-2">Baseado em 55 atletas</p>
                </Card>
                <Card title="Injured Reserve (IR)" className="text-center">
                    <p className="text-5xl font-black text-red-500 italic">03</p>
                    <p className="text-[10px] text-text-secondary uppercase mt-2">Atletas em tratamento</p>
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
            {currentRole === 'MARKETING_DIRECTOR' && renderMarketingView()}
            {currentRole === 'SPORTS_DIRECTOR' && renderSportsView()}
            
            {/* Fallback para outros cargos utilizarem a visão de esportes (padrão do app anterior) */}
            {['HEAD_COACH', 'PLAYER', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD', 'POSITION_COACH'].includes(currentRole) && renderSportsView()}
        </div>
    );
};

export default Dashboard;