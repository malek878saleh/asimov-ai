import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://77.237.240.94:8000',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://77.237.240.94:8000',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
