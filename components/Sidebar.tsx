import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  DashboardIcon, WhistleIcon, FinanceIcon, 
  UsersIcon, MegaphoneIcon, BrainIcon, 
  BriefcaseIcon, ShieldCheckIcon, TrophyIcon, 
  BookIcon, HeartPulseIcon, TargetIcon, BusIcon, MapIcon
} from './icons/UiIcons';
import { UserRole } from '../types';
import { securityService, FeaturePermission } from '../services/securityService';
import { authService } from '../services/authService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ isOpen, currentRole }) => {
  const user = authService.getCurrentUser();
  const program = user?.program || 'TACKLE';
  
  const navLinkClasses = "flex items-center px-4 py-3 text-text-secondary rounded-xl hover:bg-white/5 hover:text-white transition-all text-xs font-bold mb-1 group";
  const activeNavLinkClasses = "bg-highlight/10 text-highlight border-l-4 border-highlight font-black";

  const MenuItem = ({ to, icon: Icon, label, permission }: { to: string, icon: any, label: string, permission: FeaturePermission }) => {
    if (!securityService.hasAccess(currentRole, permission)) return null;
    return (
      <NavLink to={to} className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
        <Icon className="w-4 h-4 mr-3" />
        <span>{label}</span>
      </NavLink>
    );
  };

  const SectionLabel = ({ label }: { label: string }) => (
    <p className="px-4 text-[9px] font-black text-text-secondary/40 uppercase tracking-widest mt-6 mb-2 border-b border-white/5 pb-1">{label}</p>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 lg:relative lg:translate-x-0 flex flex-col h-full border-r border-white/5 shadow-2xl`}>
      <div className="h-20 flex items-center px-6 border-b border-white/5 bg-[#0B1120] shrink-0">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 ${program === 'FLAG' ? 'bg-yellow-600' : 'bg-highlight'}`}>
                    <span className="text-white font-black text-lg tracking-tighter">FH</span>
                </div>
                <div>
                    <span className="text-sm font-black text-white block leading-none italic tracking-tighter uppercase">FAHUB <span className={program === 'FLAG' ? 'text-yellow-500' : 'text-highlight'}>PRO</span></span>
                    <span className="text-[9px] text-text-secondary uppercase tracking-widest font-bold">
                        {securityService.getRoleLabel(currentRole)}
                    </span>
                </div>
            </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar py-4 px-3">
        <nav className="flex-1">
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <DashboardIcon className="w-4 h-4 mr-3" />
            <span>SALA DE CARREIRA</span>
          </NavLink>

          <SectionLabel label="Performance & Estudo" />
          <MenuItem to="/gemini-playbook" icon={BookIcon} label="IA PLAYBOOK" permission="ATHLETE_PORTAL" />
          <MenuItem to="/vision-lab" icon={BrainIcon} label="VISION LAB (VÍDEOS)" permission="ATHLETE_PORTAL" />
          <MenuItem to="/training-day" icon={WhistleIcon} label="MEUS TREINOS" permission="COACH_CONSOLE" />
          <MenuItem to="/locker-room" icon={UsersIcon} label="VESTIÁRIO (MURAL)" permission="ATHLETE_PORTAL" />

          <SectionLabel label="Administrativo" />
          <MenuItem to="/finance" icon={FinanceIcon} label="FINANCEIRO / MENSALIDADE" permission="ATHLETE_PORTAL" />
          <MenuItem to="/marketplace" icon={TrophyIcon} label="LOJA & ITENS" permission="ATHLETE_PORTAL" />
          <MenuItem to="/profile" icon={UsersIcon} label="MEU BID / PERFIL" permission="ATHLETE_PORTAL" />

          <SectionLabel label="Gestão (Staff)" />
          <MenuItem to="/roster" icon={UsersIcon} label="ROSTER GERAL" permission="SPORTS_MGMT" />
          <MenuItem to="/sideline" icon={TargetIcon} label="SIDELINE HUB" permission="FIELD_OPS" />
          <MenuItem to="/admin" icon={ShieldCheckIcon} label="ADMIN PANEL" permission="GOVERNANCE_VIEW" />
        </nav>
      </div>

      <div className="p-4 border-t border-white/5 bg-[#0B1120]">
           <button onClick={() => authService.logout()} className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2">
                Sair
           </button>
      </div>
    </aside>
  );
});

export default Sidebar;