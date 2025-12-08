
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, RosterIcon, ScheduleIcon, FinanceIcon, 
  AiPlaybookIcon, PracticeIcon, VideoIcon, ChatIcon, FolderIcon, WhistleIcon, AcademyIcon, TrophyIcon,
  ShopIcon, TicketIcon, KanbanIcon, MegaphoneIcon, BriefcaseIcon, SettingsNavIcon, SchoolIcon, FlagIcon, GlobeIcon, BookIcon, HeartPulseIcon
} from './icons/NavIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { ClipboardIcon, UsersIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();

  const navLinkClasses = "flex items-center px-4 py-2.5 text-text-secondary rounded-lg hover:bg-accent hover:text-text-primary transition-colors duration-200";
  const activeNavLinkClasses = "bg-highlight text-white";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) { 
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
      authService.logout();
      navigate('/login');
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-white/5`}>
      <div className="h-24 flex items-center px-6 bg-secondary border-b border-white/5 justify-start">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-highlight rounded-xl transform -skew-x-6 flex items-center justify-center shadow-[0_0_15px_rgba(0,168,107,0.4)]">
                    <span className="text-white font-black text-2xl transform skew-x-6 tracking-tighter">FH</span>
                </div>
                <div className="flex flex-col justify-center">
                    <span className="text-2xl font-black text-white tracking-tighter leading-none">FAHUB</span>
                    <span className="text-[10px] font-bold text-warning tracking-[0.3em] uppercase leading-none mt-1">MANAGER</span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon />
            <span className="ml-3 font-medium">Painel Principal</span>
          </NavLink>
          
          <p className="px-3 text-xs font-semibold text-text-secondary/50 uppercase tracking-wider mb-2 mt-6">Campo & Esportivo</p>
          <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <RosterIcon />
            <span className="ml-3 font-medium">Elenco</span>
          </NavLink>
          <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <ScheduleIcon />
            <span className="ml-3 font-medium">Calendário</span>
          </NavLink>
          <NavLink to="/practice" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <PracticeIcon />
            <span className="ml-3 font-medium">Treinos</span>
          </NavLink>
          <NavLink to="/gemini-playbook" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <AiPlaybookIcon />
            <span className="ml-3 font-medium">Playbook IA</span>
          </NavLink>

          <p className="px-3 text-xs font-semibold text-text-secondary/50 uppercase tracking-wider mb-2 mt-6">Gestão</p>
          <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <FinanceIcon />
            <span className="ml-3 font-medium">Financeiro</span>
          </NavLink>
          <NavLink to="/staff" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon />
            <span className="ml-3 font-medium">Staff</span>
          </NavLink>
        </nav>
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5">
        <button 
            onClick={handleLogout}
            className="w-full text-xs text-text-secondary hover:text-white flex items-center justify-center gap-2 py-2 hover:bg-white/5 rounded transition-colors"
        >
            Sair (Logout)
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
