
import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, RosterIcon, WhistleIcon, FinanceIcon, 
  TrophyIcon, TargetIcon, VideoIcon, UsersIcon, ShieldCheckIcon, SparklesIcon
} from './icons/UiIcons';
import { UserRole } from '../types';
import { storageService } from '../services/storageService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  
  const navLinkClasses = "flex items-center px-4 py-2.5 text-text-secondary rounded-xl hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black shadow-[0_0_15px_rgba(5,150,107,0.1)]";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handlePersonaSwitch = (role: UserRole) => {
    setRole(role);
    storageService.logAuditAction('PERSONA_SWITCH', `Simulando visão de ${role}`);
    navigate('/dashboard');
  };

  /* Fix: Added explicit React.FC typing to SectionLabel to correctly handle children and intrinsic elements */
  const SectionLabel: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
    <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">{children}</p>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-linear lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-highlight rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                    <span className="text-white font-black text-lg tracking-tighter">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block leading-none tracking-tighter italic">FAHUB <span className="text-highlight">PRO</span></span>
                    <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">Gestão Esportiva</span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-4 px-3">
        <nav className="flex-1">
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>Overview</span>
          </NavLink>

          <SectionLabel>Operacional</SectionLabel>
          <NavLink to="/training-day" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <WhistleIcon className="w-4 h-4 mr-3 text-blue-400" />
            <span>Training Day</span>
          </NavLink>
          <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <TrophyIcon className="w-4 h-4 mr-3 text-red-500" />
            <span>Game Day</span>
          </NavLink>
          <NavLink to="/recruitment" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <TargetIcon className="w-4 h-4 mr-3 text-yellow-500" />
            <span>Tryout Hub</span>
          </NavLink>

          <SectionLabel>Inteligência</SectionLabel>
          <NavLink to="/intel" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <VideoIcon className="w-4 h-4 mr-3 text-purple-400" />
            <span>Intel Center</span>
          </NavLink>
          <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-4 h-4 mr-3 text-indigo-400" />
            <span>Roster & Depth</span>
          </NavLink>

          <SectionLabel>Administração</SectionLabel>
          <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
            <span>Financeiro</span>
          </NavLink>
        </nav>
      </div>

      <div className="p-3 bg-black/50 border-t border-white/10 shrink-0">
          <p className="text-[8px] font-black text-highlight uppercase mb-2 text-center tracking-[0.2em]">Persona Matrix</p>
          <div className="grid grid-cols-3 gap-1">
              <button onClick={() => handlePersonaSwitch('MASTER')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'MASTER' ? 'bg-highlight border-highlight text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <ShieldCheckIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black uppercase">Diretor</span>
              </button>
              <button onClick={() => handlePersonaSwitch('HEAD_COACH')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'HEAD_COACH' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <WhistleIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black uppercase">Coach</span>
              </button>
              <button onClick={() => handlePersonaSwitch('PLAYER')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'PLAYER' ? 'bg-orange-600 border-orange-600 text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <UsersIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black uppercase">Atleta</span>
              </button>
          </div>
      </div>
    </aside>
  );
});

export default Sidebar;