import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Stethoscope, 
  DollarSign, 
  Settings, 
  X
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, closeMobile }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Activity, label: 'Performance', active: false },
    { icon: Stethoscope, label: 'Médico', active: false },
    { icon: DollarSign, label: 'Financeiro', active: false },
    { icon: Settings, label: 'Configurações', active: false },
  ];

  return (
    <>
      {/* Overlay Escuro para Mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeMobile}
        ></div>
      )}

      {/* Sidebar em si */}
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
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;