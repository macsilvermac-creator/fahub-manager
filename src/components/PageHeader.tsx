mport React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from './icons/UiIcons';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = memo(({ title, subtitle, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col mb-6 gap-2 animate-fade-in">
      {showBack && (
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-[10px] font-black text-highlight uppercase tracking-widest hover:opacity-70 transition-all w-fit group"
        >
          <span className="rotate-180 inline-block mr-1 group-hover:-translate-x-1 transition-transform">
            <ChevronRightIcon className="w-3 h-3" />
          </span>
          Voltar
        </button>
      )}
      <div>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
        {subtitle && <p className="text-text-secondary text-sm font-medium mt-1">{subtitle}</p>}
      </div>
    </div>
  );
});

export default PageHeader;