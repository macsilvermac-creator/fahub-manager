
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { MenuIcon, XIcon } from './icons/UiIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { syncService } from '../services/syncService';
import { ToastProvider } from '../contexts/ToastContext';

interface LayoutProps {
  children: React.ReactNode;
}

export interface UserContextType {
  currentRole: UserRole;
}

export const UserContext = React.createContext<UserContextType>({ currentRole: 'HEAD_COACH' });

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setRole] = useState<UserRole>('HEAD_COACH');
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
      // 1. Inicializa RAM
      storageService.initializeRAM();

      // 2. INJEÇÃO DE DEPENDÊNCIA (A mágica que destrava o VS Code)
      // Conectamos o storageService dentro do syncService aqui, evitando loop nos arquivos
      syncService.registerProcessor(async () => {
          return await storageService.syncFromCloud();
      });
      syncService.init();

      const u = authService.getCurrentUser();
      if(u) {
          setUser(u);
          setRole(u.role);
      }
  }, []);

  return (
    <UserContext.Provider value={{ currentRole }}>
      <div className="flex h-screen bg-primary text-text-primary">
        <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setSidebarOpen} 
          currentRole={currentRole}
          setRole={setRole}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header>
              <button 
                  onClick={() => setSidebarOpen(!isSidebarOpen)}
                  className="text-text-secondary focus:outline-none lg:hidden"
              >
                  {isSidebarOpen ? <XIcon /> : <MenuIcon />}
              </button>
          </Header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-primary p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Layout;