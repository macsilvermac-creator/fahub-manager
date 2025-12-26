
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DashboardIcon, WhistleIcon, FinanceIcon, 
  UsersIcon, MegaphoneIcon, BrainIcon, 
  BriefcaseIcon, ShieldCheckIcon, TrophyIcon, 
  BookIcon, HeartPulseIcon
} from './icons/UiIcons';
import { UserRole } from '../types';
import { securityService } from '../services/securityService';
import { authService } from '../services/authService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ isOpen, setIsOpen, currentRole }) => {
  const user = authService.getCurrentUser();
  const program = user?.program || 'TACKLE';
  
  const navLinkClasses = "flex items-center px-4 py-2.5 text-text-secondary rounded-xl hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black";

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 lg:relative lg:translate-x-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 ${program === 'FLAG' ? 'bg-yellow-600' : 'bg-highlight'}`}>
                    <span className="text-white font-black text-lg tracking-tighter">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block leading-none italic tracking-tighter uppercase">FAHUB <span className={program === 'FLAG' ? 'text-yellow-500' : 'text-highlight'}>PRO</span></span>
                    <span className="text-[9px] text-text-secondary uppercase tracking-widest font-bold">
                        {securityService.getDirectorateLabel(currentRole)}
                    </span>
                </div>
            </div>
      </div>
      
      {/* Scrollable Menu */}
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-4 px-3">
        <nav className="flex-1">
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>PAINEL PRINCIPAL</span>
          </NavLink>

          {/* Seção Esportiva - Técnicos e Atletas */}
          {securityService.canAccess(currentRole, 'SPORTS') && (
            <>
                <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">Unidade de Campo</p>
                
                <NavLink to="/roster" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <UsersIcon className="w-4 h-4 mr-3 text-blue-400" />
                    <span>Elenco & Roster</span>
                </NavLink>

                <NavLink to="/tactical-lab" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <BrainIcon className="w-4 h-4 mr-3 text-cyan-400" />
                    <span>Playbook Digital</span>
                </NavLink>

                <NavLink to="/training-day" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                    <WhistleIcon className="w-4 h-4 mr-3 text-indigo-400" />
                    <span>Treinos & Scripts</span>
                </NavLink>

                {['MASTER', 'HEAD_COACH', 'EQUIPMENT_MANAGER'].includes(currentRole) && (
                    <NavLink to="/inventory" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                        <ShieldCheckIcon className="w-4 h-4 mr-3 text-orange-400" />
                        <span>Almoxarifado</span>
                    </NavLink>
                )}
            </>
          )}

          {/* Seção Administrativa - Diretores e Master */}
          {securityService.canAccess(currentRole, 'COMMERCIAL') && (
            <>
              <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">Diretoria</p>
              
              <NavLink to="/finance" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
                <span>Gestão Financeira</span>
              </NavLink>

              <NavLink to="/commercial" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BriefcaseIcon className="w-4 h-4 mr-3 text-blue-500" />
                <span>Comercial / CRM</span>
              </NavLink>

              <NavLink to="/marketing" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MegaphoneIcon className="w-4 h-4 mr-3 text-pink-500" />
                <span>Marketing / Mídia</span>
              </NavLink>
            </>
          )}

          {/* Seção Governança - Master / Presidente */}
          {securityService.canAccess(currentRole, 'SETTINGS') && (
            <>
              <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">Governança</p>
              <NavLink to="/admin" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <ShieldCheckIcon className="w-4 h-4 mr-3 text-red-500" />
                <span>War Room (Admin)</span>
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <HeartPulseIcon className="w-4 h-4 mr-3 text-gray-400" />
                <span>Configurações</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Footer: Logout */}
      <div className="p-4 border-t border-white/5 bg-[#0B1120]">
           <button 
                onClick={() => authService.logout()} 
                className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2"
           >
                Sair do Sistema
           </button>
           <p className="text-[7px] text-text-secondary/30 text-center mt-3 uppercase tracking-widest">v3.5 Build Production</p>
      </div>
    </aside>
  );
});

export default Sidebar;