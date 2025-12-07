
import React from 'react';
import { PlayCircleIcon } from './icons/UiIcons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  isLoading, 
  fullWidth,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary";
  
  const variants = {
    primary: "bg-highlight hover:bg-highlight-hover text-white shadow-lg hover:shadow-glow focus:ring-highlight",
    secondary: "bg-secondary hover:bg-white/10 text-white border border-white/10 focus:ring-white/20",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/30 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-white/5 text-text-secondary hover:text-white",
    outline: "bg-transparent border-2 border-highlight text-highlight hover:bg-highlight hover:text-white"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon}
      {children}
    </button>
  );
};

export default Button;
