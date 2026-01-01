import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Função para checar se o link está ativo
  const isActive = (path: string) => location.pathname === path;

  // Lista de Navegação (Menu Principal)
  const menuItems = [
    { label: 'Visão Geral', path: '/dashboard', icon: '⚡' },
    { label: 'Financeiro', path: '/financeiro', icon: '💎' },
    { label: 'Capital Humano', path: '/human-capital', icon: '👥' },
    { label: 'Agenda / Operações', path: '/agenda', icon: '📅' },
    { label: 'Estratégia & OKRs', path: '/configuracoes', icon: '🎯' }, // Usando config temporariamente
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose(); // Fecha sidebar no mobile ao clicar
    }
  };

  return (
    <>
      {/* OVERLAY ESCURO (Apenas Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed top-0 left-0 h-full z-50 bg-[#0f172a] border-r border-slate-800
          transition-transform duration-300 ease-in-out w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:w-64 md:shrink-0
        `}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo / Header da Sidebar */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black italic text-white tracking-tighter">
              FAHUB <span className="text-indigo-500">MGR</span>
            </h2>
            {/* Botão Fechar (Mobile) */}
            <button onClick={onClose} className="md:hidden text-gray-400">
              ✕
            </button>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive(item.path) 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* Footer da Sidebar (Voltar ao Nexus) */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:border-indigo-500 transition-colors"
            >
              🔄 TROCAR PERSONA
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;