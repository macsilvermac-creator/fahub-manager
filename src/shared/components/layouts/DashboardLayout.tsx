// src/shared/components/layouts/DashboardLayout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './Sidebar'; // Importa o Sidebar que acabamos de criar

// Assumindo que o componente Header já existe em src/shared/components/common/Header.tsx
// e que ele aceita um prop 'pageTitle'
import Header from './Header'; 

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string; // Adiciona um prop para o título da página
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, pageTitle }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo Principal (Header + Children) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        {/* O Header foi movido para o layout para garantir que ele esteja sempre presente acima do conteúdo principal e possa receber o pageTitle */}
        <Header pageTitle={pageTitle} />

        {/* Área do Conteúdo Renderizado (children) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
