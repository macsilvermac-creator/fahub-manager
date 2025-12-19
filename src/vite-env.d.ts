// Fix: Manually defined the Vite environment variables and the ImportMeta interface 
// to resolve the 'vite/client' reference error and the missing 'PROD' property error 
// in src/pwaRegistration.ts. This replaces the problematic triple-slash reference 
// while ensuring all standard and custom environment variables are typed.
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
