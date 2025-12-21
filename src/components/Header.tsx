
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from './icons/UiIcons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mb-8 gap-2 animate-fade-in no-print">
      {showBack && (
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[10px] font-black text-highlight uppercase tracking-[0.3em] hover:opacity-70 transition-all w-fit group"
        >
          <span className="rotate-180 inline-block mr-2 group-hover:-translate-x-1 transition-transform">
            <ChevronRightIcon className="w-3 h-3" />
          </span>
          Voltar para Base
        </button>
      )}
      <div className="flex items-center gap-4">
        <div className="h-10 w-1.5 bg-highlight rounded-full"></div>
        <div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
            {subtitle && <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mt-2 opacity-60">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
