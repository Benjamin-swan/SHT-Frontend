import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true, // 5173이 사용 중이면 에러를 내서 알려줌 (조용히 5174로 넘어가지 않음)
  },
})
