```bash
git checkout -b pages
git add -f dist 
git commit -m 'update pages'
git subtree push --prefix dist origin gh-pages
```