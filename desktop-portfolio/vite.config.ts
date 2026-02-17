import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig({
  base    : '/',
  plugins : [
    vue(),
    tailwindcss(),
    vitePrerenderPlugin({
      renderTarget    : '#app',
      prerenderScript : resolve(__dirname, 'prerender.ts'),
    }),
  ],
  build   : {
    rollupOptions : {
      output : {
        manualChunks : {
          three : ['three'],
        },
      },
    },
  },
})
