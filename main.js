const module = await import(
  "https://unpkg.com/svgo@3.3.2/dist/svgo.browser.js"
);
/** @type {import('svgo').optimize} */
const optimize = module.optimize;
await import("https://unpkg.com/xss@1.0.15/dist/xss.js");

const input = document.querySelector("input");

const current = Object.create(null);

input.addEventListener("change", async (event) => {
  const file = input.files?.item(0);
  if (file === current.file) return;
  current.file = file;
  if (!file) return;
  const content = await new Response(file).text();
  const output = optimize(content, {
    js2svg: {
      pretty: true,
      indent: 4,
    },

    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeUselessStrokeAndFill: {
              stroke: true,
              fill: true,
              removeNone: true,
            },
          },
        },
      },
      {
        name: "removeAttrs",
        params: {
          attrs: "fill",
        },
      },
    ],
  }).data;

  const markupElements = [...document.querySelectorAll(".markup")];
  markupElements[0].innerHTML = `<pre>${filterXSS(content)}</pre>`;
  markupElements[1].innerHTML = `<pre>${filterXSS(output)}</pre>`;

  const renderElements = [...document.querySelectorAll(".render")];
  renderElements[0].innerHTML = content;
  renderElements[1].innerHTML = output;
});

(function remTestSetup() {
  const wrap = document.querySelector("#rem-test");
  if (!wrap) return;
  wrap
    .querySelector("button")
    .addEventListener("click", () => [
      (document.documentElement.style.fontSize =
        wrap.querySelector("input").value),
    ]);
})();
