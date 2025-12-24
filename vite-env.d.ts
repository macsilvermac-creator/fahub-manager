// Fix: Defined AIStudio interface as it is referenced in global window declarations
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    // Fix: Removed 'readonly' modifier and changed type from 'any' to 'AIStudio' to match external declarations and fix identical modifier/type errors
    aistudio: AIStudio;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};
