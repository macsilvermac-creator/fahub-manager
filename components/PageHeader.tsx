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
    <div className="flex flex-col mb-2 gap-1 animate-fade-in no-print">
      <div className="flex justify-between items-center">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-[9px] font-black text-highlight uppercase tracking-[0.2em] hover:opacity-70 transition-all w-fit group"
          >
            <span className="rotate-180 inline-block mr-1 group-hover:-translate-x-1 transition-transform">
              <ChevronRightIcon className="w-2.5 h-2.5" />
            </span>
            Voltar
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-highlight rounded-full"></div>
        <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
            {subtitle && <p className="text-text-secondary text-[9px] font-bold uppercase tracking-widest mt-1 opacity-50">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;