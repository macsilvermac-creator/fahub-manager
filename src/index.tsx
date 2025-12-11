
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("CRITICAL: Root element not found");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <Main />
      </React.StrictMode>
    );
  } catch (e) {
    console.error("CRITICAL: React Mount Failed", e);
    rootElement.innerHTML = `<div style="color:white; padding:20px; text-align:center;">
      <h1>Erro de Inicialização</h1>
      <p>Ocorreu um erro ao carregar o aplicativo. Tente recarregar a página.</p>
      <pre style="text-align:left; background:#333; padding:10px; overflow:auto;">${e}</pre>
    </div>`;
  }
}
