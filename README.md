```bash
git checkout -b pages
git add -f dist 
git commit -m 'update pages'
git subtree push --prefix dist origin gh-pages
```

vuedx-typecheck issue

VueDX59001: Cannot find a global component matching

vuedx-typecheck 并不会使用 `tsconfig.include`