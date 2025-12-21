// Fix: Removing failing reference to vite/client and providing explicit types for import.meta and process.env
interface ImportMetaEnv {
  readonly API_KEY: string;
  readonly MODE: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly API_KEY: string;
  }
}
