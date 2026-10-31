import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.')

  return {
    plugins: [react()],
    server: {
      // Admin API goes through the site's own origin (like the Vercel rewrite in production),
      // so the admin session cookie is first-party. preview.proxy reuses this.
      proxy: {
        '/api/admin': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
  }
})
