
import React, { useState, useEffect } from 'react';
import { BellIcon, ChevronDownIcon, WifiOffIcon, RefreshIcon, CheckCircleIcon, AlertCircleIcon, MenuIcon } from './icons/UiIcons';
import { syncService } from '../services/syncService';
import { authService } from '../services/authService';
import LazyImage from './LazyImage';

interface HeaderProps {
    children?: React.ReactNode;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ children, onMenuClick }) => {
  const [syncStatus, setSyncStatus] = useState<'SAVED' | 'SYNCING' | 'OFFLINE' | 'ERROR'>('SAVED');
  const user = authService.getCurrentUser();

  useEffect(() => {
    const unsubscribe = syncService.subscribe((status: any) => {
        setSyncStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const getStatusDisplay = () => {
      switch(syncStatus) {
          case 'SAVED': return { icon: <CheckCircleIcon className="w-3 h-3" />, text: 'Salvo', color: 'text-green-400 border-green-500/20 bg-green-500/10' };
          case 'SYNCING': return { icon: <RefreshIcon className="w-3 h-3 animate-spin" />, text: 'Sincronizando...', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' };
          case 'OFFLINE': return { icon: <WifiOffIcon className="w-3 h-3" />, text: 'Offline (Local)', color: 'text-gray-400 border-gray-500/20 bg-gray-500/10' };
          case 'ERROR': return { icon: <AlertCircleIcon className="w-3 h-3" />, text: 'Erro no Sync', color: 'text-red-400 border-red-500/20 bg-red-500/10' };
          default: return { icon: null, text: '', color: '' };
      }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-b border-white/5 shadow-sm">
      <div className="flex items-center">
        <button 
            onClick={onMenuClick}
            className="p-2 text-text-secondary hover:text-white lg:hidden"
        >
            <MenuIcon />
        </button>
        {children}
        <h1 className="text-xl font-semibold text-white ml-4 hidden sm:block">Painel do Time</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors uppercase tracking-wider ${statusDisplay.color}`}>
            {statusDisplay.icon}
            <span>{statusDisplay.text}</span>
        </div>

        <button className="p-2 text-text-secondary rounded-full hover:bg-white/5 hover:text-white transition-colors relative">
          <BellIcon />
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
            <LazyImage 
                className="h-8 w-8 rounded-full object-cover border border-white/10" 
                src={user?.avatarUrl || "https://ui-avatars.com/api/?name=User"} 
                alt="User avatar" 
            />
            <span className="hidden md:block text-white text-sm font-medium">{user?.name?.split(' ')[0] || 'Usuário'}</span>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;