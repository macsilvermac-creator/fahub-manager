
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// Correção para __dirname em ES Modules (necessário pois package.json tem "type": "module")
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: false,
      // Configuração simplificada para garantir o build
      rollupOptions: {
        output: {
          manualChunks: undefined // Deixa o Vite decidir automaticamente para evitar erros
        }
      }
    }
  };
});
