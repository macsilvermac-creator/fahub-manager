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
      target: 'esnext', // OTIMIZAÇÃO: Alvo moderno para melhor performance
      minify: 'esbuild', // OTIMIZAÇÃO: Minificação mais rápida e eficiente
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              // Separação agressiva de bibliotecas pesadas
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('recharts')) {
                return 'vendor-charts';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-ai';
              }
              return 'vendor-utils'; // todo o resto
            }
          }
        }
      }
    }
  };
});