
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from './icons/UiIcons';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    
    // Auto-reload se for erro de chunk (comum após deploy ou falha de rede em dispositivos móveis)
    if (error.message && (error.message.includes('Loading chunk') || error.message.includes('Importing a module script failed'))) {
        console.warn("Chunk load error detected. Reloading...");
        // Opcional: window.location.reload(); 
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] text-white p-6">
          <div className="bg-gray-900 p-8 rounded-2xl border border-red-500/20 shadow-2xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Ops! Algo deu errado.</h2>
            <p className="text-gray-400 text-sm mb-6">
                O sistema encontrou um erro inesperado (provavelmente conexão). Tente recarregar a página.
            </p>
            <div className="bg-black/30 p-3 rounded text-xs font-mono text-left text-red-300 mb-6 overflow-auto max-h-32 border border-white/5">
                {this.state.error?.message || "Erro desconhecido"}
            </div>
            <button
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold w-full transition-all shadow-lg"
              onClick={() => {
                  window.location.reload();
              }}
            >
              Recarregar Sistema
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;