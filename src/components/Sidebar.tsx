
import React from 'react';
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
import { ClipboardIcon, UsersIcon, ShieldCheckIcon, BusIcon, UserPlusIcon, LockIcon, EyeIcon, WalletIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isRealMaster = user?.role === 'MASTER';
  const isSimulating = isRealMaster && currentRole !== 'MASTER';

  const navLinkClasses = "flex items-center px-4 py-2.5 text-text-secondary rounded-lg hover:bg-white/5 hover:text-white transition-all text-sm font-medium mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-bold shadow-[0_0_15px_rgba(0,168,107,0.1)]";

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) { 
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
      authService.logout();
      navigate('/login');
  };

  const isCoach = ['MASTER', 'HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD'].includes(currentRole);
  const isAthlete = ['PLAYER'].includes(currentRole);
  const isBackoffice = ['MASTER', 'FINANCIAL_MANAGER', 'MARKETING_MANAGER', 'COMMERCIAL_MANAGER'].includes(currentRole);
  const isOfficial = ['MASTER', 'REFEREE'].includes(currentRole);

  const getRoleBadge = () => {
      if(currentRole === 'MASTER') return { label: 'GOD MODE', color: 'bg-red-600' };
      if(isCoach) return { label: 'COMISSÃO TÉCNICA', color: 'bg-blue-600' };
      if(isAthlete) return { label: 'ATLETA', color: 'bg-green-600' };
      if(currentRole === 'FINANCIAL_MANAGER') return { label: 'CFO / FINANÇAS', color: 'bg-yellow-600' };
      if(currentRole === 'REFEREE') return { label: 'ÁRBITRO', color: 'bg-yellow-500' };
      return { label: 'STAFF', color: 'bg-gray-600' };
  };

  const badge = getRoleBadge();

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-linear lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0B1120]">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border border-white/10 ${isAthlete ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : isCoach ? 'bg-gradient-to-br from-highlight to-emerald-800' : 'bg-gradient-to-br from-slate-700 to-slate-900'}`}>
                    <span className="text-white font-black text-lg tracking-tighter">
                        {isAthlete ? 'PL' : isCoach ? 'CO' : 'AD'}
                    </span>
                </div>
                <div>
                    <span className="text-lg font-bold text-white block leading-none">FAHUB</span>
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest font-semibold">
                        Manager v3.3
                    </span>
                </div>
            </div>
      </div>

      <div className="px-3 pt-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 ${badge.color} bg-opacity-20`}>
              <LockIcon className={`w-3 h-3 text-white ${badge.color.replace('bg-', 'text-')}`} />
              <span className="text-[9px] font-black text-white tracking-widest uppercase">{badge.label}</span>
          </div>
          
          {isSimulating && (
            <div className="mt-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2 flex items-center justify-center gap-2 animate-pulse">
                <EyeIcon className="w-3 h-3 text-yellow-400" />
                <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-wider">Modo Simulação Ativo</span>
            </div>
          )}
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-4 px-3">
        <nav className="flex-1 space-y-1">
          
          <NavLink 
            to="/dashboard" 
            state={{ reset: true }} 
            onClick={handleLinkClick} 
            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}
          >
            <DashboardIcon className="w-5 h-5 mr-3 group-hover:text-highlight transition-colors" />
            <span>{isAthlete ? 'Meu Locker' : 'QG Principal'}</span>
          </NavLink>

          {isCoach && (
            <div className="mt-6 animate-fade-in">
              <p className="px-4 text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-2">Comissão Técnica</p>
              
              <NavLink to="/practice" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <PracticeIcon className="w-5 h-5 mr-3 group-hover:text-blue-400 transition-colors" />
                <span>Gestão de Treinos</span>
              </NavLink>
              
              <NavLink to="/gemini-playbook" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <AiPlaybookIcon className="w-5 h-5 mr-3 group-hover:text-purple-400 transition-colors" />
                <span>Playbook & IA</span>
              </NavLink>
              
              <NavLink to="/tactical-lab" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <WhistleIcon className="w-5 h-5 mr-3 group-hover:text-orange-400 transition-colors" />
                <span>Laboratório Tático</span>
              </NavLink>

              <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <RosterIcon className="w-5 h-5 mr-3 group-hover:text-green-400 transition-colors" />
                <span>Elenco (Roster)</span>
              </NavLink>
              
              <NavLink to="/video" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <VideoIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400 transition-colors" />
                <span>Vídeo & Scout</span>
              </NavLink>
              
              <NavLink to="/recruitment" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UserPlusIcon className="w-5 h-5 mr-3 group-hover:text-orange-400 transition-colors" />
                <span>Recrutamento</span>
              </NavLink>
              
              <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ScheduleIcon className="w-5 h-5 mr-3 group-hover:text-red-400 transition-colors" />
                <span>Calendário</span>
              </NavLink>
            </div>
          )}

          {isAthlete && (
             <div className="mt-6 animate-fade-in">
                <p className="px-4 text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-2">Área do Atleta</p>
                
                <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <UsersIcon className="w-5 h-5 mr-3 group-hover:text-blue-400 transition-colors" />
                  <span>Meu Perfil & Stats</span>
                </NavLink>
                
                <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <ScheduleIcon className="w-5 h-5 mr-3 group-hover:text-red-400 transition-colors" />
                  <span>Agenda de Jogos</span>
                </NavLink>
                
                <NavLink to="/gemini-playbook" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <AiPlaybookIcon className="w-5 h-5 mr-3 group-hover:text-purple-400 transition-colors" />
                  <span>Estudar Playbook</span>
                </NavLink>
                
                <NavLink to="/academy" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <AcademyIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400 transition-colors" />
                  <span>Treinos (Gym)</span>
                </NavLink>
             </div>
          )}

          {isBackoffice && (
            <div className="mt-6 animate-fade-in">
              <p className="px-4 text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-2">Gestão Corporativa</p>
              
              <NavLink to="/event-desk" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <TicketIcon className="w-5 h-5 mr-3 group-hover:text-green-400 transition-colors" />
                <span>PDV: Bar & Eventos</span>
              </NavLink>

              <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon className="w-5 h-5 mr-3 group-hover:text-green-400 transition-colors" />
                <span>Financeiro (CFO)</span>
              </NavLink>
              
              <NavLink to="/commercial" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BriefcaseIcon className="w-5 h-5 mr-3 group-hover:text-blue-400 transition-colors" />
                <span>Comercial & CRM</span>
              </NavLink>
              
              <NavLink to="/marketing" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MegaphoneIcon className="w-5 h-5 mr-3 group-hover:text-pink-400 transition-colors" />
                <span>Marketing</span>
              </NavLink>
              
              <NavLink to="/logistics" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BusIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400 transition-colors" />
                <span>Logística</span>
              </NavLink>
              
              <NavLink to="/inventory" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ClipboardIcon className="w-5 h-5 mr-3 group-hover:text-orange-400 transition-colors" />
                <span>Inventário</span>
              </NavLink>

              <NavLink to="/staff" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-5 h-5 mr-3 group-hover:text-purple-400 transition-colors" />
                <span>Staff & RH</span>
              </NavLink>
            </div>
          )}

          {isOfficial && (
             <div className="mt-6 animate-fade-in">
               <p className="px-4 text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-2">Oficiais</p>
               <NavLink to="/officiating" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                 <FlagIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400 transition-colors" />
                 <span>Painel do Árbitro</span>
               </NavLink>
             </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="px-4 text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-2">Comunidade</p>
            <NavLink to="/locker-room" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-5 h-5 mr-3 group-hover:text-blue-400" />
                <span>Vestiário (Social)</span>
            </NavLink>
            <NavLink to="/marketplace" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ShopIcon className="w-5 h-5 mr-3 group-hover:text-yellow-400" />
                <span>Classificados</span>
            </NavLink>
             <NavLink to="/digital-store" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <WalletIcon className="w-5 h-5 mr-3 group-hover:text-purple-400" />
                <span>Loja de Dados (New)</span>
            </NavLink>
          </div>
          
           {(currentRole === 'MASTER') && (
             <>
               <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="px-4 text-[10px] font-black text-text-secondary/40 uppercase tracking-widest mb-2">Entidades</p>
                  <NavLink to="/league" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                      <TrophyIcon className="w-5 h-5 mr-3" />
                      <span>Federação</span>
                  </NavLink>
                  <NavLink to="/confederation" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                      <UsersIcon className="w-5 h-5 mr-3" />
                      <span>Confederação</span>
                  </NavLink>
               </div>
             </>
          )}

        </nav>
      </div>
      
      {isRealMaster && (
          <div className="bg-gradient-to-b from-gray-900 to-black border-t border-red-500/30 p-3 pb-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-20">
               <div className="flex items-center justify-between mb-3 px-1">
                   <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                       <ShieldCheckIcon className="w-3 h-3" /> God Mode
                   </span>
                   <span className="text-[8px] text-red-400/50 uppercase font-mono">
                       {currentRole}
                   </span>
               </div>
                
                {/* --- SUPER ADMIN LINK --- */}
                <NavLink to="/platform-hq" onClick={handleLinkClick} className="flex items-center justify-center w-full bg-purple-900/40 hover:bg-purple-900/60 text-purple-400 text-[10px] font-bold py-2 rounded-lg border border-purple-500/30 mb-2 transition-all group">
                   <GlobeIcon className="w-3 h-3 mr-2" />
                   PLATFORM HQ (OWNER)
                </NavLink>

                <NavLink to="/admin" onClick={handleLinkClick} className="flex items-center justify-center w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 text-[10px] font-bold py-2 rounded-lg border border-red-500/30 mb-3 transition-all group">
                   <ShieldCheckIcon className="w-3 h-3 mr-2" />
                   ADMIN DO TIME
               </NavLink>
               <div className="grid grid-cols-4 gap-1">
                    <button onClick={() => { setRole('MASTER'); navigate('/dashboard'); }} className={`text-[8px] font-bold border rounded py-1.5 transition-colors ${currentRole === 'MASTER' ? 'bg-red-600 text-white border-red-500 shadow-glow' : 'text-text-secondary border-white/10 hover:text-white hover:bg-white/5'}`} title="Visão Dono">MST</button>
                    <button onClick={() => { setRole('HEAD_COACH'); navigate('/dashboard'); }} className={`text-[8px] font-bold border rounded py-1.5 transition-colors ${currentRole === 'HEAD_COACH' ? 'bg-blue-600 text-white border-blue-500' : 'text-text-secondary border-white/10 hover:text-white hover:bg-white/5'}`} title="Visão Técnico">HC</button>
                    <button onClick={() => { setRole('PLAYER'); navigate('/profile'); }} className={`text-[8px] font-bold border rounded py-1.5 transition-colors ${currentRole === 'PLAYER' ? 'bg-green-600 text-white border-green-500' : 'text-text-secondary border-white/10 hover:text-white hover:bg-white/5'}`} title="Visão Atleta">PL</button>
                    <button onClick={() => { setRole('REFEREE'); navigate('/officiating'); }} className={`text-[8px] font-bold border rounded py-1.5 transition-colors ${currentRole === 'REFEREE' ? 'bg-yellow-500 text-black border-yellow-400' : 'text-text-secondary border-white/10 hover:text-white hover:bg-white/5'}`} title="Visão Árbitro">REF</button>
               </div>
          </div>
      )}

      <div className="p-3 bg-[#0B1120] border-t border-white/5">
        <button 
            onClick={handleLogout}
            className="w-full text-xs font-bold text-red-400 hover:text-white flex items-center justify-center gap-2 py-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
        >
            Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;