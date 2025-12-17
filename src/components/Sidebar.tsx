
import React, { memo } from 'react';
// @ts-ignore
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, RosterIcon, ScheduleIcon, FinanceIcon, 
  AiPlaybookIcon, PracticeIcon, FlagIcon, TrophyIcon, 
  MegaphoneIcon, ShopIcon, BriefcaseIcon, AcademyIcon, VideoIcon,
  WhistleIcon, TicketIcon, GlobeIcon
} from './icons/NavIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { ClipboardIcon, UsersIcon, ShieldCheckIcon, BusIcon, LockIcon, WalletIcon, DumbbellIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  // GOD MODE CHECK: O Switcher deve aparecer se o usuário logado for MASTER
  const isGodUser = user?.role === 'MASTER';

  const navLinkClasses = "flex items-center px-4 py-2.5 text-text-secondary rounded-lg hover:bg-white/5 hover:text-white transition-all text-sm font-medium mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-bold shadow-[0_0_15px_rgba(0,168,107,0.1)]";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handleLogout = () => {
      authService.logout();
      navigate('/login');
  };

  const isAthlete = currentRole === 'PLAYER';
  const isCoach = ['HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD'].includes(currentRole);

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-linear lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0B1120]">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10 ${isAthlete ? 'bg-blue-600' : 'bg-highlight'}`}>
                    <span className="text-white font-black text-lg tracking-tighter">{isAthlete ? 'PL' : 'CO'}</span>
                </div>
                <div>
                    <span className="text-lg font-bold text-white block leading-none tracking-tighter">FAHUB</span>
                    <span className="text-[8px] text-text-secondary uppercase tracking-widest font-black">{currentRole}</span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-4 px-3">
        <nav className="flex-1 space-y-1">
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-5 h-5 mr-3 group-hover:text-highlight transition-colors" />
            <span>Dashboard</span>
          </NavLink>

          <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2">Módulos Ativos</p>
          
          <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-5 h-5 mr-3 group-hover:text-blue-400" />
            <span>Meu Perfil</span>
          </NavLink>

          <NavLink to="/academy" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <AcademyIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400" />
            <span>Iron Lab (Treino)</span>
          </NavLink>

          <NavLink to="/locker-room" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-5 h-5 mr-3 group-hover:text-pink-400" />
            <span>Vestiário</span>
          </NavLink>

          <NavLink to="/marketplace" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <ShopIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400" />
            <span>Marketplace</span>
          </NavLink>
        </nav>
      </div>

      {/* GOD MODE: Persiste para troca de contexto rápido */}
      {isGodUser && (
        <div className="p-3 bg-black/40 border-t border-white/5 animate-pulse-slow">
            <p className="text-[9px] font-black text-highlight uppercase mb-2 text-center tracking-widest">Modo God (Role Switcher)</p>
            <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setRole('MASTER'); navigate('/dashboard'); }} 
                  className={`text-[9px] py-1.5 rounded font-bold border transition-all ${currentRole === 'MASTER' ? 'bg-highlight border-highlight text-white' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                  MASTER
                </button>
                <button 
                  onClick={() => { setRole('PLAYER'); navigate('/dashboard'); }} 
                  className={`text-[9px] py-1.5 rounded font-bold border transition-all ${currentRole === 'PLAYER' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                  ATLETA
                </button>
            </div>
        </div>
      )}

      <div className="p-3 bg-[#0B1120] border-t border-white/5">
        <button onClick={handleLogout} className="w-full text-xs font-bold text-red-400 hover:text-white flex items-center justify-center gap-2 py-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all">Sair</button>
      </div>
    </aside>
  );
});

export default Sidebar;