
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { MenuIcon, XIcon } from './icons/UiIcons';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
}

export const UserContext = React.createContext<{ currentRole: UserRole }>({ currentRole: 'HEAD_COACH' });

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setRole] = useState<UserRole>('HEAD_COACH');
  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
      const u = authService.getCurrentUser();
      if(u) {
          setUser(u);
          setRole(u.role);
      }
      
      // Auto-Sync Trigger
      const syncData = async () => {
          await storageService.syncFromCloud();
      };
      syncData();
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
