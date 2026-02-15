import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  server:{
    proxy:{
      '/api':{
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return

          if (id.includes('/node_modules/three/')) {
            return 'three'
          }

          if (id.includes('/node_modules/react/')) {
            return 'react'
          }

          if (id.includes('/node_modules/react-dom/')) {
            return 'react'
          }
        }
      }
    }
  }
})
