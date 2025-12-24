
/// <reference types="vite/client" />

/**
 * Fix: Explicitly augmenting the global JSX namespace to provide intrinsic elements definitions.
 * This resolves "Property '...' does not exist on type 'JSX.IntrinsicElements'" errors.
 * We list common tags to ensure they are available to the compiler even if React types are not fully loaded.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      p: any;
      aside: any;
      nav: any;
      button: any;
      header: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      img: any;
      main: any;
      section: any;
      article: any;
      input: any;
      select: any;
      option: any;
      form: any;
      label: any;
      textarea: any;
      a: any;
      ul: any;
      li: any;
      table: any;
      thead: any;
      tbody: any;
      tr: any;
      th: any;
      td: any;
      canvas: any;
      style: any;
      svg: any;
      path: any;
      circle: any;
      polyline: any;
      ellipse: any;
      defs: any;
      linearGradient: any;
      stop: any;
      hr: any;
      details: any;
      summary: any;
      iframe: any;
      strong: any;
      br: any;
      [elemName: string]: any;
    }
  }

  /**
   * Fix: Declaring the process.env global variable to satisfy Gemini API key requirements
   * and resolve build-time errors when accessing process.env.API_KEY.
   */
  var process: {
    env: {
      API_KEY: string;
      [key: string]: string | undefined;
    };
  };
}

interface ImportMetaEnv {
  readonly API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
