import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { loadEnv } from 'vite';

export default defineConfig(({mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    base: mode === 'production' ? '/production/' : '/',
    build: {
      outDir: mode === 'production' ? 'production' : 'dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      open: true,
      cors: true,
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_API_URL),
    },
  };
});
