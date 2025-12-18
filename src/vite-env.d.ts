// Fix: Removed problematic vite/client reference and manually defined ImportMetaEnv with standard Vite properties (PROD, DEV, etc.) to resolve compilation errors
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SSR?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
