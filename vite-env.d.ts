declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  /* Fix: Declaring AIStudio interface to resolve type mismatch on Window object and allow merging with global types */
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    /* Fix: Property 'aistudio' must use the named type 'AIStudio' to match existing declarations in the environment and resolve subsequent declaration errors */
    aistudio: AIStudio;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};