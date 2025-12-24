declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  /* Fix: Declare AIStudio interface to match the global type expected by the environment and allow interface merging if necessary */
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    /* Fix: Use the named AIStudio interface for the aistudio property on Window to resolve the type mismatch error with other global declarations */
    aistudio: AIStudio;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};
