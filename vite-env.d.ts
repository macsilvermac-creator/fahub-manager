declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  /* Fix: Declared AIStudio interface to resolve type mismatch error on Window interface */
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    /* Fix: Updated aistudio to use the AIStudio interface type to avoid Subsequent property declaration errors */
    aistudio?: AIStudio;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};