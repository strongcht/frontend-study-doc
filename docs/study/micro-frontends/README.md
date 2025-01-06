[微前端学习系列(一)：微前端介绍](https://juejin.cn/post/6955341801381167112)
[微前端学习系列(二)：single-spa](https://juejin.cn/post/6955342063235760164)
[微前端学习系列(三)：qiankun](https://juejin.cn/post/6955342295998660615) [qiankun官网](https://qiankun.umijs.org/zh)

[微前端](https://www.zhihu.com/column/c_1662872392362582016)

[微前端: qiankun、wujie和Micro App等框架对比](https://lianpf.github.io/posts/frontend-develop/microfrontend_framework_compare/)

[可能是你见过最完善的微前端解决方案](https://zhuanlan.zhihu.com/p/78362028)
[微前端的核心价值](https://zhuanlan.zhihu.com/p/95085796)
[Why Not Iframe](https://www.yuque.com/kuitos/gky7yw/gesexv)

微前端带给了我们什么？
+ 简单、分离、松耦合的代码仓库
+ 独立开发部署
+ 技术栈无关
+ 遗留系统、巨石应用拆分

js隔离
+ iframe 天然的js css隔离
+ Proxy 代理 window , 对浏览器版本有要求
+ sandbox 快照 用一个变量记录当前 子应用对window的修改 卸载是在恢复 在加载再恢复

css隔离
+ 基于web component 的shandow dom 天然的样式隔离 ， 浏览器支持问题
+ 自动给各个 子应用添加样式前缀或者统一开发约定等实现样式隔离
+ 挂载子应用时记录添加的css 卸载时移除

why not iframe 
> iframe 最大的特性就是提供了浏览器原生的硬隔离方案，不论是样式隔离、js 隔离这类问题统统都能被完美解决。但他的最大问题也在于他的隔离性无法被突破，导致应用间上下文无法被共享，随之带来的开发体验、产品体验的问题。

+ url 不同步。浏览器刷新 iframe url 状态丢失、后退前进按钮无法使用。
+ UI 不同步，DOM 结构不共享。想象一下屏幕右下角 1/4 的 iframe 里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器 resize 时自动居中..
+ 全局上下文完全隔离，内存变量不共享。iframe 内外系统的通信、数据同步等需求，主应用的 cookie 要透传到根域名都不同的子应用中实现免登效果。
+ 慢。每次子应用进入都是一次浏览器上下文重建、资源重新加载的过程。

目前的微前端方案
+ iframe
+ single-spa
+ qiankun（阿里）
+ web federation
+ web component
+ wujie （腾讯）
+ micra-app (jd) 
+ garfish (字节)

#### 一、qiankun
[qiankun官网](https://qiankun.umijs.org/zh/guide)


