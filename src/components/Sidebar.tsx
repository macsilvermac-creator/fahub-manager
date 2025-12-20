
import React, { memo } from 'react';
// @ts-ignore
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, RosterIcon, ScheduleIcon, FinanceIcon, 
  AiPlaybookIcon, PracticeIcon, FlagIcon, TrophyIcon, 
  MegaphoneIcon, ShopIcon, BriefcaseIcon, AcademyIcon, VideoIcon,
  WhistleIcon, TargetIcon, SettingsNavIcon
} from './icons/NavIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { ClipboardIcon, UsersIcon, ShieldCheckIcon, WalletIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  
  const isMaster = currentRole === 'MASTER' || currentRole === 'PLATFORM_OWNER';
  const isCoach = currentRole === 'HEAD_COACH' || currentRole === 'OFFENSIVE_COORD' || currentRole === 'DEFENSIVE_COORD' || isMaster;
  const isPlayer = currentRole === 'PLAYER' || isMaster;
  const isRef = currentRole === 'REFEREE' || isMaster;
  const isFinance = currentRole === 'FINANCIAL_MANAGER' || isMaster;
  const isDirector = currentRole === 'SPORTS_DIRECTOR' || isMaster;

  const navLinkClasses = "flex items-center px-4 py-2 text-text-secondary rounded-lg hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-0.5 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black shadow-[0_0_15px_rgba(5,150,107,0.1)]";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handleLogout = () => {
      authService.logout();
      navigate('/login');
  };

  // Fix: Changed type from string to React.ReactNode
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-4 mb-1 border-b border-white/5 pb-1">{children}</p>
  );

  const handlePersonaSwitch = (role: UserRole, path: string) => {
    setRole(role);
    navigate(path);
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-linear lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-white/5 shadow-2xl overflow-hidden`}>
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-highlight rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
                    <span className="text-white font-black text-sm tracking-tighter">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block leading-none tracking-tighter italic">FAHUB <span className="text-highlight">PRO</span></span>
                    <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">God Mode Ready</span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-2 px-3">
        <nav className="flex-1 space-y-0.5">
          
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>Painel Principal</span>
          </NavLink>

          {isMaster && (
            <>
              <SectionLabel>Diretoria Executiva</SectionLabel>
              <NavLink to="/goals" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <TargetIcon className="w-4 h-4 mr-3 text-purple-400" />
                <span>Estratégia & Metas</span>
              </NavLink>
            </>
          )}

          {isCoach && (
            <>
              <SectionLabel>Técnico & Tática</SectionLabel>
              <NavLink to="/practice" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <WhistleIcon className="w-4 h-4 mr-3 text-green-500" />
                <span>Treinos (Scripts)</span>
              </NavLink>
              <NavLink to="/gemini-playbook" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <AiPlaybookIcon className="w-4 h-4 mr-3 text-purple-500" />
                <span>Playbook IA</span>
              </NavLink>
              <NavLink to="/tactical-lab" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <SettingsNavIcon className="w-4 h-4 mr-3 text-orange-400" />
                <span>Prancheta</span>
              </NavLink>
            </>
          )}

          {isFinance && (
            <>
              <SectionLabel>Finanças</SectionLabel>
              <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
                <span>Fluxo de Caixa</span>
              </NavLink>
              <NavLink to="/marketplace" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ShopIcon className="w-4 h-4 mr-3 text-yellow-400" />
                <span>Marketplace Admin</span>
              </NavLink>
            </>
          )}

          {isDirector && (
            <>
              <SectionLabel>Operações</SectionLabel>
              <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <RosterIcon className="w-4 h-4 mr-3 text-blue-500" />
                <span>Gestão Elenco</span>
              </NavLink>
              <NavLink to="/staff" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-4 h-4 mr-3 text-indigo-400" />
                <span>Staff & RH</span>
              </NavLink>
              <NavLink to="/inventory" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ClipboardIcon className="w-4 h-4 mr-3 text-orange-500" />
                <span>Almoxarifado</span>
              </NavLink>
            </>
          )}

          {isRef && (
            <>
              <SectionLabel>Arbitragem</SectionLabel>
              <NavLink to="/officiating" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FlagIcon className="w-4 h-4 mr-3 text-yellow-500" />
                <span>Súmula Digital</span>
              </NavLink>
            </>
          )}

          {isPlayer && (
            <>
              <SectionLabel>Atleta</SectionLabel>
              <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-4 h-4 mr-3 text-blue-300" />
                <span>Meus Stats</span>
              </NavLink>
              <NavLink to="/academy" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <AcademyIcon className="w-4 h-4 mr-3 text-orange-400" />
                <span>Treino Físico</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-3 bg-black/50 border-t border-white/10 shrink-0">
          <p className="text-[8px] font-black text-highlight uppercase mb-2 text-center tracking-[0.2em]">Matrix de Visão (God Mode)</p>
          <div className="grid grid-cols-3 gap-1.5">
              <button onClick={() => handlePersonaSwitch('MASTER', '/dashboard')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'MASTER' ? 'bg-highlight border-highlight text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <ShieldCheckIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black">CEO</span>
              </button>
              <button onClick={() => handlePersonaSwitch('HEAD_COACH', '/dashboard')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'HEAD_COACH' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <WhistleIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black">COACH</span>
              </button>
              <button onClick={() => handlePersonaSwitch('PLAYER', '/dashboard')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'PLAYER' ? 'bg-orange-600 border-orange-600 text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <UsersIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black">ATLETA</span>
              </button>
              <button onClick={() => handlePersonaSwitch('REFEREE', '/officiating')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'REFEREE' ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <FlagIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black">JUIZ</span>
              </button>
              <button onClick={() => handlePersonaSwitch('FINANCIAL_MANAGER', '/finance')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'FINANCIAL_MANAGER' ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <WalletIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black">CFO</span>
              </button>
              <button onClick={() => handlePersonaSwitch('SPORTS_DIRECTOR', '/roster')} className={`flex flex-col items-center py-2 rounded-lg border transition-all ${currentRole === 'SPORTS_DIRECTOR' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-white/5 bg-white/5 text-text-secondary hover:bg-white/10'}`}>
                <BriefcaseIcon className="w-3 h-3 mb-1" /><span className="text-[7px] font-black">DIR</span>
              </button>
          </div>
      </div>

      <div className="p-3 bg-[#0B1120] border-t border-white/5 shrink-0 flex gap-2">
        <button onClick={() => navigate('/settings')} className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-all"><SettingsNavIcon className="w-4 h-4" /></button>
        <button onClick={handleLogout} className="flex-1 text-[10px] font-black text-red-400 hover:text-white flex items-center justify-center py-2 hover:bg-red-500/10 border border-transparent rounded-lg transition-all uppercase tracking-widest">Sair</button>
      </div>
    </aside>
  );
});

export default Sidebar;
