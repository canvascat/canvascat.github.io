import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { basename, join, extname } from 'path'
// import { readdir } from 'fs'
// import { promisify } from 'util'
import mdPlugin from './plugins/markdown'
import { sync } from 'glob'

const p = sync('src/posts/*.md').map(entry => [entry, basename(entry, extname(entry))]);
console.log(p)

export default defineConfig({
  plugins: [mdPlugin(), vue({
    include: [/\.vue$/, /\.md$/],
  })],
  alias: [{
    find: '@',
    replacement: join(__dirname, 'src')
  }]
})
