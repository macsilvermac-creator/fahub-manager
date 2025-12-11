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
      target: 'esnext',
      minify: 'esbuild',
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 2000, 
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
                if (id.includes('react')) return 'vendor-react';
                if (id.includes('firebase')) return 'vendor-firebase';
                if (id.includes('recharts')) return 'vendor-charts';
                if (id.includes('@google/genai')) return 'vendor-ai';
                return 'vendor-core'; // Todo o resto vai pra cá
            }
            // Separação de Módulos Internos (Lazy Load Real)
            if (id.includes('src/pages/Finance')) return 'page-finance';
            if (id.includes('src/pages/Recruitment')) return 'page-recruitment';
            if (id.includes('src/pages/VideoAnalysis')) return 'page-video';
            if (id.includes('src/pages/TacticalLab')) return 'page-tactics';
            if (id.includes('src/pages/Logistics')) return 'page-logistics';
            if (id.includes('src/pages/Inventory')) return 'page-inventory';
          }
        }
      }
    }
  };
});
