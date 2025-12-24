
/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

// Manually define Vite types since vite/client is missing in this environment
interface ImportMetaEnv {
  readonly API_KEY: string;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
