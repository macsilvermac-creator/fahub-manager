declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    /* Fix: Inlined aistudio methods to resolve duplicate identifier errors for hasSelectedApiKey and openSelectKey caused by named interface collision */
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