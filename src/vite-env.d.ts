// Fix: Removed problematic reference to 'vite/client' to resolve the "Cannot find type definition file" error.
// The ImportMeta and ImportMetaEnv interfaces are manually declared below to ensure Vite's environment types are available.
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
