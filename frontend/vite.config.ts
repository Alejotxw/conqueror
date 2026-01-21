import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Permite que los archivos .js contengan JSX
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          // Agrega plugins para procesar JSX en archivos .js
        ],
      },
    })
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})