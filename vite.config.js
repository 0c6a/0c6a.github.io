import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxies any data fetch calls to bypass CORS blocks
      '/api-profile': {
        target: 'https://guns.lol',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-profile/, '/Xday'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    }
  }
});