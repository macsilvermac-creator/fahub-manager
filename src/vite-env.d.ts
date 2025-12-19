/// <reference types="vite/client" />

// Fix: Restored the built-in Vite client types and removed manual declarations of standard 
// environment variables (PROD, DEV, etc.) to resolve modifier and optionality mismatch errors.
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
