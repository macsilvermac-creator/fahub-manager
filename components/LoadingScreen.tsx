import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[400px] animate-fade-in bg-[#0B1120] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-[#0B1120] to-[#0B1120]"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-highlight/30 rounded-2xl animate-ping opacity-20"></div>
          <div className="absolute inset-0 bg-highlight/10 rounded-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 bg-secondary rounded-2xl border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.3)] transform rotate-3 hover:rotate-0 transition-all duration-500">
             <span className="text-highlight font-black text-4xl italic tracking-tighter">FH</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
            <h3 className="text-white font-black text-lg uppercase tracking-[0.2em] animate-pulse">
                FAHUB MANAGER
            </h3>
            <div className="flex items-center gap-2 justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-highlight animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-highlight animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-highlight animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-[10px] font-bold text-text-secondary uppercase">Carregando Módulo Tático</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;