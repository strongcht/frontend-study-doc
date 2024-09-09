## vue-router

#### 介绍

**Vue Router** 是 Vue.js 的官方路由。它与 Vue.js 核心深度集成，让用 Vue.js 构建单页应用变得轻而易举。功能包括：

- 嵌套路由映射
- 动态路由选择
- 模块化、基于组件的路由配置
- 路由参数、查询、通配符
- 展示由 Vue.js 的过渡系统提供的过渡效果
- 细致的导航控制
- 自动激活 CSS 类的链接
- HTML5 `history` 模式或 `hash` 模式
- 可定制的滚动行为
- URL 的正确编码

#### 安装

##### npm

```sh
npm install vue-router@4

```

##### yarn

```sh
yarn add vue-router@4

```

[vueRouter4使用](https://segmentfault.com/a/1190000044949480)


[vue router 4 源码篇：路由诞生——createRouter原理探索](https://juejin.cn/post/7144890513143889950)

[vue router 4 源码篇：路由matcher的前世今生](https://juejin.cn/post/7145742001764319240)

[vue router 4 源码篇：router history的原生结合](https://juejin.cn/post/7146408382251925540)

[vue router 4 源码篇：导航守卫该如何设计（一）](https://juejin.cn/post/7152721037870759972)

[vue router 4 源码篇：导航守卫该如何设计（二）](https://juejin.cn/post/7153958470499172382)

#### 导航守卫：

+ 全局守卫： `beforeEach、beforeResolve、afterEach`
+ 路由独享： `beforeEnter`
+ 组件内的守卫：`beforeRouteEnter、 beforeRouteUpdata、beforeRouteLeave`

执行顺序：
`beforeRouteLeava` -> `beforeEach` -> `beforeRouteUpdate` -> `beforeEnter` -> `beforeRouteEnter` -> `beforeReslove` -> `afterEach`

###### 完整的导航解析流程
1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。