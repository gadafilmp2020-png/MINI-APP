import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Defines process.env for the Gemini Service to work without crashing in browser if not shimmed
    'process.env': process.env
  }
});