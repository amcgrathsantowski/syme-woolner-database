import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from '../pwa.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig)],
  build: {
    outDir: './public/dist',
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
});
