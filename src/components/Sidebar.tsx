
import React, { memo, useTransition } from 'react';
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
import { storageService } from '../services/storageService';
import { ClipboardIcon, UsersIcon, ShieldCheckIcon, WalletIcon, SparklesIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [isPending, startTransition] = useTransition();
  
  // Como gestor da plataforma, você sempre tem acesso à Matrix
  const isPlatformOwner = user?.role === 'MASTER' || user?.role === 'PLATFORM_OWNER';

  const navLinkClasses = "flex items-center px-4 py-2 text-text-secondary rounded-lg hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-0.5 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black shadow-[0_0_15px_rgba(5,150,107,0.1)]";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  const handlePersonaSwitch = (role: UserRole) => {
    // startTransition resolve o erro #306 ao permitir que a UI espere o Suspense
    startTransition(() => {
        setRole(role);
        storageService.logAuditAction('PERSONA_SWITCH', `Simulando visão de ${role}`);
        navigate('/dashboard');
    });
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-4 mb-1 border-b border-white/5 pb-1">{children}</p>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-linear lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-white/5 shadow-2xl ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-highlight rounded-lg flex items-center justify-center shadow-lg transform -rotate-6">
                    <span className="text-white font-black text-sm tracking-tighter">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block leading-none tracking-tighter italic">FAHUB <span className="text-highlight">PRO</span></span>
                    <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">Laboratório de Teste</span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-2 px-3">
        <nav className="flex-1 space-y-0.5">
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>Dashboard</span>
          </NavLink>

          {/* Menus Contextuais de Teste baseados no papel simuluado */}
          {(currentRole === 'MASTER' || currentRole === 'FINANCIAL_MANAGER') && (
            <>
              <SectionLabel>Estratégico</SectionLabel>
              <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
                <span>Fluxo de Caixa</span>
              </NavLink>
            </>
          )}

          {(currentRole === 'MASTER' || currentRole === 'HEAD_COACH') && (
            <>
              <SectionLabel>Técnico</SectionLabel>
              <NavLink to="/practice" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <WhistleIcon className="w-4 h-4 mr-3 text-blue-400" />
                <span>Treinos</span>
              </NavLink>
            </>
          )}

          <SectionLabel>Operações</SectionLabel>
          <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-4 h-4 mr-3 text-blue-500" />
            <span>Elenco</span>
          </NavLink>
        </nav>
      </div>

      {/* GOD MODE PERSONA MATRIX */}
      {isPlatformOwner && (
          <div className="p-3 bg-black/50 border-t border-white/10 shrink-0">
              <p className="text-[8px] font-black text-highlight uppercase mb-2 text-center tracking-[0.2em] flex items-center justify-center gap-1">
                  <SparklesIcon className="w-2 h-2"/> Persona Matrix <SparklesIcon className="w-2 h-2"/>
              </p>
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
      )}

      <div className="p-3 bg-[#0B1120] border-t border-white/5 shrink-0">
        <button onClick={() => authService.logout()} className="w-full text-[10px] font-black text-red-400 hover:text-white flex items-center justify-center py-2 hover:bg-red-500/10 rounded-lg transition-all uppercase tracking-widest">Sair do Modo Teste</button>
      </div>
    </aside>
  );
});

export default Sidebar;