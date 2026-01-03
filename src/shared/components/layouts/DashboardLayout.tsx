import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

/**
 * DASHBOARD LAYOUT - ARQUITETURA SHELL (FLEXBOX MODEL)
 * Padrão Enterprise: Elimina posicionamento absoluto/fixo para layout estrutural.
 * O navegador calcula o espaço da Sidebar e ajusta o conteúdo automaticamente.
 */
const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // ROOT SHELL: Flex Container que segura toda a aplicação
    // h-screen garante que a aplicação nunca ultrapasse a altura da janela (scroll interno)
    <div className="flex h-screen w-full bg-[#050510] text-slate-300 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR DESKTOP (Bloco Sólido) */}
      {/* 'hidden md:flex': Só existe no desktop */}
      {/* 'w-64 flex-none': Largura rígida, nunca encolhe */}
      <div className="hidden md:flex w-64 flex-col h-full border-r border-white/5 bg-[#0a0a16]">
        <Sidebar isMobileOpen={false} />
      </div>

      {/* 2. SIDEBAR MOBILE (Overlay) */}
      {/* Esta continua 'fixed' pois deve flutuar sobre o conteúdo no celular */}
      <div className="md:hidden">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          closeMobile={() => setIsMobileMenuOpen(false)} 
        />
      </div>

      {/* 3. ÁREA DE CONTEÚDO (Main Wrapper) */}
      {/* 'flex-1': Ocupa todo o espaço que a Sidebar não usar */}
      {/* 'flex-col': Organiza Header em cima e Conteúdo em baixo */}
      {/* 'min-w-0': Fix crítico do Flexbox para evitar estouro de conteúdo horizontal */}
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050510] to-[#050510]">
        
        {/* Header - Agora flui naturalmente dentro da coluna principal */}
        <Header 
          pageTitle={pageTitle} 
          onToggleSidebar={() => setIsMobileMenuOpen(true)} 
        />

        {/* Scroll Area - Apenas esta área rola, o Header e Sidebar ficam parados */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth custom-scrollbar">
          {/* Container de Largura Máxima para telas ultrawide */}
          <div className="max-w-[1920px] mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;