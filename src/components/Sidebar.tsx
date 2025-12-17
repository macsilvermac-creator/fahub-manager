
import React, { memo } from 'react';
// @ts-ignore
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, RosterIcon, ScheduleIcon, FinanceIcon, 
  AiPlaybookIcon, PracticeIcon, FlagIcon, TrophyIcon, 
  MegaphoneIcon, ShopIcon, BriefcaseIcon, AcademyIcon, VideoIcon,
  WhistleIcon, TicketIcon, GlobeIcon, KanbanIcon, TargetIcon, SettingsNavIcon, BookIcon, FolderIcon, SchoolIcon
} from './icons/NavIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { ClipboardIcon, UsersIcon, ShieldCheckIcon, BusIcon, LockIcon, WalletIcon, DumbbellIcon, ActivityIcon, UserPlusIcon, HeartIcon, MicIcon, BuildingIcon, MapIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  // Atalhos de Permissão para Visibilidade de Menu
  const isMaster = currentRole === 'MASTER';
  const isCoach = currentRole === 'HEAD_COACH' || isMaster;
  const isPlayer = currentRole === 'PLAYER' || isMaster;
  const isRef = currentRole === 'REFEREE' || isMaster;
  const isStaff = currentRole === 'SPORTS_DIRECTOR' || isMaster;

  const navLinkClasses = "flex items-center px-4 py-2 text-text-secondary rounded-lg hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-0.5 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black shadow-[0_0_15px_rgba(0,168,107,0.1)]";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handleLogout = () => {
      authService.logout();
      navigate('/login');
  };

  const SectionLabel = ({ children }: { children: string }) => (
    <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-4 mb-1 border-b border-white/5 pb-1">{children}</p>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-linear lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-white/5 shadow-2xl overflow-hidden`}>
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-highlight rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
                    <span className="text-white font-black text-sm tracking-tighter">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block leading-none tracking-tighter italic">FAHUB <span className="text-highlight">PRO</span></span>
                    <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">V6.5 EXPERIENCE</span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-2 px-3">
        <nav className="flex-1 space-y-0.5">
          
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>Dashboard {currentRole === 'MASTER' ? '(CEO)' : `(${currentRole})`}</span>
          </NavLink>

          {/* SESSÃO: ESTRATÉGIA (MASTER ONLY) */}
          {isMaster && (
            <>
              <SectionLabel>Estratégia & Metas</SectionLabel>
              <NavLink to="/goals" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <TargetIcon className="w-4 h-4 mr-3 text-purple-400" />
                <span>OKRs Estratégicos</span>
              </NavLink>
              <NavLink to="/tasks" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <KanbanIcon className="w-4 h-4 mr-3 text-blue-400" />
                <span>Fluxo Kanban</span>
              </NavLink>
            </>
          )}

          {/* SESSÃO: CAMPO & TÁTICA (COACH & MASTER) */}
          {isCoach && (
            <>
              <SectionLabel>Departamento Técnico</SectionLabel>
              <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <RosterIcon className="w-4 h-4 mr-3 text-blue-500" />
                <span>Gestão de Roster</span>
              </NavLink>
              <NavLink to="/practice" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <PracticeIcon className="w-4 h-4 mr-3 text-green-500" />
                <span>Scripts de Treino</span>
              </NavLink>
              <NavLink to="/tactical-lab" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <WhistleIcon className="w-4 h-4 mr-3 text-orange-500" />
                <span>Tactical Lab</span>
              </NavLink>
              <NavLink to="/gemini-playbook" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <AiPlaybookIcon className="w-4 h-4 mr-3 text-purple-500" />
                <span>Playbook IA</span>
              </NavLink>
              <NavLink to="/video" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <VideoIcon className="w-4 h-4 mr-3 text-cyan-500" />
                <span>Vision (Vídeo/Scout)</span>
              </NavLink>
            </>
          )}

          {/* SESSÃO: ARBITRAGEM (REF & MASTER) */}
          {isRef && (
            <>
              <SectionLabel>Oficiais & Súmula</SectionLabel>
              <NavLink to="/officiating" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FlagIcon className="w-4 h-4 mr-3 text-yellow-500" />
                <span>Súmula Digital (Live)</span>
              </NavLink>
            </>
          )}

          {/* SESSÃO: OPERAÇÕES (STAFF & MASTER) */}
          {isStaff && (
            <>
              <SectionLabel>Operações & Receita</SectionLabel>
              <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
                <span>Financeiro (CFO)</span>
              </NavLink>
              <NavLink to="/event-desk" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <TicketIcon className="w-4 h-4 mr-3 text-orange-400" />
                <span>Event Desk (PDV)</span>
              </NavLink>
              <NavLink to="/inventory" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ClipboardIcon className="w-4 h-4 mr-3 text-yellow-400" />
                <span>Almoxarifado</span>
              </NavLink>
            </>
          )}

          {/* SESSÃO: ATLETA (PLAYER & MASTER) */}
          {isPlayer && (
            <>
              <SectionLabel>Área do Atleta</SectionLabel>
              <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-4 h-4 mr-3" />
                <span>Meu Perfil (Panini)</span>
              </NavLink>
              <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ScheduleIcon className="w-4 h-4 mr-3" />
                <span>Agenda de Jogos</span>
              </NavLink>
              <NavLink to="/academy" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <AcademyIcon className="w-4 h-4 mr-3" />
                <span>Iron Lab (Treinos)</span>
              </NavLink>
              <NavLink to="/locker-room" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <HeartIcon className="w-4 h-4 mr-3 text-pink-500" />
                <span>Vestiário Social</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* FOOTER: ROLE SELECTOR MATRIX */}
      <div className="p-3 bg-black/40 border-t border-white/5 shrink-0">
          <p className="text-[9px] font-black text-highlight uppercase mb-2 text-center tracking-widest">Feedback de Visão (Roles)</p>
          <div className="grid grid-cols-4 gap-1">
              <button 
                onClick={() => { setRole('MASTER'); navigate('/dashboard'); }} 
                title="Visão Dono do Time"
                className={`flex flex-col items-center justify-center py-2 rounded border transition-all ${currentRole === 'MASTER' ? 'bg-highlight border-highlight text-white' : 'border-white/10 text-text-secondary hover:text-white hover:bg-white/5'}`}
              >
                <ShieldCheckIcon className="w-3 h-3 mb-1" />
                <span className="text-[7px] font-black uppercase">CEO</span>
              </button>

              <button 
                onClick={() => { setRole('HEAD_COACH'); navigate('/dashboard'); }} 
                title="Visão Treinador"
                className={`flex flex-col items-center justify-center py-2 rounded border transition-all ${currentRole === 'HEAD_COACH' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-text-secondary hover:text-white hover:bg-white/5'}`}
              >
                <WhistleIcon className="w-3 h-3 mb-1" />
                <span className="text-[7px] font-black uppercase">Coach</span>
              </button>

              <button 
                onClick={() => { setRole('PLAYER'); navigate('/dashboard'); }} 
                title="Visão Atleta"
                className={`flex flex-col items-center justify-center py-2 rounded border transition-all ${currentRole === 'PLAYER' ? 'bg-orange-600 border-orange-600 text-white' : 'border-white/10 text-text-secondary hover:text-white hover:bg-white/5'}`}
              >
                <UsersIcon className="w-3 h-3 mb-1" />
                <span className="text-[7px] font-black uppercase">Atleta</span>
              </button>

              <button 
                onClick={() => { setRole('REFEREE'); navigate('/officiating'); }} 
                title="Visão Árbitro"
                className={`flex flex-col items-center justify-center py-2 rounded border transition-all ${currentRole === 'REFEREE' ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-white/10 text-text-secondary hover:text-white hover:bg-white/5'}`}
              >
                <FlagIcon className="w-3 h-3 mb-1" />
                <span className="text-[7px] font-black uppercase">Juiz</span>
              </button>
          </div>
      </div>

      <div className="p-3 bg-[#0B1120] border-t border-white/5 shrink-0 flex gap-2">
        <button onClick={() => navigate('/settings')} className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-all">
            <SettingsNavIcon className="w-4 h-4" />
        </button>
        <button onClick={handleLogout} className="flex-1 text-[10px] font-black text-red-400 hover:text-white flex items-center justify-center gap-2 py-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all uppercase tracking-widest">Sair</button>
      </div>
    </aside>
  );
});

export default Sidebar;
