
import React, { useEffect } from 'react';
import { CheckCircleIcon, AlertTriangleIcon, AlertCircleIcon, XIcon, SparklesIcon } from './icons/UiIcons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertCircleIcon className="w-5 h-5 text-red-400" />;
      case 'warning': return <AlertTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'info': return <SparklesIcon className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-green-500/50';
      case 'error': return 'border-red-500/50';
      case 'warning': return 'border-yellow-500/50';
      case 'info': return 'border-blue-500/50';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl bg-secondary border-l-4 ${getBorderColor()} shadow-2xl mb-3 animate-fade-in min-w-[300px] max-w-md relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-black/40 -z-10"></div>
      <div className="shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{message}</p>
      </div>
      <button 
        onClick={() => onClose(id)}
        className="text-white/50 hover:text-white transition-colors"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;