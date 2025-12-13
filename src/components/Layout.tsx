
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { MenuIcon, XIcon } from './icons/UiIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { syncService } from '../services/syncService';
import LoadingScreen from './LoadingScreen';

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
      const initSystem = async () => {
          console.log("⚙️ System Booting...");
          
          // 1. User Setup & Context Enforcement
          const u = authService.getCurrentUser();
          if(u) {
              setUser(u);
              setRole(u.role);
              
              // REFORÇO DE CONTEXTO: Se der F5, garante que o programa esteja correto
              if (u.program && u.program !== 'BOTH') {
                   const currentProgram = storageService.getActiveProgram();
                   if (currentProgram !== u.program) {
                       storageService.setActiveProgram(u.program);
                   }
              }
          }

          // 2. Inicializa RAM (Síncrono)
          storageService.initializeRAM();
          
          // 3. Registra Sync (Async Background)
          syncService.registerProcessor(async () => {
              return await storageService.syncFromCloud();
          });
          syncService.init();

          // 4. Marca como pronto (Evita Race Condition nas pages filhas)
          setIsReady(true);
      };

      initSystem();
  }, []);

  if (!isReady) {
      return (
          <div className="h-screen w-screen bg-primary flex items-center justify-center">
              <LoadingScreen />
          </div>
      );
  }

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