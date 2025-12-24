declare global {
  /* Moved AIStudio interface inside declare global to ensure it is part of the global namespace for interface merging */
  interface AIStudio {
    hasSelectedApiKey(): Promise<boolean>;
    openSelectKey(): Promise<void>;
  }

  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    /* Made optional to match the modifiers of existing declarations in the environment and resolve type mismatch errors */
    aistudio?: AIStudio;
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export {};
