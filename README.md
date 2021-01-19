```bash
git checkout -b pages
git add -f dist 
git commit -m 'update pages'
git subtree push --prefix dist origin gh-pages
```

## issue
vuedx-typecheck issue

VueDX59001: Cannot find a global component matching

vuedx-typecheck 并不会使用 `tsconfig.include`

vite 使用 stylus hot updated 存在问题 提示不全
chrome-extension://mnbndgmknlpdjdnjfmfcdjoegcckoikn/js/content.js 55
for (const rules of Array.from(sheet.cssRules)) {

## TODO

- [ ] vite markdown plugin
- [ ] 样式布局
