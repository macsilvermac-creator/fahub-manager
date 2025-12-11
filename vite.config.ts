
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // @ts-ignore
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(cwd, './src'),
      },
    },
    define: {
      // CRÍTICO: Evita crash "process is not defined" em bibliotecas legadas
      'process.env': {
         API_KEY: JSON.stringify(env.API_KEY),
         NODE_ENV: JSON.stringify(mode)
      }
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1600, // Aumenta limite para evitar warnings irrelevantes
      rollupOptions: {
        output: {
          // Volta para o automático (mais seguro para Vercel)
          manualChunks: undefined 
        }
      }
    }
  };
});
