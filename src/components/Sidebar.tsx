
import React from 'react';
// @ts-ignore
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, RosterIcon, ScheduleIcon, FinanceIcon, 
  AiPlaybookIcon, PracticeIcon, FlagIcon, TrophyIcon, 
  MegaphoneIcon, ShopIcon, BriefcaseIcon, AcademyIcon, VideoIcon,
  WhistleIcon
} from './icons/NavIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { ClipboardIcon, UsersIcon, ShieldCheckIcon, BusIcon } from './icons/UiIcons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const isMasterUser = user?.role === 'MASTER';

  // Estilos simplificados: Sem hover complexos, cores sólidas
  const navLinkClasses = "flex items-center px-4 py-2 text-text-secondary rounded hover:bg-tertiary hover:text-white transition-none";
  const activeNavLinkClasses = "bg-highlight text-white font-bold";

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
    <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-secondary transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-linear lg:relative lg:translate-x-0 lg:flex lg:flex-shrink-0 flex flex-col h-full border-r border-tertiary shadow-none`}>
      <div className="h-16 flex items-center px-4 bg-secondary border-b border-tertiary">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-highlight rounded flex items-center justify-center">
                    <span className="text-white font-black text-sm">FH</span>
                </div>
                <span className="text-lg font-bold text-white">FAHUB</span>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <nav className="flex-1 px-2 py-4 space-y-1">
          
          {/* PAINEL GERAL (Todos) */}
          <NavLink to="/dashboard" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon />
            <span className="ml-3">Painel Principal</span>
          </NavLink>

          {/* VISÃO COACH & MASTER */}
          {(currentRole === 'MASTER' || currentRole === 'HEAD_COACH' || currentRole === 'OFFENSIVE_COORD' || currentRole === 'DEFENSIVE_COORD') && (
            <>
              <p className="px-3 text-[10px] font-bold text-text-secondary/50 uppercase mt-4 mb-1">Campo & Tática</p>
              <NavLink to="/practice" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <PracticeIcon />
                <span className="ml-3">Treinos</span>
              </NavLink>
              <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ScheduleIcon />
                <span className="ml-3">Calendário</span>
              </NavLink>
              <NavLink to="/roster" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <RosterIcon />
                <span className="ml-3">Elenco</span>
              </NavLink>
              <NavLink to="/gemini-playbook" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <AiPlaybookIcon />
                <span className="ml-3">Playbook IA</span>
              </NavLink>
              <NavLink to="/video" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <VideoIcon />
                <span className="ml-3">Vídeo & Análise</span>
              </NavLink>
            </>
          )}

          {/* VISÃO GESTÃO (Master e Financeiro) */}
          {(currentRole === 'MASTER' || currentRole === 'FINANCIAL_MANAGER') && (
            <>
              <p className="px-3 text-[10px] font-bold text-text-secondary/50 uppercase mt-4 mb-1">Administrativo</p>
              <NavLink to="/finance" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon />
                <span className="ml-3">Financeiro</span>
              </NavLink>
              <NavLink to="/logistics" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BusIcon className="w-6 h-6" />
                <span className="ml-3">Logística</span>
              </NavLink>
              <NavLink to="/staff" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon />
                <span className="ml-3">Staff & RH</span>
              </NavLink>
              <NavLink to="/commercial" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BriefcaseIcon />
                <span className="ml-3">Comercial</span>
              </NavLink>
              <NavLink to="/marketing" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MegaphoneIcon />
                <span className="ml-3">Marketing</span>
              </NavLink>
            </>
          )}

          {/* VISÃO ÁRBITRO */}
          {(currentRole === 'MASTER' || currentRole === 'REFEREE') && (
             <>
               <p className="px-3 text-[10px] font-bold text-text-secondary/50 uppercase mt-4 mb-1">Oficiais</p>
               <NavLink to="/officiating" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                 <FlagIcon />
                 <span className="ml-3">Arbitragem</span>
               </NavLink>
             </>
          )}

          {/* VISÃO ATLETA */}
          {(currentRole === 'PLAYER') && (
             <>
                <p className="px-3 text-[10px] font-bold text-text-secondary/50 uppercase mt-4 mb-1">Área do Atleta</p>
                <NavLink to="/profile" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <UsersIcon />
                  <span className="ml-3">Meu Perfil</span>
                </NavLink>
                <NavLink to="/schedule" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                  <ScheduleIcon />
                  <span className="ml-3">Agenda</span>
                </NavLink>
             </>
          )}

          {/* COMUNS & EXTRAS */}
          <p className="px-3 text-[10px] font-bold text-text-secondary/50 uppercase mt-4 mb-1">Ecossistema</p>
          <NavLink to="/academy" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <AcademyIcon />
            <span className="ml-3">Academy</span>
          </NavLink>
          <NavLink to="/marketplace" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <ShopIcon />
            <span className="ml-3">Loja & Vendas</span>
          </NavLink>
          <NavLink to="/locker-room" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <UsersIcon />
            <span className="ml-3">Vestiário (Social)</span>
          </NavLink>
          <NavLink to="/resources" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <ClipboardIcon />
            <span className="ml-3">Arquivos & Contratos</span>
          </NavLink>
          
          {(currentRole === 'MASTER') && (
             <>
                <NavLink to="/league" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <TrophyIcon />
                    <span className="ml-3">Federação</span>
                </NavLink>
                <NavLink to="/confederation" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <UsersIcon />
                    <span className="ml-3">Confederação</span>
                </NavLink>
                <NavLink to="/admin" onClick={handleLinkClick} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <ClipboardIcon />
                    <span className="ml-3">Admin Panel</span>
                </NavLink>
             </>
          )}
        </nav>
      </div>

      {/* GOD MODE SWITCHER (ONLY FOR MASTER) */}
      {isMasterUser && (
        <div className="bg-black/40 border-t border-white/5 p-3">
            <p className="text-[9px] font-bold text-highlight uppercase mb-2 text-center tracking-widest">Modo de Visualização (Admin)</p>
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={() => { setRole('MASTER'); navigate('/dashboard'); }}
                    className={`text-[10px] py-1.5 rounded font-bold border flex items-center justify-center gap-1 ${currentRole === 'MASTER' ? 'bg-highlight border-highlight text-white' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                    <ShieldCheckIcon className="w-3 h-3" /> Dono
                </button>
                <button 
                    onClick={() => { setRole('HEAD_COACH'); navigate('/dashboard'); }}
                    className={`text-[10px] py-1.5 rounded font-bold border flex items-center justify-center gap-1 ${currentRole === 'HEAD_COACH' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                    <WhistleIcon className="w-3 h-3" /> Coach
                </button>
                <button 
                    onClick={() => { setRole('PLAYER'); navigate('/profile'); }}
                    className={`text-[10px] py-1.5 rounded font-bold border flex items-center justify-center gap-1 ${currentRole === 'PLAYER' ? 'bg-green-600 border-green-600 text-white' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                    <UsersIcon className="w-3 h-3" /> Atleta
                </button>
                <button 
                    onClick={() => { setRole('REFEREE'); navigate('/officiating'); }}
                    className={`text-[10px] py-1.5 rounded font-bold border flex items-center justify-center gap-1 ${currentRole === 'REFEREE' ? 'bg-yellow-500 border-yellow-500 text-black' : 'border-white/10 text-text-secondary hover:text-white'}`}
                >
                    <FlagIcon className="w-3 h-3" /> Juiz
                </button>
            </div>
        </div>
      )}

      <div className="p-2 bg-primary border-t border-tertiary">
        <button 
            onClick={handleLogout}
            className="w-full text-xs text-text-secondary hover:text-white flex items-center justify-center gap-2 py-2 hover:bg-tertiary rounded"
        >
            Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
