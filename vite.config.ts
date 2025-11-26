import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.jikan.moe',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/v4')
      },
      '/jikan': {
        target: 'https://api.jikan.moe/v4',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/jikan/, '')
      }
    }
  }
})
