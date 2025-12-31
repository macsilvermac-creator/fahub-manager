import React from 'react';
import { Bell, Menu, User } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10">
      {/* Lado Esquerdo: Botão Menu (Mobile) e Título */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">{pageTitle}</h1>
      </div>

      {/* Lado Direito: Notificações e Perfil */}
      <div className="flex items-center gap-4">
        <button className="p-2 relative hover:bg-gray-100 rounded-full text-gray-600">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">Gerente</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <User size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;