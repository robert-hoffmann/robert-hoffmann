import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

function deferEntryStylesheetPlugin(): Plugin {
  return {
    name  : 'defer-entry-stylesheet',
    apply : 'build',
    transformIndexHtml : {
      order : 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet"([^>]*?)href="([^"]*\/assets\/[^"]+\.css)"([^>]*)>/g,
          `<link rel="preload" as="style"$1href="$2"$3 onload="this.onload=null;this.rel='stylesheet'">` +
          `<noscript><link rel="stylesheet"$1href="$2"$3></noscript>`,
        )
      },
    },
  }
}

export default defineConfig({
  base    : '/',
  plugins : [
    vue(),
    tailwindcss(),
    deferEntryStylesheetPlugin(),
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
