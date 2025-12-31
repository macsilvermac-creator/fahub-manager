import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// ADICIONADO: Interface para aceitar as props do DashboardLayout
interface SidebarProps {
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

// ADICIONADO: Recebendo as props (mesmo que opcionais)
const Sidebar = ({ isMobileOpen, closeMobile }: SidebarProps) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Atletas', path: '/athletes' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <>
      {/* Overlay para Mobile (Fundo escuro quando menu abre) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Principal */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50 transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              FAHUB
            </h1>
            <p className="text-xs text-slate-400 mt-1">Manager v1.0</p>
          </div>
          {/* Botão fechar no mobile */}
          <button onClick={closeMobile} className="md:hidden text-slate-400 hover:text-white">
            X
          </button>
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile} // Fecha menu ao clicar em item (mobile)
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Rodapé / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;