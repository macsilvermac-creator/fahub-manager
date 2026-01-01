import { LayoutDashboard, Users, Settings, DollarSign, Calendar, LogOut } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';

interface SidebarProps {
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

const Sidebar = ({ isMobileOpen, closeMobile }: SidebarProps) => {
  const { role } = useUserRole();

  // Definição clara de quem vê o quê
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['gestor'] },
    { icon: Calendar, label: 'Agenda', path: '/agenda', roles: ['gestor', 'atleta'] },
    { icon: Users, label: 'Atletas', path: '/athletes', roles: ['gestor'] },
    { icon: DollarSign, label: 'Financeiro', path: '/finance', roles: ['gestor'] },
    { icon: Settings, label: 'Configurações', path: '/settings', roles: ['gestor'] },
  ];

  // Filtra os itens: Gestor vê tudo, Atleta vê apenas a Agenda
  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeMobile} />
      )}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-800">
          <Link to="/nexus" className="block group">
            <h1 className="text-2xl font-black text-blue-500 tracking-tighter">FAHUB</h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.3em]">Nexus Portal</p>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              onClick={closeMobile}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} /> 
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors font-bold text-sm">
            <LogOut size={20} />
            <span>SAIR</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;