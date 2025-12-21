
// Fix: Removed reference to vite/client that failed to be found and manually defined env properties
interface ImportMetaEnv {
  readonly API_KEY: string;
  readonly MODE: string;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
