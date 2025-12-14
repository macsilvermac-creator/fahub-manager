
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './Main';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
    <Main />
);

// Se quiser que seu app funcione offline e carregue mais rápido, troque
// unregister() para register() abaixo. Note que isso vem com algumas armadilhas.
// Saiba mais sobre service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
    