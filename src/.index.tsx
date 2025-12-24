
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './global.css';

// Fix: Declaring JSX namespace globally to resolve IntrinsicElements errors if types are not found or misconfigured
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
