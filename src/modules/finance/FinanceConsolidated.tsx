// ... imports preservados
import { Sparkles, DollarSign, Landmark, Settings, FileSearch, Download, PieChart, ArrowRight, TrendingUp, AlertCircle, Wallet } from 'lucide-react';

// No componente FinanceConsolidated, atualize a Sidebar:
<aside className="w-64 bg-[#0a0f1e] border-r border-white/5 flex flex-col shrink-0">
  <div className="p-8">
    <div className="w-12 h-12 bg-emerald-600 rounded-2xl shadow-lg mb-4 flex items-center justify-center">
      <Landmark size={24} className="text-white" />
    </div>
    <h2 className="text-[10px] font-black uppercase tracking-widest italic text-slate-500">Módulo Financeiro</h2>
  </div>
  <nav className="flex-1 px-4 space-y-2">
    {/* NOVA FUNÇÃO CRUCIAL NA SIDEBAR */}
    <button 
      onClick={() => navigate('/financeiro/factory')} 
      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 font-black italic text-xs uppercase hover:bg-blue-600/20 transition-all shadow-[0_0_15px_rgba(37,99,235,0.1)] mb-4"
    >
      <Sparkles size={18} /> Billing Factory
    </button>
    
    <div className="pt-2 pb-2 px-4 text-[9px] font-black uppercase text-slate-600 tracking-widest italic">Consultivo</div>
    <SidebarItem icon={FileSearch} label="Auditoria" />
    <SidebarItem icon={PieChart} label="Relatórios" />
    <SidebarItem icon={Download} label="Exportar" />
    <SidebarItem icon={Settings} label="Configurações" />
  </nav>
  {/* ... restante da sidebar preservado */}
</aside>