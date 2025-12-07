
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-bold text-text-secondary uppercase mb-1.5 ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full bg-secondary/50 border ${error ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-highlight focus:ring-highlight'} rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1 ml-1 animate-slide-down">{error}</p>}
    </div>
  );
};

export default Input;
