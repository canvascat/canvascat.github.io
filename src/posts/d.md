---
title: vue-router 下 iframe 的重载问题
---

最近项目中需要使用到内嵌网页，最开始本来是考虑使用 `webview` 标签，但是 👉

> Electron 的 `webview` 标签基于 [Chromium webview </0>](https://developer.chrome.com/docs/extensions/reference/webviewTag/) ，后者正在经历巨大的架构变化。 这将影响 `webview` 的稳定性，包括呈现、导航和事件路由。 我们目前建议不使用 `webview` 标签，并考虑其他替代方案，如 `iframe` 、Electron 的 `BrowserView` 或完全避免嵌入内容的体系结构。

而 `BrowserView` 则是由 Electron 主进程控制，调用成本较高，并且是置于窗口的最顶层，会覆盖父窗口的 tooltip，效果不理想，最后就只有 `iframe` 可供使用。但是使用过程中发现，当路由切换后，iframe 会重载，里面的所有状态都会重置。首先想到 vue-router 的问题，当切换回路由时组件重新渲染，导致 iframe 重载。但项目由于要保存路由状态，使用了 `keep-alive`。

`<keep-alive>` 本质上它就是去缓存已经创建过的 `vnode`，而缓存的 `vnode` 对象也会持有 DOM，因此 DOM 并不会销毁。既然 DOM 还是原来的 DOM，那为什么 `iframe` 中的内容会重载呢 😢。试着在 vue-router 的 issue 下查找关于 iframe 的问题，基本都是 [route with iframe changes the iframe then the page when hitting back](https://github.com/vuejs/vue-router/issues/2403) 之类的问题，没有较好的解决方案。

最后在看了下 [MDN 上关于 `iframe` 的介绍](https://developer.mozilla.org/zh-cn/docs/web/html/element/iframe) ：

> **HTML 内联框架元素 (`<iframe>`)** 表示嵌套的 [browsing context](https://developer.mozilla.org/en-US/docs/Glossary/browsing_context)。它能够将另一个 HTML 页面嵌入到当前页面中。
> 每个嵌入的浏览上下文（embedded browsing context）都有自己的会话历史记录 (session history) 和 **DOM 树**。包含嵌入内容的浏览上下文称为 _父级浏览上下文_。顶级浏览上下文（没有父级）通常是由 `Window` 对象表示的浏览器窗口。

莫非 iframe 的加载和所在 DOM 树也有关系？首先看看 iframe 的 load 时机：

```js
(() => {
  const el = document.createElement('iframe');
  el.onload = () => console.log('el load', el);
  el.src = 'http://nodejs.cn/';
  setTimeout(() => {
    document.documentElement.appendChild(el);
    console.log('body append el -> ', el);
  }, 5000);
})();
```

![image](https://user-images.githubusercontent.com/31235016/105283696-f1f8f900-5beb-11eb-97cd-b8462dc52c9d.png)

可以看到在 `iframe` 被插入 `document` 之后才触发 load 事件，而同为 [可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element) 的 img 元素则是在更新 `src` 属性后就会触发 load 事件，可能就是因为这个 `browsing context` 和所在 DOM 树有关。

现在来模拟一下 vue-router 中使用 `keep-alive` 的情况：

```html
<button id="remove">remove</button> <button id="append">append</button>
<hr />
<main>
  <iframe
    id="iframe"
    src="http://nodejs.cn/"
    width="100%"
    height="600px"
    frameborder="0"
  ></iframe>
</main>
<script>
  const $iframe = document.querySelector('#iframe');
  const $remove = document.querySelector('#remove');
  const $append = document.querySelector('#append');
  const $main = $iframe.parentNode;
  $remove.onclick = () => $iframe.remove();
  $append.onclick = () => $main.appendChild($iframe);
  $iframe.addEventListener('load', (e) => {
    console.log('load ->', e);
  });
</script>
```

在离开路由时，iframe 会从 DOM 树中移除，但依然会保留在 vNode 中，不会被垃圾回收机制回收掉。这里点击 remove 按钮移除并保存在变量 `$iframe` 中。
然后进入路由后，通过 vNode 的缓存重新将元素节点插回 DOM 树中。这里点击 append 按钮插到 `<main>` 节点下。

![image](https://user-images.githubusercontent.com/31235016/105284707-fa523380-5bed-11eb-9471-036a735e8589.png)

可以看到在进入页面后 load 一次，执行以上操作之后又 load 了一次。
我们 remove 操作前后在控制台输入 `$iframe.contentWindow` ，

![image](https://user-images.githubusercontent.com/31235016/105284888-4f8e4500-5bee-11eb-80e3-34c3617570a4.png)

发现 iframe 在离开 DOM 树后 window 对象为 null，可以说明子窗口已被销毁，通过对比也可以发现前后两个 window 并不相同。

回到最开始的问题，如何在 vue-router 下使用 iframe 并在切换路由时不重载？
首先 `keep-alive` 是必须使用的，保证组件状态不变。iframe 元素加载后不能脱离 DOM 树，这里考虑在将 iframe 所在的节点移动到 `document.documentElement` 下，再去通过 css 修改元素的位置（这里我使用`position: fixed;` 控制位置，`z-index` 控制显示层级）以及显示状态。

```js
// 使用 v-show="active" 来控制 this.$refs.xxx 的显示
export default {
  data() {
    return {
      active: true,
    };
  },

  activated() {
    this.active = true;
  },

  deactivated() {
    this.active = false;
  },

  mounted() {
    document.documentElement.appendChild(this.$refs.xxx);
  },

  beforeDestroy() {
    document.documentElement.removeChild(this.$refs.xxx);
  },
};
```
