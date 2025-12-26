import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, RefreshIcon } from './icons/UiIcons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mb-3 gap-1 animate-fade-in no-print">
      <div className="flex justify-between items-center">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[9px] font-black text-highlight uppercase tracking-[0.2em] hover:opacity-70 transition-all w-fit group"
          >
            <span className="rotate-180 inline-block mr-2 group-hover:-translate-x-1 transition-transform">
              <ChevronRightIcon className="w-2.5 h-2.5" />
            </span>
            Voltar para Base
          </button>
        )}
        
        {/* Botão de Retroceder sugerido para testes de UI */}
        <button 
          onClick={() => window.location.reload()} 
          className="lg:hidden flex items-center gap-1 text-[8px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors"
        >
          <RefreshIcon className="w-3 h-3" /> Reverter UI
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-7 w-1 bg-highlight rounded-full"></div>
        <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
            {subtitle && <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mt-1 opacity-50">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;