
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { 
  ShareIcon, BankIcon, UsersIcon, 
  AlertTriangleIcon, SparklesIcon, 
  CheckCircleIcon, ActivityIcon 
} from '../../components/icons/UiIcons';

interface ExecutiveDashboardProps {
    handleCopyInvite: () => void;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ handleCopyInvite }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header Estratégico */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">War Room</h2>
                    <p className="text-text-secondary font-bold text-xs uppercase tracking-[0.3em] mt-1">Status Global da Associação</p>
                </div>
                <button 
                    onClick={handleCopyInvite}
                    className="bg-highlight hover:bg-highlight-hover text-white px-8 py-4 rounded-[2rem] font-black uppercase italic text-xs shadow-glow transition-all active:scale-95 flex items-center gap-3 group"
                >
                    <ShareIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    Convidar Atletas (WhatsApp)
                </button>
            </div>

            {/* Quick KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Caixa Projetado', value: 'R$ 42.8k', sub: '+12% este mês', icon: BankIcon, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Efetivo Roster', value: '86 Atletas', sub: '6 Pendências BID', icon: UsersIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Status Federação', value: 'REGULAR', sub: 'Certidão Válida', icon: CheckCircleIcon, color: 'text-highlight', bg: 'bg-highlight/10' },
                    { label: 'Prontidão Campo', value: '92%', sub: '2 Lesões Ativas', icon: ActivityIcon, color: 'text-orange-400', bg: 'bg-orange-500/10' }
                ].map((kpi, i) => (
                    <div key={i} className="bg-secondary/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] hover:border-white/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon className="w-6 h-6" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-highlight animate-pulse"></div>
                        </div>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{kpi.label}</p>
                        <h3 className="text-2xl font-black text-white italic mt-1">{kpi.value}</h3>
                        <p className={`text-[10px] font-bold mt-2 ${kpi.color}`}>{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* Acesso aos Departamentos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <Card title="Departamentos Executivos" titleClassName="italic font-black uppercase text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button onClick={() => navigate('/finance')} className="bg-black/20 hover:bg-black/40 p-6 rounded-3xl border border-white/5 flex flex-col gap-4 transition-all group text-left">
                                <div className="flex justify-between items-center">
                                    <BankIcon className="w-8 h-8 text-green-400" />
                                    <span className="text-[9px] font-black text-green-400 uppercase border border-green-500/20 px-2 py-1 rounded">CFO Dashboard</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase italic">Controladoria & Tesouraria</h4>
                                    <p className="text-xs text-text-secondary mt-1">Gestão de inadimplência, mensalidades e folha do staff.</p>
                                </div>
                            </button>
                            <button onClick={() => navigate('/marketing')} className="bg-black/20 hover:bg-black/40 p-6 rounded-3xl border border-white/5 flex flex-col gap-4 transition-all group text-left">
                                <div className="flex justify-between items-center">
                                    <SparklesIcon className="w-8 h-8 text-purple-400" />
                                    <span className="text-[9px] font-black text-purple-400 uppercase border border-purple-500/20 px-2 py-1 rounded">CMO Dashboard</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-black uppercase italic">Mídia & Engajamento</h4>
                                    <p className="text-xs text-text-secondary mt-1">Social AI, Fan Portal e gestão da marca.</p>
                                </div>
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-[2.5rem] border border-white/10 shadow-2xl h-full">
                         <h3 className="text-white font-black italic uppercase text-sm mb-6 border-b border-white/5 pb-4">Audit Log (Live)</h3>
                         <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                             {[1,2,3,4,5].map(i => (
                                 <div key={i} className="flex gap-3 items-start opacity-70 hover:opacity-100 transition-opacity">
                                     <div className="w-1.5 h-1.5 rounded-full bg-highlight mt-1.5 shrink-0"></div>
                                     <p className="text-[10px] text-text-secondary leading-relaxed">
                                         <strong className="text-white">Coach Guto</strong> publicou novo script de treino para <strong className="text-highlight">Tackle 11v11</strong>.
                                         <span className="block opacity-40 font-mono mt-1">12:45 PM • Session ID #992</span>
                                     </p>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExecutiveDashboard;