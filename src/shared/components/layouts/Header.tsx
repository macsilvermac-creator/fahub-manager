import React from 'react';
import { Bell, Menu, User, Search } from 'lucide-react';

interface HeaderProps {
  pageTitle: string;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, onToggleSidebar }) => {
  return (
    // HEADER NEXUS: Fundo transparente com blur, borda sutil e texto branco
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 border-b border-white/5 bg-[#050510]/80 backdrop-blur-xl transition-all duration-300">
      
      {/* Lado Esquerdo: Botão Menu (Mobile) e Título */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-slate-400 rounded-lg md:hidden hover:bg-white/5 hover:text-white transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex flex-col">
          <h1 className="text-xl font-black italic tracking-tighter text-white uppercase">
            {pageTitle}
          </h1>
          {/* Breadcrumb simulado ou subtítulo */}
          <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase hidden md:block">
            Console Administrativo v7.0
          </span>
        </div>
      </div>

      {/* Centro: Barra de Busca (Decorativa/Funcional) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Buscar comando ou atleta..." 
            className="w-full bg-[#0a0a16] border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Lado Direito: Notificações e Perfil */}
      <div className="flex items-center gap-4">
        
        {/* Notificações */}
        <button className="relative p-2 text-slate-400 rounded-full hover:bg-white/5 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse"></span>
        </button>
        
        {/* Perfil */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
          <div className="hidden text-right md:block">
            <p className="text-sm font-bold text-white">Admin User</p>
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500">Online</p>
          </div>
          
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/20 border border-white/10">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;