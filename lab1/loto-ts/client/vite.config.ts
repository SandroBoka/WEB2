import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      "/login": "http://localhost:3000",
      "/logout": "http://localhost:3000",
      "/session": "http://localhost:3000",
      "/status": "http://localhost:3000",
      "/tickets": "http://localhost:3000",
      "/ticket": "http://localhost:3000",
      "/new-round": "http://localhost:3000",
      "/close": "http://localhost:3000",
      "/store-results": "http://localhost:3000",
    },
  },
});
