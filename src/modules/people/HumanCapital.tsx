import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, UserCheck, CreditCard, ShieldCheck, 
  ArrowRight, Landmark, Search, Plus, 
  Settings, Sparkles, Wallet
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

const HumanCapital: React.FC = () => {
  const navigate = useNavigate();

  const containers = [
    { id: 'roster', title: 'Gestão de Elenco', icon: Users, value: '48 Atletas', detail: 'Tackle & Flag Ativos', path: '/elenco', color: 'border-blue-500/30' },
    { id: 'staff', title: 'Corpo Técnico', icon: UserCheck, value: '12 Membros', detail: 'Staff & Diretoria', path: '/human-capital/staff', color: 'border-emerald-500/30' },
    { id: 'payroll', title: 'Folha de Pagamento', icon: Wallet, value: 'R$ 8.400,00', detail: 'Ajudas de Custo Jan/26', path: '/human-capital/payroll', color: 'border-red-500/30' },
    { id: 'governance', title: 'Governança Inst.', icon: ShieldCheck, value: 'Regular', detail: 'Federação / Confederação', path: '/human-capital/governanca', color: 'border-purple-500/30' }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR PADRÃO ATUALIZADA - PROTOCOLO NEXUS */}
      <aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-500">Capital Humano</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button onClick={() => navigate('/financeiro')} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 text-slate-400 font-black italic text-xs uppercase hover:bg-white/10 transition-all">
            <Landmark size={18} /> Financeiro Master
          </button>
          
          <div className="pt-6 pb-2 px-4 text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Ações Rápidas</div>
          <SidebarItem icon={Plus} label="Novo Cadastro" />
          <SidebarItem icon={CreditCard} label="Portal do Atleta" />
          <SidebarItem icon={Sparkles} label="Régua de Cobrança" />
          <SidebarItem icon={Settings} label="Config. Cargos" />
        </nav>

        <div className="p-6 border-t border-white/5">
           <button onClick={() => navigate('/')} className="flex items-center gap-4 text-slate-500 hover:text-white transition-all group">
              <span className="text-[10px] font-black uppercase tracking-widest italic group-hover:text-blue-500">← Nexus Portal</span>
           </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL (Viewport Height) */}
      <main className="flex-1 flex flex-col overflow-hidden p-8">
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">
              Capital <span className="text-blue-500">Humano</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-1 italic italic">Gestão de Performance & Pessoal</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-3">
                <Search size={16} className="text-slate-500" />
                <input placeholder="Buscar membro..." className="bg-transparent border-none outline-none text-[10px] font-bold italic w-40" />
             </div>
          </div>
        </header>

        {/* GRID DE 4 CONTAINERS SIMÉTRICOS COM SCROLL INTELIGENTE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
            {containers.map((c) => (
              <div 
                key={c.id}
                onClick={() => navigate(c.path)}
                className={`relative bg-[#0a0f1e] border ${c.color} rounded-[2.5rem] p-10 flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer group shadow-2xl min-h-[250px]`}
              >
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-blue-500/50 transition-colors">
                    <c.icon size={32} className="text-blue-400" />
                  </div>
                  <ArrowRight size={24} className="opacity-0 group-hover:opacity-100 transition-all text-blue-500" />
                </div>

                <div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 italic">{c.title}</p>
                  <h2 className="text-4xl font-black italic tracking-tighter text-white">{c.value}</h2>
                  <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic bg-white/5 w-fit px-4 py-1.5 rounded-full border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {c.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <JulesAgent context="PEOPLE" />
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-slate-500 hover:text-white transition-all group">
    <Icon size={18} className="group-hover:text-blue-500 transition-colors" />
    <span className="text-[10px] font-black uppercase tracking-widest italic">{label}</span>
  </button>
);

export default HumanCapital;