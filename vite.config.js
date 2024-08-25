import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      external: ['buffer', 'tweetnacl'],
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer', // תוודא שהמודול buffer יופנה בצורה נכונה
    },
  },
})
