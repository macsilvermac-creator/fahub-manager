
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_KEY: string;
  readonly MODE: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
