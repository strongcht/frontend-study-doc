## 存放一些前端学习笔记的工程

> 使用 vitepress 构建的文档工程

## 运行

`yarn`
`yarn docs:dev`

## 构建

`yarn docs:build`

## 远程仓库

`https://github.com/strongcht/frontend-study-doc.git`

## 测试


```js
const viewModules = import.meta.glob('@/views/**/index.vue');

function loadView(routePath) {
  return viewModules[`/src/views${routePath}/index.vue`];
}

// 示例
const component = loadView(route.path);
```
