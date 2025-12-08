import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[400px] animate-fade-in">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 bg-highlight/20 rounded-xl animate-ping"></div>
        <div className="relative w-16 h-16 bg-secondary rounded-xl border border-highlight flex items-center justify-center shadow-glow">
           <span className="text-highlight font-black text-2xl">FH</span>
        </div>
      </div>
      <p className="text-text-secondary text-sm font-bold animate-pulse">Carregando Módulo...</p>
    </div>
  );
};

export default LoadingScreen;