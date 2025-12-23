import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as pwaRegistration from './pwaRegistration';
import './index.css'; 

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
