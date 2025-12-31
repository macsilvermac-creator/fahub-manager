import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Stethoscope, 
  DollarSign, 
  Settings, 
  X,
  Users
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, closeMobile }) => {
  const location = useLocation(); // Sabe em qual página estamos

  const menuItems = [
    // AQUI ESTÁ A MUDANÇA: path agora é '/dashboard'
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }, 
    { icon: Users, label: 'Atletas', path: '/athletes' },
    { icon: Activity, label: 'Performance', path: '/performance' },
    { icon: Stethoscope, label: 'Médico', path: '/medical' },
    { icon: DollarSign, label: 'Financeiro', path: '/financial' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeMobile}
        ></div>
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-slate-950">
          <span className="text-xl font-bold tracking-wider">FAHUB</span>
          <button onClick={closeMobile} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item, index) => {
            // Verifica se a rota atual começa com o caminho do item (para manter ativo em subpáginas)
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;