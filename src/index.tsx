
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';
import * as serviceWorkerRegistration from '@/serviceWorkerRegistration';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <Main />
);

// Ativa o Service Worker para cache agressivo e funcionamento offline
serviceWorkerRegistration.register();
