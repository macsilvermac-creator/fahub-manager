import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Beaker, Briefcase, Users, 
  ShoppingBag, Landmark, ArrowRight, FileText, Globe
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

const CommercialDashboard: React.FC = () => {
  const navigate = useNavigate();

  const containers = [
    { id: 'crm', title: 'Pipeline de Negócios (CRM)', icon: Briefcase, value: 'R$ 85.000', detail: 'Prospecção a Fechado', path: '/comercial/propostas', color: 'border-blue-500/30' },
    { id: 'membership', title: 'Ecossistema de Sócios', icon: Users, value: '1.240', detail: 'Crescimento & Renovação', path: '/comercial/socios', color: 'border-emerald-500/30' },
    { id: 'store', title: 'Licensing Admin', icon: ShoppingBag, value: 'R$ 12.400', detail: 'Royalties & Vendas Loja', path: '/comercial/loja', color: 'border-orange-500/30' },
    { id: 'grants', title: 'Institutional Grants', icon: Landmark, value: '3 Projetos', detail: 'Leis de Incentivo & Editais', path: '/comercial/editais', color: 'border-purple-500/30' }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden italic">
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center shadow-blue-500/20">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Diretoria Comercial</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 uppercase text-[10px] font-black">
          <button 
            onClick={() => navigate('/comercial/sponsor-lab')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600/20 transition-all mb-4"
          >
            <Beaker size={18} /> Sponsor Lab
          </button>
          <SidebarItem icon={FileText} label="Mídia Kit Builder" />
          <SidebarItem icon={Globe} label="Market Feed" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Comercial <span className="text-blue-500">Master</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1">Execução Diária e Gestão de Ativos</p>
        </header>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar pb-10">
          {containers.map((c) => (
            <div key={c.id} onClick={() => navigate(c.path)} className={`relative bg-[#0a0f1e] border ${c.color} rounded-[2.5rem] p-10 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer group shadow-2xl`}>
              <div className="flex justify-between items-start">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-blue-500/50">
                  <c.icon size={32} className="text-blue-400" />
                </div>
                <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 transition-all text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{c.title}</p>
                <h2 className="text-4xl font-black tracking-tighter text-white">{c.value}</h2>
                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> {c.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <JulesAgent context="DASHBOARD" />
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all group">
    <Icon size={18} className="group-hover:text-blue-500 transition-colors" />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default CommercialDashboard;