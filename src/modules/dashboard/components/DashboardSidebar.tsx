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

  useEffect(() => {
    const saved = localStorage.getItem('nexus_persona');
    if (saved) setPersona(saved);
  }, []);

  const isMarketingPersona = persona === 'CMO';
  const isCommercialPersona = persona === 'CCO'; // <--- DETECTA CCO
  const isActive = (path: string) => location.pathname === path;

  // Itens Executivos / Esportivos
  const defaultMenuItems = [
    { label: 'Visão Geral', path: '/dashboard', icon: '⚡' },
    { label: 'Financeiro', path: '/financeiro', icon: '💎' },
    { label: 'Capital Humano', path: '/human-capital', icon: '👥' },
    { label: 'Agenda / Operações', path: '/agenda', icon: '📅' },
    { label: 'Estratégia & OKRs', path: '/configuracoes', icon: '🎯' },
  ];

  // Itens de Marketing (CMO)
  const marketingMenuItems = [
    { label: 'Marketing Hub', path: '/dashboard', icon: '⚡' },
    { label: 'Projetos & Metas', path: '/marketing/projetos-metas', icon: '🚀' },
    { label: 'Creative Lab', path: '/creative-lab', icon: '🎨' },
  ];

  // Itens de Comercial (CCO) - <--- NOVO MENU
  const commercialMenuItems = [
    { label: 'CCO Hub', path: '/dashboard', icon: '⚡' },
    { label: 'Sponsor Lab (IA)', path: '/sponsor-lab', icon: '🧬' },
    { label: 'Pipeline de Vendas', path: '/dashboard', icon: '📈' }, // Link para o dashboard por enquanto
    { label: 'Inventário Assets', path: '/dashboard', icon: '📦' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full z-50 bg-[#0f172a] border-r border-slate-800 transition-transform duration-300 w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static flex flex-col`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black italic text-white tracking-tighter">FAHUB <span className="text-indigo-500">MGR</span></h2>
            <button onClick={onClose} className="md:hidden text-gray-400">✕</button>
          </div>

          <nav className="flex-1 space-y-2">
            {/* RENDERIZAÇÃO CONDICIONAL DE MENU */}
            {isCommercialPersona ? (
              commercialMenuItems.map((item) => (
                <button key={item.label} onClick={() => handleNavigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))
            ) : isMarketingPersona ? (
              marketingMenuItems.map((item) => (
                <button key={item.label} onClick={() => handleNavigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))
            ) : (
              defaultMenuItems.map((item) => (
                <button key={item.label} onClick={() => handleNavigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800">
            <button onClick={() => handleNavigate('/')} className="w-full flex items-center justify-center gap-2 py-3 border border-slate-700 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:border-indigo-500 transition-colors">
              🔄 TROCAR PERSONA
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;