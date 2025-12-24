
import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DashboardIcon, WhistleIcon, TrophyIcon, 
  TargetIcon, VideoIcon, UsersIcon
} from './icons/UiIcons';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navLinkClasses = "flex items-center px-4 py-3 text-text-secondary rounded-xl hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black";

  /* Fix: Added explicit React.FC typing to SectionLabel to correctly handle children */
  const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="px-4 text-[9px] font-black text-text-secondary/30 uppercase tracking-widest mt-6 mb-2">{children}</p>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1120] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 lg:relative lg:translate-x-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-highlight rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                  <span className="text-white font-black text-lg">FH</span>
              </div>
              <div>
                  <span className="text-sm font-black text-white block italic tracking-tighter uppercase">Coach <span className="text-highlight">Hub</span></span>
                  <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">War Room Access</span>
              </div>
          </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav>
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>SALA DE GUERRA</span>
          </NavLink>

          <SectionLabel>Comando de Campo</SectionLabel>
          <NavLink to="/training-day" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <WhistleIcon className="w-4 h-4 mr-3 text-blue-400" />
            <span>TRAINING DAY</span>
          </NavLink>
          <NavLink to="/sideline" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <TrophyIcon className="w-4 h-4 mr-3 text-red-500" />
            <span>GAME DAY</span>
          </NavLink>

          <SectionLabel>Estratégia</SectionLabel>
          <NavLink to="/roster" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-4 h-4 mr-3 text-indigo-400" />
            <span>ELENCO & ROSTER</span>
          </NavLink>
          <NavLink to="/intel" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <VideoIcon className="w-4 h-4 mr-3 text-purple-400" />
            <span>INTEL CENTER</span>
          </NavLink>
          <NavLink to="/recruitment" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <TargetIcon className="w-4 h-4 mr-3 text-yellow-500" />
            <span>TRYOUT HUB</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
});

export default Sidebar;
