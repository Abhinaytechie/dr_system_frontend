import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/mappls-security': {
        target: 'https://outpost.mappls.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mappls-security/, ''),
      },
      '/mappls-atlas': {
        target: 'https://atlas.mappls.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mappls-atlas/, ''),
      },
    }
  }
})
