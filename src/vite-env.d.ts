
// Manually define Vite types since vite/client is missing in this environment
interface ImportMetaEnv {
  readonly API_KEY: string;
  /* Fix: Added PROD and MODE to ImportMetaEnv to support pwaRegistration check */
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
