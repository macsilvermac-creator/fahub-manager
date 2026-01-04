import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Calendar, 
  Target, 
  ChevronLeft,
  LogOut,
  Zap // <--- Novo ícone para o Comando Tático
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * DASHBOARD SIDEBAR - PROTOCOLO NEXUS
 * Sistema de navegação lateral com controle de acesso por Persona.
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [persona, setPersona] = useState<string>('');

  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) setPersona(savedPersona);
  }, []);

  // Lógica de Permissões Nexus
  const isSportsDirector = persona === 'DIR_ESPORTES';
  const isHC = persona === 'HC';
  const isMaster = persona === 'MASTER';

  const menuItems = [
    { id: 'geral', label: 'Visão Geral', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    
    // COMANDO TÁTICO: Visível apenas para HC e MASTER
    { 
      id: 'hc-tactical', 
      label: 'Comando Tático', 
      icon: <Zap size={20} />, 
      path: '/hc-tactical', 
      restricted: !isHC && !isMaster 
    },

    { id: 'financeiro', label: 'Financeiro', icon: <Wallet size={20} />, path: '/financeiro', restricted: isSportsDirector },
    { id: 'elenco', label: 'Capital Humano', icon: <Users size={20} />, path: '/human-capital' },
    { id: 'agenda', label: 'Agenda / Operações', icon: <Calendar size={20} />, path: '/agenda' },
    { id: 'estrategia', label: 'Estratégia & OKRs', icon: <Target size={20} />, path: '/estrategia' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('nexus_persona');
    navigate('/');
  };

  return (
    <>
      {/* Overlay para Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed md:relative z-50 w-72 h-screen bg-[#0f172a] border-r border-white/5 
        transition-transform duration-500 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* LOGO AREA */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-black italic text-white text-sm">F</span>
            </div>
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">
              FAHUB <span className="text-indigo-500">MGR</span>
            </h2>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            // Só renderiza se não for restrito para a persona atual
            !item.restricted && (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 768) onClose();
                }}
                className={`
                  w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300
                  ${location.pathname === item.path 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}
                `}
              >
                <span className={`${location.pathname === item.path ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            )
          ))}
        </nav>

        {/* FOOTER AREA / PERSONA SWITCH */}
        <div className="p-6 border-t border-white/5 bg-[#0a0f1d]/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-red-500/10 hover:text-red-400 border border-transparent transition-all duration-300"
          >
            <LogOut size={20} />
            Trocar Persona
          </button>
        </div>
      </aside>
    </>
  );
}