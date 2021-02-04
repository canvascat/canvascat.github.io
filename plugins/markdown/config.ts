import Config from 'markdown-it-chain';
import anchorPlugin from 'markdown-it-anchor';
import { slugify } from 'transliteration';
import hljs from 'highlight.js'
import containers from './containers';
import overWriteFenceRule from './fence';

const config = new Config()

const highlight = (str, lang) => {
  if (!lang || !hljs.getLanguage(lang)) {
    return '<pre><code class="hljs">' + str + '</code></pre>'
  }
  const html = hljs.highlight(lang, str, true, undefined).value
  return `<pre><code class="hljs language-${lang}">${html}</code></pre>`
}

(config.options as any).html(true).highlight(highlight).end()
  .plugin('anchor').use(anchorPlugin, [
    {
      level: 2,
      slugify: slugify,
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    },
  ]).end()

  .plugin('containers').use(containers).end()

const md = config.toMd()
overWriteFenceRule(md)

export default md
