import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as pwaRegistration from './pwaRegistration';
import './index.css'; // Assegurando que o CSS (Tailwind) seja carregado se existir, ou ignorado pelo build se configurado via CDN no HTML

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Ativa o Service Worker para transformar em PWA
pwaRegistration.register();
