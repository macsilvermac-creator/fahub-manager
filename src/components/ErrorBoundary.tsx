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
  public state: State = { hasError: false };

  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B1120] text-white p-6">
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-red-500/20 shadow-2xl max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangleIcon className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Instabilidade Detectada</h2>
            <p className="text-[#cbd5e1] text-sm mb-6">
              O sistema encontrou um erro inesperado ou sua conexão foi interrompida.
            </p>
            <button
              className="bg-highlight hover:bg-highlight-hover text-white px-6 py-3 rounded-xl font-bold w-full transition-all shadow-lg flex items-center justify-center gap-2"
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