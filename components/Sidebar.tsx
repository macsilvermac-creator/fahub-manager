
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DashboardIcon, LockIcon, TargetIcon, UsersIcon
} from './icons/UiIcons';
import { UserRole } from '../types';
import { securityService } from '../services/securityService';
import { authService } from '../services/authService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ isOpen, currentRole }) => {
  const navLinkClasses = "flex items-center px-4 py-3.5 text-text-secondary rounded-2xl hover:bg-white/5 hover:text-white transition-all text-xs font-black uppercase tracking-widest mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-r-4 border-highlight font-black";

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1120] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      <div className="h-24 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-highlight rounded-2xl flex items-center justify-center shadow-glow transform -rotate-6">
                    <span className="text-white font-black text-xl italic">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block italic tracking-tighter uppercase leading-none">FAHUB PRO</span>
                    <span className="text-[8px] text-text-secondary uppercase tracking-[0.2em] font-bold opacity-50">
                        {securityService.getRoleLabel(currentRole)}
                    </span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-6 px-3">
        <nav className="space-y-1">
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>Base de Comando</span>
          </NavLink>

          <p className="px-4 text-[9px] font-black text-text-secondary/20 uppercase tracking-[0.3em] mt-8 mb-4">Gestão Administrativa</p>
          
          <NavLink to="/vault-hub" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <LockIcon className="w-4 h-4 mr-3 text-yellow-500" />
            <span>Vault Hub</span>
          </NavLink>
          
          <NavLink to="/register-lab" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <TargetIcon className="w-4 h-4 mr-3 text-green-400" />
            <span>Register Lab</span>
          </NavLink>

          <NavLink to="/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            {/* Fix: Changed UserIcon to UsersIcon */}
            <UsersIcon className="w-4 h-4 mr-3" />
            <span>Meu Perfil</span>
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
           <button onClick={() => authService.logout()} className="w-full py-3 bg-red-600/5 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase transition-all tracking-[0.2em]">
                Sair do Sistema
           </button>
      </div>
    </aside>
  );
});

export default Sidebar;