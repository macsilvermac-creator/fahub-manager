
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
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            // Separa bibliotecas grandes em chunks independentes
            vendor: ['react', 'react-dom', 'react-router-dom'],
            charts: ['recharts'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            ai: ['@google/genai']
          }
        }
      }
    }
  };
});
