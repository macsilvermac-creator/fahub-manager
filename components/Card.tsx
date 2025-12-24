
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', action }) => {
  return (
    <div className={`glass-panel rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-glow/20 ${className} bg-secondary border border-white/5`}>
      {title && (
        <div className={`p-5 border-b border-white/5 flex justify-between items-center ${titleClassName}`}>
          <h3 className="text-lg font-semibold text-text-primary tracking-wide">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;
