import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.resolve(__dirname, 'src')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': srcDir,
      '@app': path.join(srcDir, 'app'),
      '@pages': path.join(srcDir, 'pages'),
      '@features': path.join(srcDir, 'features'),
      '@shared': path.join(srcDir, 'shared'),
    },
  },
  server: {
    port: 5173,
    strictPort: true, // 5173이 사용 중이면 에러로 알림 (조용히 5174로 넘어가지 않음)
  },
})
