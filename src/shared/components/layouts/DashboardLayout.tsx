import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

/**
 * DASHBOARD LAYOUT - WRAPPER MESTRE
 * Atualizado para Protocolo Nexus (Cyberpunk/Dark)
 * Remove o fundo branco e aplica a identidade visual #050510.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    // CONTAINER GLOBAL - Fundo Deep Void (#050510)
    <div className="flex h-screen bg-[#050510] overflow-hidden text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar - Passamos o estado para controlar no mobile */}
      {/* Certifique-se de que o componente Sidebar também use cores escuras internamente */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        closeMobile={() => setIsMobileMenuOpen(false)} 
      />

      {/* ÁREA DE CONTEÚDO */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050510] to-[#050510]">
        
        {/* Header - Recebe a função de abrir o menu */}
        <Header 
          pageTitle={pageTitle} 
          onToggleSidebar={toggleMobileMenu} 
        />

        {/* Conteúdo Principal (Main) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 relative z-10">
          {/* Container limitador para não esticar demais em telas ultrawide */}
          <div className="max-w-7xl mx-auto min-h-full animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;