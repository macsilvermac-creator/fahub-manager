
/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

import * as React from 'react';

// Fix: Ensuring JSX IntrinsicElements are recognized by TypeScript in the src context
declare global {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
        [elemName: string]: any;
    }
  }
}

interface ImportMetaEnv {
  readonly API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
