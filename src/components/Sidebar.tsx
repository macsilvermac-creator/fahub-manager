import React, { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, WhistleIcon, TrophyIcon, 
  TargetIcon, VideoIcon, UsersIcon, ShieldCheckIcon, FinanceIcon
} from './icons/UiIcons';
import { UserRole } from '../types';
import { storageService } from '../services/storageService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  const navLinkClasses = "flex items-center px-4 py-3 text-text-secondary rounded-xl hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black";

  const handlePersonaSwitch = (role: UserRole) => {
    setRole(role);
    storageService.logAuditAction('PERSONA_SWITCH', `Mudou para ${role}`);
    navigate('/dashboard');
  };

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
      
      <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <nav>
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>SALA DE GUERRA</span>
          </NavLink>

          <p className="px-4 text-[9px] font-black text-text-secondary/30 uppercase tracking-widest mt-6 mb-2">Comando de Campo</p>
          <NavLink to="/training-day" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <WhistleIcon className="w-4 h-4 mr-3 text-blue-400" />
            <span>TRAINING DAY</span>
          </NavLink>
          <NavLink to="/schedule" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <TrophyIcon className="w-4 h-4 mr-3 text-red-500" />
            <span>CALENDÁRIO</span>
          </NavLink>

          <p className="px-4 text-[9px] font-black text-text-secondary/30 uppercase tracking-widest mt-6 mb-2">Estratégia</p>
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

          <p className="px-4 text-[9px] font-black text-text-secondary/30 uppercase tracking-widest mt-6 mb-2">Gestão</p>
          <NavLink to="/finance" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
            <span>FINANCEIRO</span>
          </NavLink>
        </nav>
      </div>

      <div className="p-3 bg-black/50 border-t border-white/10 shrink-0">
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