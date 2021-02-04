import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { join } from 'path'
import mdPlugin from './plugins/markdown';

export default defineConfig({
  plugins: [mdPlugin(), vue({
    include: [/\.vue$/, /\.md$/],
  })],
  alias: [{
    find: '@',
    replacement: join(__dirname, 'src')
  }]
})
