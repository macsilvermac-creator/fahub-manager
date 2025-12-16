
import React, { useState, useEffect } from 'react';
import { BellIcon, ChevronDownIcon, WifiOffIcon, RefreshIcon, CheckCircleIcon, AlertCircleIcon } from './icons/UiIcons';
import { syncService } from '../services/syncService';

interface HeaderProps {
    children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState<'SAVED' | 'SYNCING' | 'OFFLINE' | 'ERROR'>('SAVED');

  useEffect(() => {
    // Inscreve no serviço de sync para atualizações em tempo real
    const unsubscribe = syncService.subscribe((status: any) => {
        setSyncStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const getStatusDisplay = () => {
      switch(syncStatus) {
          case 'SAVED':
              return { icon: <CheckCircleIcon className="w-4 h-4" />, text: 'Salvo', color: 'text-green-400 border-green-500/20 bg-green-500/10' };
          case 'SYNCING':
              return { icon: <RefreshIcon className="w-4 h-4 animate-spin" />, text: 'Sincronizando...', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' };
          case 'OFFLINE':
              return { icon: <WifiOffIcon className="w-4 h-4" />, text: 'Offline (Local)', color: 'text-gray-400 border-gray-500/20 bg-gray-500/10' };
          case 'ERROR':
              return { icon: <AlertCircleIcon className="w-4 h-4" />, text: 'Erro no Sync', color: 'text-red-400 border-red-500/20 bg-red-500/10' };
      }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-[#0F172A] border-b border-white/5 shadow-sm">
      <div className="flex items-center">
        {children}
        <h1 className="text-xl font-semibold text-white ml-4 hidden sm:block">Painel do Time</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Sync Status Indicator */}
        <div 
            className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${statusDisplay.color}`}
            title="Status da Nuvem"
        >
            {statusDisplay.icon}
            <span>{statusDisplay.text}</span>
        </div>

        <button className="p-2 text-text-secondary rounded-full hover:bg-white/5 hover:text-white transition-colors">
          <BellIcon />
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/5 transition-colors">
            <img className="h-8 w-8 rounded-full object-cover border border-white/10" src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User avatar" />
            <span className="hidden md:block text-white text-sm font-medium">Admin</span>
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;