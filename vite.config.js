// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // طريقة لتمرير متغيرات بيئة Vite إلى ملفات SCSS
        additionalData: `
          $mode: "${process.env.NODE_ENV}";
        `
      }
    }
  }
})
