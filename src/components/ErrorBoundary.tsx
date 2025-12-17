
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon, RefreshIcon } from './icons/UiIcons';

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
    
    // AUTO-CURA: Erros de Chunk (comum em SPAs após deploy)
    // Se o navegador tentar carregar um arquivo JS que não existe mais no servidor (versão antiga),
    // forçamos um reload para pegar a versão nova.
    const chunkFailedMessage = /Loading chunk [\d]+ failed/;
    const importFailedMessage = /Importing a module script failed/;
    
    if (
        error.message && (
            chunkFailedMessage.test(error.message) || 
            importFailedMessage.test(error.message) ||
            error.message.includes('dynamically imported module')
        )
    ) {
        console.warn("⚠️ Erro de versão detectado. Atualizando sistema automaticamente...");
        // Pequeno delay para evitar loop infinito se o servidor estiver realmente fora
        setTimeout(() => {
             window.location.reload();
        }, 1000);
    }
  }

  private handleReload = () => {
      // Limpa caches agressivos antes de recarregar
      if ('caches' in window) {
          caches.keys().then((names) => {
              names.forEach((name) => caches.delete(name));
          });
      }
      window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] text-white p-6 animate-fade-in">
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-red-500/20 shadow-2xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Instabilidade Detectada</h2>
            <p className="text-[#cbd5e1] text-sm mb-6">
                O sistema encontrou um erro inesperado ou sua conexão foi interrompida durante uma atualização.
            </p>
            
            <div className="bg-black/30 p-3 rounded-lg text-[10px] font-mono text-left text-red-300 mb-6 overflow-auto max-h-32 border border-white/5 custom-scrollbar">
                {this.state.error?.message || "Erro desconhecido no renderizador React."}
            </div>

            <button
              className="bg-highlight hover:bg-highlight-hover text-white px-6 py-3 rounded-xl font-bold w-full transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              onClick={this.handleReload}
            >
              <RefreshIcon className="w-4 h-4" />
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
