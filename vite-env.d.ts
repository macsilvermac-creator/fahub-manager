declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    /* Fix: Define aistudio properties inline to avoid Duplicate identifier errors with global AIStudio interface */
    aistudio?: {
      hasSelectedApiKey(): Promise<boolean>;
      openSelectKey(): Promise<void>;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};
