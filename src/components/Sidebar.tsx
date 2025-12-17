
import React, { memo } from 'react';
// @ts-ignore
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, RosterIcon, ScheduleIcon, FinanceIcon, 
  AiPlaybookIcon, PracticeIcon, FlagIcon, TrophyIcon, 
  MegaphoneIcon, ShopIcon, BriefcaseIcon, AcademyIcon, VideoIcon,
  WhistleIcon, TicketIcon, GlobeIcon, KanbanIcon, TargetIcon, SettingsNavIcon, BookIcon,
  // Add missing icon FolderIcon
  FolderIcon
} from './icons/NavIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
// Add missing icons BuildingIcon, MapIcon, MicIcon
import { ClipboardIcon, UsersIcon, ShieldCheckIcon, BusIcon, LockIcon, WalletIcon, DumbbellIcon, ActivityIcon, UserPlusIcon, HeartIcon, BuildingIcon, MapIcon, MicIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isMaster = currentRole === 'MASTER';
  const isGodUser = user?.role === 'MASTER';

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
                    <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">Manager v3.5</span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-2 px-3">
        <nav className="flex-1 space-y-0.5">
          
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>Painel Principal</span>
          </NavLink>

          <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon className="w-4 h-4 mr-3" />
            <span>Meu Perfil</span>
          </NavLink>

          {/* VISÃO GOD / MASTER COMPLETA */}
          {isMaster && (
            <>
              <SectionLabel>Core & Planejamento</SectionLabel>
              <NavLink to="/goals" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <TargetIcon className="w-4 h-4 mr-3 text-purple-400" />
                <span>Estratégia (OKRs)</span>
              </NavLink>
              <NavLink to="/tasks" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <KanbanIcon className="w-4 h-4 mr-3 text-blue-400" />
                <span>WorkFlow (Kanban)</span>
              </NavLink>
              <NavLink to="/communications" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MegaphoneIcon className="w-4 h-4 mr-3 text-yellow-400" />
                <span>Comunicações</span>
              </NavLink>

              <SectionLabel>Técnico & Campo</SectionLabel>
              <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <RosterIcon className="w-4 h-4 mr-3 text-blue-500" />
                <span>Gestão de Elenco</span>
              </NavLink>
              <NavLink to="/practice" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <PracticeIcon className="w-4 h-4 mr-3 text-green-500" />
                <span>Treinos (Scripts)</span>
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
                <span>Vision Core (Vídeo)</span>
              </NavLink>
              <NavLink to="/recruitment" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UserPlusIcon className="w-4 h-4 mr-3 text-pink-500" />
                <span>Scouting / Tryouts</span>
              </NavLink>

              <SectionLabel>Operações & Financeiro</SectionLabel>
              <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
                <span>Financeiro (CFO)</span>
              </NavLink>
              <NavLink to="/commercial" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BriefcaseIcon className="w-4 h-4 mr-3 text-blue-400" />
                <span>Comercial / CRM</span>
              </NavLink>
              <NavLink to="/marketing" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MegaphoneIcon className="w-4 h-4 mr-3 text-pink-400" />
                <span>Marketing / IA Post</span>
              </NavLink>
              <NavLink to="/inventory" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ClipboardIcon className="w-4 h-4 mr-3 text-yellow-400" />
                <span>Inventário</span>
              </NavLink>
              <NavLink to="/event-desk" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <TicketIcon className="w-4 h-4 mr-3 text-orange-400" />
                <span>Event Desk (PDV)</span>
              </NavLink>
              <NavLink to="/digital-store" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ShopIcon className="w-4 h-4 mr-3 text-cyan-400" />
                <span>SaaS Store</span>
              </NavLink>

              <SectionLabel>Ecossistema & Apoio</SectionLabel>
              <NavLink to="/logistics" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BusIcon className="w-4 h-4 mr-3 text-blue-300" />
                <span>Logística</span>
              </NavLink>
              <NavLink to="/staff" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-4 h-4 mr-3 text-indigo-400" />
                <span>Staff & RH</span>
              </NavLink>
              <NavLink to="/youth" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <AcademyIcon className="w-4 h-4 mr-3 text-pink-300" />
                <span>Escolinhas (Base)</span>
              </NavLink>
              <NavLink to="/academy" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BookIcon className="w-4 h-4 mr-3 text-yellow-300" />
                <span>Iron Academy</span>
              </NavLink>
              <NavLink to="/locker-room" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-4 h-4 mr-3 text-pink-500" />
                <span>Vestiário Social</span>
              </NavLink>
              <NavLink to="/resources" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FolderIcon className="w-4 h-4 mr-3 text-gray-400" />
                <span>Arquivos / Docs</span>
              </NavLink>

              <SectionLabel>Governança Macro</SectionLabel>
              <NavLink to="/officiating" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FlagIcon className="w-4 h-4 mr-3 text-yellow-500" />
                <span>Arbitragem</span>
              </NavLink>
              <NavLink to="/league" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <TrophyIcon className="w-4 h-4 mr-3 text-purple-600" />
                <span>Federação (Live)</span>
              </NavLink>
              <NavLink to="/confederation" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <GlobeIcon className="w-4 h-4 mr-3 text-green-600" />
                <span>Confederação</span>
              </NavLink>
              <NavLink to="/broadcast-booth" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MicIcon className="w-4 h-4 mr-3 text-red-500" />
                <span>Broadcaster Booth</span>
              </NavLink>

              <SectionLabel>Administração</SectionLabel>
              <NavLink to="/admin" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <LockIcon className="w-4 h-4 mr-3" />
                <span>Painel Admin</span>
              </NavLink>
              <NavLink to="/settings" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <SettingsNavIcon className="w-4 h-4 mr-3" />
                <span>Ajustes Time</span>
              </NavLink>
              <NavLink to="/platform-hq" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BuildingIcon className="w-4 h-4 mr-3" />
                <span>Platform HQ</span>
              </NavLink>
              <NavLink to="/roadmap" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MapIcon className="w-4 h-4 mr-3" />
                <span>Roadmap</span>
              </NavLink>
            </>
          )}

          {/* VISÃO ATLETA (Reduzida para foco) */}
          {!isMaster && currentRole === 'PLAYER' && (
             <>
                <SectionLabel>Área do Atleta</SectionLabel>
                <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <UsersIcon className="w-4 h-4 mr-3" />
                  <span>Meu Perfil</span>
                </NavLink>
                <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <ScheduleIcon className="w-4 h-4 mr-3" />
                  <span>Agenda de Jogos</span>
                </NavLink>
                <NavLink to="/academy" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <AcademyIcon className="w-4 h-4 mr-3" />
                  <span>Iron Lab (Treino)</span>
                </NavLink>
                <NavLink to="/locker-room" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <HeartIcon className="w-4 h-4 mr-3 text-pink-500" />
                  <span>Vestiário</span>
                </NavLink>
                <NavLink to="/marketplace" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <ShopIcon className="w-4 h-4 mr-3" />
                  <span>Marketplace</span>
                </NavLink>
             </>
          )}
        </nav>
      </div>

      {/* GOD MODE SWITCHER (ONLY FOR MASTER) */}
      {isGodUser && (
        <div className="p-3 bg-black/40 border-t border-white/5 shrink-0">
            <p className="text-[9px] font-black text-highlight uppercase mb-2 text-center tracking-widest">God Mode (Role Switcher)</p>
            <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => { setRole('MASTER'); navigate('/dashboard'); }} 
                  className={`text-[9px] py-1.5 rounded font-black border transition-all ${currentRole === 'MASTER' ? 'bg-highlight border-highlight text-white shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                  MASTER
                </button>
                <button 
                  onClick={() => { setRole('PLAYER'); navigate('/dashboard'); }} 
                  className={`text-[9px] py-1.5 rounded font-black border transition-all ${currentRole === 'PLAYER' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                  ATLETA
                </button>
            </div>
        </div>
      )}

      <div className="p-3 bg-[#0B1120] border-t border-white/5 shrink-0">
        <button onClick={handleLogout} className="w-full text-[10px] font-black text-red-400 hover:text-white flex items-center justify-center gap-2 py-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all uppercase tracking-widest">Encerrar Sessão</button>
      </div>
    </aside>
  );
});

export default Sidebar;