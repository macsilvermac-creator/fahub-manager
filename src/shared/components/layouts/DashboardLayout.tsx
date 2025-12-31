// src/shared/components/layouts/DashboardLayout.tsx
import React, { FC, ReactNode, useState } from 'react';
import Header from '@shared/components/Header'; // Assumindo que Header está neste caminho
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string; // Adicionado para permitir um título dinâmico na Header
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {/* Assumindo que o Header pode receber um prop para o "Hamburger menu" */}
        <Header pageTitle={pageTitle} onToggleSidebar={toggleSidebar} />

        {/* Área de conteúdo */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;