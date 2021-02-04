// import MarkdownIt from 'markdown-it'

import { Plugin} from 'vite'
import { stripScript, stripTemplate, stripStyle, genInlineComponentText } from './util';
import md from './config';
// import { promisify } from 'util';
// import { writeFile } from 'fs';
// import { basename, extname, join } from 'path';
// import { parseVueRequest } from '@vitejs/plugin-vue';

function compileMdFileToVueJS (source) {
  const content = md.render(source)

  const startTag = '<!--element-demo:'
  const startTagLen = startTag.length
  const endTag = ':element-demo-->'
  const endTagLen = endTag.length

  let componenetsString = ''
  let id = 0 // demo 的 id
  let output = [] // 输出的内容
  let start = 0 // 字符串开始位置
  let pageStyle = ''

  let commentStart = content.indexOf(startTag)
  let commentEnd = content.indexOf(endTag, commentStart + startTagLen)
  while (commentStart !== -1 && commentEnd !== -1) {
    output.push(content.slice(start, commentStart))

    const commentContent = content.slice(commentStart + startTagLen, commentEnd)
    const html = stripTemplate(commentContent)
    const script = stripScript(commentContent)
    pageStyle += stripStyle(commentContent) + '\n'
    let demoComponentContent = genInlineComponentText(html, script)
    const demoComponentName = `element-demo${id}`
    output.push(`<template #source><${demoComponentName} /></template>`)
    componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`

    // 重新计算下一次的位置
    id++
    start = commentEnd + endTagLen
    commentStart = content.indexOf(startTag, start)
    commentEnd = content.indexOf(endTag, commentStart + startTagLen)
  }

  // 仅允许在 demo 不存在时，才可以在 Markdown 中写 script 标签
  // todo: 优化这段逻辑

  let pageScript = '\n'
  if (componenetsString) {
    pageScript +=`<script lang="ts">
      import * as Vue from 'vue';
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        }
      }
    </script>`
  } else if (content.indexOf('<script>') === 0) { // 硬编码，有待改善
    start = content.indexOf('</script>') + '</script>'.length
    pageScript += content.slice(0, start)
  }

  output.push(content.slice(start))
  const result = `<template>
    <section class="page page-post">
      ${output.join('')}
    </section>
  </template>
  ${pageScript}
  <style>
  ${pageStyle}
  </style>
  `

  return result
}

// const md = new MarkdownIt()
const fileRegex = /\.(md)$/

export default function markdownPlugin():Plugin {
  return {
    name: 'transform-md',

    transform (src, id) {
      // const { filename, query } = parseVueRequest(id)
      console.log(id)
      // if (id.includes('?vue')) console.log(src)
      if (fileRegex.test(id)) {
        // src = md.render(src)
        // return `export default ${JSON.stringify({ src, id })};`
        src = compileMdFileToVueJS(src)
        // const ext = extname(id)
        // const newName = `${basename(id, ext)}.vue`
        // const outPath = join(__dirname, 'src/posts', newName)
        // promisify(writeFile)(outPath, src, { flag: 'w+' }).catch(error => console.log(outPath, error.message))
        return src
        // return {
        //   code: `export default ${JSON.stringify({ src: compileMdFileToVueJS(src), id })};`,
        //   map: null // provide source map if available
        // }
      }
    }
  }
}