
import React, { useState, useEffect } from 'react';
import { BellIcon, ChevronDownIcon, WifiIcon, WifiOffIcon } from './icons/UiIcons';

interface HeaderProps {
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-secondary border-b border-accent">
      <div className="flex items-center">
        {children}
        <h1 className="text-xl font-semibold text-text-primary ml-4 hidden sm:block">Painel do Time</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div 
            className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${isOnline ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
        >
            {isOnline ? <WifiIcon className="w-4 h-4" /> : <WifiOffIcon className="w-4 h-4" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        <button className="p-2 text-text-secondary rounded-full hover:bg-accent hover:text-text-primary">
          <BellIcon />
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
            <img className="h-8 w-8 rounded-full object-cover" src="https://ui-avatars.com/api/?name=Admin" alt="User avatar" />
            <span className="hidden md:block text-text-primary">Admin</span>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;