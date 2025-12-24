declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  /* Fix: AIStudio interface and window.aistudio property are already defined by the platform environment. 
     Removing these duplicate declarations to resolve "Duplicate identifier" and "identical modifiers" errors. */

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};
