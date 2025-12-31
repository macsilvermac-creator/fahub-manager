import React, { useState } from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Passamos o estado para controlar no mobile */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        closeMobile={() => setIsMobileMenuOpen(false)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header - Recebe a função de abrir o menu */}
        <Header 
          pageTitle={pageTitle} 
          onToggleSidebar={toggleMobileMenu} 
        />

        {/* Conteúdo Principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;