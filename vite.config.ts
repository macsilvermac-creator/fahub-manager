
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // @ts-ignore
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: [
        { find: '@', replacement: '/src' }
      ],
    },
    define: {
      // Define APENAS a chave específica, preservando o resto do env
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // NODE_ENV é gerenciado automaticamente pelo Vite
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-charts': ['recharts'],
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            'vendor-ai': ['@google/genai'],
          }
        }
      }
    }
  };
});
