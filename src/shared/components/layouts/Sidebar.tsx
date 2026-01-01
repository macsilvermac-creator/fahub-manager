import { LayoutDashboard, Users, Settings, LogOut, DollarSign, Calendar } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useUserRole } from '../../hooks/useUserRole';

interface SidebarProps {
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

const Sidebar = ({ isMobileOpen, closeMobile }: SidebarProps) => {
  const { role } = useUserRole();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['gestor'] },
    { icon: Calendar, label: 'Agenda', path: '/agenda', roles: ['gestor'] }, // Removido 'atleta' daqui
    { icon: Users, label: 'Atletas', path: '/athletes', roles: ['gestor'] },
    { icon: DollarSign, label: 'Financeiro', path: '/finance', roles: ['gestor'] },
    { icon: Settings, label: 'Configurações', path: '/settings', roles: ['gestor'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {isMobileOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={closeMobile} />}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50 transition-transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-800">
          <Link to="/nexus" className="block"><h1 className="text-2xl font-bold text-blue-500">FAHUB</h1></Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={closeMobile}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-blue-600' : 'text-slate-400 hover:bg-slate-800'}`}>
              <item.icon size={20} /> <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
export default Sidebar;