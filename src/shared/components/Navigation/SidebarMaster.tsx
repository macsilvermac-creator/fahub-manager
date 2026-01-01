import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  ChevronRight,
  Clock
} from 'lucide-react';

/**
 * Interface para os itens de navegação
 */
interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
}

const SidebarMaster: React.FC = () => {
  const mainNav: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Agenda Geral', icon: Calendar, path: '/agenda', badge: 'Hoje' },
    { label: 'Configurações', icon: Settings, path: '/settings' },
  ];

  // Simulação da "Agenda Rápida" que discutimos para o Sidebar
  const upcomingEvents = [
    { id: 1, title: 'Treino Tackle', time: '19:00', type: 'Field' },
    { id: 2, title: 'Reunião Diretoria', time: '21:00', type: 'Meeting' }
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0">
      {/* Branding / Logo Area */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="font-black italic text-lg">F</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none italic">FAHUB</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Pro Management</p>
          </div>
        </div>
      </div>

      {/* Busca Rápida (File Search Intuition) */}
      <div className="px-6 mb-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Busca rápida..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-[11px] font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="px-4 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Menu Principal</p>
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <button 
              key={item.label}
              className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Icon size={18} strokeWidth={2.5} />
                <span className="text-xs font-bold">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="text-[8px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">{item.badge}</span>
              ) : (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}

        {/* Seção de Agenda Rápida (Protocolo FAHUB) */}
        <div className="mt-8 pt-8 border-t border-slate-50 px-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Agenda de Hoje</p>
            <Bell size={12} className="text-slate-300" />
          </div>
          
          <div className="space-y-3">
            {upcomingEvents.map(event => (
              <div key={event.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 group cursor-pointer hover:border-blue-200 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={10} className="text-blue-500" />
                  <span className="text-[10px] font-black text-slate-800">{event.time}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-600 leading-tight">{event.title}</p>
                <p className="text-[9px] text-slate-400 font-medium uppercase mt-1 tracking-tighter">{event.type}</p>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-900 rounded-[2rem] p-4 flex items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white text-[10px] font-black shadow-inner">
              JG
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white truncate">Gladiators Dir.</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase truncate">ID: Master_01</p>
            </div>
          </div>
          <button className="text-slate-500 hover:text-red-400 transition-colors">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarMaster;