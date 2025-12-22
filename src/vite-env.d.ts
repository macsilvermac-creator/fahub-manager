// Manually define Vite types since vite/client is missing in this environment
interface ImportMetaEnv {
  readonly API_KEY: string;
  readonly MODE: string;
  readonly PROD: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
