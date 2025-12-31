// src/shared/components/layouts/Sidebar.tsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  HeartPulse,
  Wallet,
  Settings,
  ChevronLeft, // Usaremos para indicar que a sidebar pode ser recolhida
  ChevronRight, // Usaremos para indicar que a sidebar pode ser expandida
} from 'lucide-react';

interface SidebarProps {
  // Nenhuma prop por enquanto, a lógica de colapsar é interna
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Performance', icon: Target, href: '/performance' },
    { name: 'Medical', icon: HeartPulse, href: '/medical' },
    { name: 'Financial', icon: Wallet, href: '/financial' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside
      className={`
        flex flex-col h-full bg-gray-800 text-white
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        relative 
      `}
    >
      {/* Botão de colapsar */}
      <button
        onClick={toggleCollapse}
        className={`
          absolute top-4 right-4 p-2
          bg-gray-700 hover:bg-gray-600 rounded-full
          text-white
          transition-transform duration-300 ease-in-out
          ${isCollapsed ? 'rotate-180' : ''}
        `}
        aria-label={isCollapsed ? 'Expandir Sidebar' : 'Recolher Sidebar'}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Logo/Título da Aplicação */}
      <div className="flex items-center justify-center h-16 p-4">
        {isCollapsed ? (
          <span className="font-bold text-xl">FA</span>
        ) : (
          <span className="font-bold text-xl whitespace-nowrap">FAHUB Manager</span>
        )}
      </div>

      {/* Itens de Navegação */}
      <nav className="flex-1 mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mt-2">
              <a
                href={item.href} // Usado 'href' para simplicidade nesta fase, mas pode ser substituído por Link do react-router-dom
                className={`
                  flex items-center p-4 mx-4 rounded-lg
                  hover:bg-gray-700
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon size={20} />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé da Sidebar (opcional, pode ser usado para informações do usuário, etc.) */}
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        {!isCollapsed && (
          <p className="whitespace-nowrap">Conectado como: Usuário</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
