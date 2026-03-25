import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/OBA-Unblocked-Games-v2/",
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
});
