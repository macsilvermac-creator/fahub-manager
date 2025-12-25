
import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  DashboardIcon, WhistleIcon, FinanceIcon, 
  UsersIcon, MegaphoneIcon, BrainIcon, 
  BriefcaseIcon, SettingsNavIcon, SparklesIcon
} from './icons/UiIcons';
import { UserRole } from '../types';
import { securityService } from '../services/securityService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ isOpen, setIsOpen, currentRole, setRole }) => {
  const navigate = useNavigate();
  
  const navLinkClasses = "flex items-center px-4 py-2.5 text-text-secondary rounded-xl hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black";

  const handlePersonaSwitch = (role: UserRole) => {
    setRole(role);
    navigate('/dashboard');
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 lg:relative lg:translate-x-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-highlight rounded-xl flex items-center justify-center shadow-lg transform -rotate-6">
                    <span className="text-white font-black text-lg tracking-tighter">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block leading-none italic tracking-tighter uppercase">FAHUB <span className="text-highlight">PRO</span></span>
                    <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">
                        {securityService.getDirectorateLabel(currentRole)}
                    </span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-4 px-3">
        <nav className="flex-1">
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>PAINEL PRINCIPAL</span>
          </NavLink>

          {/* ÁREA DE ESPORTES */}
          {securityService.canAccess(currentRole, 'SPORTS') && (
            <>
              <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">Diretoria de Esportes</p>
              <NavLink to="/roster" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <UsersIcon className="w-4 h-4 mr-3 text-blue-400" />
                <span>Roster & Depth Chart</span>
              </NavLink>
              <NavLink to="/ciators" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BrainIcon className="w-4 h-4 mr-3 text-cyan-400" />
                <span>CIATORS (Playbook)</span>
              </NavLink>
              <NavLink to="/training-day" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <WhistleIcon className="w-4 h-4 mr-3 text-indigo-400" />
                <span>Gestão de Treinos</span>
              </NavLink>
            </>
          )}

          {/* ÁREA COMERCIAL */}
          {securityService.canAccess(currentRole, 'COMMERCIAL') && (
            <>
              <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">Diretoria Comercial</p>
              <NavLink to="/finance" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <FinanceIcon className="w-4 h-4 mr-3 text-green-400" />
                <span>Financeiro Master</span>
              </NavLink>
              <NavLink to="/commercial/crm" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <BriefcaseIcon className="w-4 h-4 mr-3 text-emerald-400" />
                <span>Patrocínios (CRM)</span>
              </NavLink>
            </>
          )}

          {/* ÁREA MARKETING */}
          {securityService.canAccess(currentRole, 'MARKETING') && (
            <>
              <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">Diretoria de Marketing</p>
              <NavLink to="/marketing/ai" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <SparklesIcon className="w-4 h-4 text-pink-400" />
                <span>Hype IA Content</span>
              </NavLink>
              <NavLink to="/marketing/fan-portal" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <MegaphoneIcon className="w-4 h-4 text-orange-400" />
                <span>Portal da Torcida</span>
              </NavLink>
            </>
          )}

          {/* CONFIGURAÇÕES MASTER */}
          {securityService.canAccess(currentRole, 'SETTINGS') && (
            <>
              <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">Presidência</p>
              <NavLink to="/settings" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
                <SettingsNavIcon className="w-4 h-4 mr-3 text-slate-400" />
                <span>Configurações Clube</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="p-3 bg-black/30 border-t border-white/5 shrink-0">
          <p className="text-[8px] font-black text-text-secondary/40 uppercase mb-2 text-center tracking-[0.2em]">Visualizar como:</p>
          <div className="grid grid-cols-2 gap-1">
              <button onClick={() => handlePersonaSwitch('MASTER')} className={`py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${currentRole === 'MASTER' ? 'bg-highlight border-highlight text-white' : 'border-white/5 text-text-secondary'}`}>Presidente</button>
              <button onClick={() => handlePersonaSwitch('COMMERCIAL_DIRECTOR')} className={`py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${currentRole === 'COMMERCIAL_DIRECTOR' ? 'bg-green-600 border-green-600 text-white' : 'border-white/5 text-text-secondary'}`}>Comercial</button>
              <button onClick={() => handlePersonaSwitch('MARKETING_DIRECTOR')} className={`py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${currentRole === 'MARKETING_DIRECTOR' ? 'bg-orange-600 border-orange-600 text-white' : 'border-white/5 text-text-secondary'}`}>Marketing</button>
              <button onClick={() => handlePersonaSwitch('SPORTS_DIRECTOR')} className={`py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${currentRole === 'SPORTS_DIRECTOR' ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/5 text-text-secondary'}`}>Esportes</button>
          </div>
      </div>
    </aside>
  );
});

export default Sidebar;