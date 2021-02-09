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

for (const rules of Array.from(sheet.cssRules)) {

```
[Vue warn]: Invalid prop: type check failed for prop "mousePoint". Expected Object, got Null  
  at <InfoBox mousePoint=null canvas=null > 
  at <ImageEditor onVnodeUnmounted=fn<onVnodeUnmounted> ref=Ref< undefined > > 
  at <RouterView> 
  at <App>
```
```ts
export default defineComponent({
  props: {
    mousePoint: {
      type: Object as PropType<Nullable<Point>>,
      required: true
    }
  },
}
```

> 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)

## TODO

- [x] vite markdown plugin
- [x] 样式布局
- [ ] 截图功能 DEMO
  - [x] 截图区域选取
  - [x] 截图信息
  - [ ] 截图工具
    - [ ] 马赛克
    - [ ] 画笔
    - [ ] 箭头、矩形、椭圆、直线。。。
    - [ ] 绘制步骤撤回

## NOTE

2019 年初在 Electron 基础上基于 Vue2 开发了截图，由于 Electron 的限制导致在各平台效果均不理想，最后还是使用了 QT 开发。
现阶段来看，v11 版的 Electron 解决了之前的部分问题，现准备使用 Vue3+vite 重写。
暂时先完成 web 截图 DEMO，vite 和 Electron 的集成也是个问题。
