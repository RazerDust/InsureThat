import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite is the local development server and production bundler for the React app.
// The React plugin enables JSX, fast refresh, and React-specific build handling.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // During local development, browser calls to /api are forwarded to ASP.NET.
      // This keeps frontend code simple because it can use the same /api path in dev and production.
      '/api': 'http://127.0.0.1:5105',
    },
  },
})
