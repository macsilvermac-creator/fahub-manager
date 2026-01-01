import { LayoutDashboard, Users, Settings, LogOut, DollarSign, Calendar } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

const Sidebar = () => {
  // Simulação de Perfil: Altere para 'atleta' para testar a restrição
  const userRole = 'gestor'; 

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['gestor'] },
    { icon: Calendar, label: 'Agenda', path: '/agenda', roles: ['gestor', 'atleta'] },
    { icon: Users, label: 'Atletas', path: '/athletes', roles: ['gestor'] },
    { icon: DollarSign, label: 'Financeiro', path: '/finance', roles: ['gestor'] },
    { icon: Settings, label: 'Configurações', path: '/settings', roles: ['gestor'] },
  ];

  // Filtra os itens baseado no papel do usuário
  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col z-50">
      <div className="p-6 border-b border-slate-800">
        <Link to="/nexus" className="block group">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            FAHUB
          </h1>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Manager v1.0</p>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-slate-800 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;