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
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        timeout: 120000, // 2 minutos
        proxyTimeout: 120000,
      }
    }
  }
})