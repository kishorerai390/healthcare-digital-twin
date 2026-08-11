import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true, // Listen on all local IP addresses for mobile phone access
    port: 5173
  }
})
