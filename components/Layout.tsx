import React, { useState, useEffect, createContext, useMemo } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

export interface UserContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const user = authService.getCurrentUser();
  const [currentRole, setRole] = useState<UserRole>(user?.role || 'MASTER');

  useEffect(() => {
    storageService.initializeRAM();
  }, []);

  const value = useMemo(() => ({ currentRole, setRole }), [currentRole]);

  return (
    <UserContext.Provider value={value}>
      <div className={`flex h-screen bg-primary text-text-primary transition-all duration-500`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setSidebarOpen} 
          currentRole={currentRole}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          {/* Alterado para overflow-y-auto para permitir rolagem global da página */}
          <main className="flex-1 overflow-y-auto bg-primary pt-3 px-4 lg:px-6 pb-10 custom-scrollbar flex flex-col">
            {children}
          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Layout;