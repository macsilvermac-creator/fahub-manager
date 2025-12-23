import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Usamos App.tsx para evitar conflitos de casing com Main.tsx/main.tsx
import * as pwaRegistration from './pwaRegistration';
import './global.css'; // Importamos o estilo global correto

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

pwaRegistration.register();