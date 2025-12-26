import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  CalendarIcon, BrainIcon, WhistleIcon, BookIcon,
  DashboardIcon, FinanceIcon, UsersIcon, ShieldCheckIcon
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
  const user = authService.getCurrentUser();
  
  const navLinkClasses = "flex items-center px-4 py-3.5 text-text-secondary rounded-2xl hover:bg-white/5 hover:text-white transition-all text-xs font-black uppercase tracking-widest mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-r-4 border-highlight font-black shadow-[inset_-10px_0_20px_rgba(5,150,105,0.1)]";

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
            <span>Base</span>
          </NavLink>

          <p className="px-4 text-[9px] font-black text-text-secondary/20 uppercase tracking-[0.3em] mt-8 mb-4">Elite Hubs</p>
          
          <NavLink to="/agenda" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <CalendarIcon className="w-4 h-4 mr-3" />
            <span>Agenda</span>
          </NavLink>

          <NavLink to="/brain-lab" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <BrainIcon className="w-4 h-4 mr-3 text-cyan-400" />
            <span>Brain Lab</span>
          </NavLink>

          <NavLink to="/iron-lab" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <WhistleIcon className="w-4 h-4 mr-3 text-orange-500" />
            <span>Iron Lab</span>
          </NavLink>

          <NavLink to="/playbook-lab" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <BookIcon className="w-4 h-4 mr-3 text-purple-400" />
            <span>Playbook Lab</span>
          </NavLink>

          <p className="px-4 text-[9px] font-black text-text-secondary/20 uppercase tracking-[0.3em] mt-8 mb-4">Gestão</p>
          
          <NavLink to="/finance" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <FinanceIcon className="w-4 h-4 mr-3" />
            <span>Finanças</span>
          </NavLink>
          
          <NavLink to="/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-4 h-4 mr-3" />
            <span>Meu Perfil</span>
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
           <button onClick={() => authService.logout()} className="w-full py-3 bg-red-600/5 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase transition-all tracking-[0.2em]">
                Logout
           </button>
      </div>
    </aside>
  );
});

export default Sidebar;