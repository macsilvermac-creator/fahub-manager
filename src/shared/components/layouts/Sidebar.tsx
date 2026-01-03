import { LayoutDashboard, Users, Settings, DollarSign, Calendar, LogOut, Shield } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
// Nota: Se useUserRole não existir, pode remover e usar uma string fixa por enquanto.
import { useUserRole } from '../../hooks/useUserRole'; 

interface SidebarProps {
  isMobileOpen?: boolean;
  closeMobile?: () => void;
}

const Sidebar = ({ isMobileOpen, closeMobile }: SidebarProps) => {
  // Fallback seguro caso o hook não esteja implementado ainda
  const role = localStorage.getItem('nexus_persona') || 'VISITANTE';

  // Definição clara de quem vê o quê
  // Adicionei roles genéricas para garantir que apareça algo
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['MASTER', 'PRESIDENTE', 'VICE_PRES', 'HC', 'gestor', 'VISITANTE'] },
    { icon: Calendar, label: 'Agenda', path: '/agenda', roles: ['MASTER', 'HC', 'ATHLETE', 'COORD_ATQ', 'gestor', 'atleta'] },
    { icon: Users, label: 'Atletas', path: '/elenco', roles: ['MASTER', 'HC', 'DIR_ESPORTES', 'gestor'] },
    { icon: DollarSign, label: 'Financeiro', path: '/financeiro', roles: ['MASTER', 'CFO', 'PRESIDENTE', 'gestor'] },
    { icon: Shield, label: 'Labs & Tryout', path: '/tryout-lab', roles: ['MASTER', 'HC', 'DIR_ESPORTES'] },
    { icon: Settings, label: 'Configurações', path: '/configuracoes', roles: ['MASTER'] },
  ];

  // Filtra os itens (Lógica simples: se a role do usuário estiver na lista do item, mostra)
  // Se for MASTER, mostra tudo.
  const filteredItems = menuItems.filter(item => 
    role === 'MASTER' || item.roles.includes(role)
  );

  return (
    <>
      {/* Overlay Mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden" onClick={closeMobile} />
      )}
      
      {/* Container Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 
        bg-[#0a0a16] border-r border-white/5 text-slate-300 
        flex flex-col z-50 
        transition-transform duration-300 ease-out shadow-2xl shadow-black/50
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        
        {/* Header da Sidebar */}
        <div className="p-8 border-b border-white/5 bg-[#050510]">
          <Link to="/" className="block group" onClick={closeMobile}>
            <h1 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-indigo-400 transition-colors">
              FAHUB <span className="text-indigo-600">.</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] group-hover:text-white transition-colors">
              Nexus System
            </p>
          </Link>
        </div>
        
        {/* Links de Navegação */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {filteredItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              onClick={closeMobile}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-indigo-400/50' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              <item.icon size={18} className="relative z-10" /> 
              <span className="relative z-10">{item.label}</span>
              
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </NavLink>
          ))}
        </nav>

        {/* Footer da Sidebar (Botão Sair) */}
        <div className="p-4 border-t border-white/5 bg-[#050510]">
          <button 
            onClick={() => {
               localStorage.removeItem('nexus_persona');
               window.location.href = '/';
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all font-bold text-xs uppercase tracking-wider"
          >
            <LogOut size={18} />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;