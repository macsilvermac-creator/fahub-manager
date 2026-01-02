import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [persona, setPersona] = useState<string>('VISITANTE');

  // Recupera a persona para definir permissões na sidebar
  useEffect(() => {
    const saved = localStorage.getItem('nexus_persona');
    if (saved) setPersona(saved);
  }, []);

  // Define tipos de persona para controle de acesso/itens de menu
  const isMarketingPersona = ['CMO', 'CCO'].includes(persona);
  // O acesso ao Tryout Lab também é definido por personas específicas
  const canAccessTryout = ['PRESIDENTE', 'VICE_PRES', 'DIRETOR', 'MASTER', 'HC', 'COORD_ATQ', 'COORD_DEF'].includes(persona);

  // Função para checar se o link está ativo
  const isActive = (path: string) => location.pathname === path;

  // Itens de menu padrão (para Executive/Sports e outros não Márketing)
  const defaultMenuItems = [
    { label: 'Visão Geral', path: '/dashboard', icon: '⚡' },
    { label: 'Financeiro', path: '/financeiro', icon: '💎' },
    { label: 'Capital Humano', path: '/human-capital', icon: '👥' },
    { label: 'Agenda / Operações', path: '/agenda', icon: '📅' },
    { label: 'Estratégia & OKRs', path: '/configuracoes', icon: '🎯' }, // Entidade Settings está aqui por enquanto
    { label: 'Elenco (Legacy)', path: '/elenco', icon: '🎽' }, // Adicionado para teste do módulo Athletes Light Mode
  ];

  // Itens de menu para a persona de Marketing
  const marketingMenuItems = [
    { label: 'Visão Geral (CMO)', path: '/dashboard', icon: '⚡' }, // Link para o Dashboard Marketing
    { label: 'Agenda / Coberturas', path: '/agenda', icon: '📅' },
    { label: 'Projetos & Metas', path: '/marketing/projetos-metas', icon: '🚀' }, // Futuro módulo Monday-like
    { label: 'Creative Lab', path: '/creative-lab', icon: '🎨' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* OVERLAY ESCURO (Mobile) */}
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
          md:translate-x-0 md:static md:w-64 md:shrink-0 flex flex-col
        `}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black italic text-white tracking-tighter">
              FAHUB <span className="text-indigo-500">MGR</span>
            </h2>
            <button onClick={onClose} className="md:hidden text-gray-400">✕</button>
          </div>

          {/* Links de Navegação */}
          <nav className="flex-1 space-y-2">
            {isMarketingPersona ? (
              // Itens de menu para Marketing
              marketingMenuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${isActive(item.path) 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' // Cor de destaque do Marketing
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))
            ) : (
              // Itens de menu padrão (para outras personas)
              defaultMenuItems.map((item) => (
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
              ))
            )}

            {/* SEÇÃO ESPECIAL: TRYOUT LAB (Restrita) */}
            {canAccessTryout && !isMarketingPersona && ( // Não exibir Tryout Lab para Marketing, pois ele tem o Creative Lab
              <div className="pt-4 mt-4 border-t border-slate-800">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Área Restrita
                </p>
                <button
                  onClick={() => handleNavigate('/tryout-lab')}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all border border-dashed
                    ${isActive('/tryout-lab') 
                      ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500' 
                      : 'text-cyan-600 border-cyan-900/50 hover:bg-cyan-900/10 hover:border-cyan-500'}
                  `}
                >
                  <span className="text-lg">🧬</span>
                  TRYOUT LAB
                </button>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button 
              onClick={() => handleNavigate('/')} // Volta para o NexusPortal para trocar de persona
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