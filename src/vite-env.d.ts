
/// <reference types="vite/client" />

// Fix: Merging with standard Vite types to avoid "identical modifiers" errors for MODE and PROD
interface ImportMetaEnv {
  readonly API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
