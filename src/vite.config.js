import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from '../pwa.config';
import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig)],
  build: {
    outDir: `${__dirname}/public/dist`,
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
});
