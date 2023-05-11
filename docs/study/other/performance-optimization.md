# 前端性能优化的一些方法

将从三个角度（页面渲染，打包优化，总体优化）分析前端性能优化的一些方案。

# 1.页面渲染

## 1.1 减少页面重绘(repaint)和回流(reflow)

> 回流：计算可见节点的位置和几何信息; <br>
> 重绘：重新绘制节点，将渲染树的每个节点都转换为屏幕上的实际像素。

- 减少使用 css 属性简写，如：用 border-width, border-style, border-color 代替 border。因为 css 简写把所有值初始化为 initial，尽量不使用属性简写可以最小化重绘(repaint)和回流(reflow)，（实际工作中，由于 css 简写带来的性能影响微乎其微，再加上 css 全都展开写还会增加 code size，另外 css 简写还能解决一些样式覆盖的问题，写起来也比较简单快捷，所以实际工作个人怎么顺手怎么来就好～）

- 通过修改 className 批量修改元素样式；

- 复杂的动画元素定位要设置为 fixed 或 absoult，避免引起回流；

- 不使用 table 布局（table 元素一旦触发回流就会导致 table 里所有的其它元素回流）；

- DOM 元素上下移动用用 translate 替代 top 修改

- 需要创建多个 DOM 节点时，使用 DocumentFragment 一次性创建。

- css3 硬件加速（GPU 加速），它可以让 transform、opacity、filters 这些动画不会引起回流重绘。对于动画的其它属性，比如 background-color 这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能（但是不能滥用，会导致性能问题）。

- 元素适当地定义高度或最小高度，否则元素的动态内容载入时，会出现页面元素的晃动或位置，造成回流（比如图片要定义宽高，避免页面塌陷，同时减少回流）；

- 减少使用层级较深的选择器，或其他一些复杂的选择器，以提高 CSS 渲染效率；

- 在大量修改元素样式时，可以先用 display：none 将其隐藏，修改完再设置为 display：block，这样只会造成两次回流；

## 1.2 图片压缩，图片分割，精灵图

- **图片压缩**：开发中比较重要的一个环节，现在很多图床工具都自带压缩功能的。如果需要自己压缩的话，可以在 tinyPng [官网](https://tinypng.com/)压缩一下，一看就会；

- **图片分割**：如果页面需要加载一张效果图，比如真机渲染图，UI 设计师不允许压缩的时候，我们就可以将图片分割，然后再用 css 布局将图片拼接到一起。

- **精灵图**：与图片分割相反，精灵图是将很多小图片合并到一张大图里，这样加载页面的时候，只需要加载一张图片，就可以加载出来所有的页面元素。这样在一定程度上提高了页面加载速度。而我们使用精灵图的方式，也是通过定位，即通过` background-position` 来移动背景图，从而显示出我们想要显示出来的部分。 **但是**精灵图有个很大的不足，那就是牵一发而动全身，因为我们使用精灵图需要准确测量每个元素的位置，一旦要调整页面，将会是一项很麻烦的工作。

## 1.3 字体包压缩

- **问题描述**： 在做类似活动 h5 的时候，难免需要使用 @font-face 接口引入一些字体包，以达到丰富的页面效果。但是完整的字体包文件一般都很好几兆，加载页面时，不仅会阻塞页面渲染，还会导致文字开始不会显示，直至字体包加载完才会显示文字。

- **解决方式**： 可以使用 `font-spider`[参考](https://zhuanlan.zhihu.com/p/368968429) 字蛛将要使用到的文字提取出来。

## 1.4 懒加载/预加载资源

[参考](https://zhuanlan.zhihu.com/p/146977355)

- **懒加载**： 简言之就是只有当图片出现在浏览器的可视区域内时，才加载图片让图片显示出来（在此之前可以将所有图片元素的路径全都统一设置成一张 1\*1px 的占位图）。<br>
  **判断图片出现在浏览器可视区域的方法**：`图片距离顶部的高度（offsetTop） - 页面被卷去的高度（scrollTop） 〈= 浏览器的可视区域的高度（innerHeight）`

- **预加载**： Resource Hints(资源预加载)包括预连接、资源与获取、资源预渲染等。<br>
  **预加载的思路有如下两个**： 1.当前将要获取资源的列表; 2.通过当前页面或应用的状态、用户历史行为或 session 预测用户行为及必需的资源.<br>
  **实现 Resource Hints 的方法**有很多种，可分为基于 `link` 标签的 `DNS-prefetch、subresource、preload、 prefetch、preconnect、prerender`，和本地存储` localStorage`。详情可查看： 预加载 5 种不同的方法[地址](https://blog.csdn.net/Sncdma/article/details/109900138) 、 3 种 Javascript 图片预加载的方法[地址](https://juejin.cn/post/7049160255514607647)详解。

# 2.打包优化

## 2.1 webpack 优化 resolve.alias 配置（vite 同理）

`resolve.alias` 配置通过别名来将原导入路径映射成一个新的导入路径。可以起到两个作用：<br> 1.起别名；<br> 2.减少查找过程。
例如：

```js
resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
```

## 2.2 webpack 优化 resolve.extensions 配置（vite 同理）

`resolve.extensions` 代表后缀尝试列表，它也会影响构建的性能，默认是：
`extensions: ['.js', '.json']`<br>
例如遇到 `require('./data')`这样的导入语句时，Webpack 会先去寻找`./data.js` 文件，如果该文件不存在就去寻找`./data.json` 文件，如果还是找不到就报错。
<br>
【所以后缀尝试列表要尽可能的小，不要把项目中不可能存在的情况写到后缀尝试列表中，频率出现最高的文件后缀要优先放在最前面，以做到尽快的退出寻找过程。】
在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。<br>
例如在你确定的情况下把 `require('./data')`写成 `require('./data.json')`。

```js
resolve: {
    extensions: ['.js', '.vue', '.json'],
}
```

## 2.3 webpack 缩小 loader 范围

loader 是很消耗性能的一个点，我们在配置 loader 的时候，可以使用 include 和 except 来缩小 loader 执行范围，从而优化性能。例如：

```js
{
    test: /\.svg$/,
    loader: 'svg-sprite-loader',
    include: [resolve('src/icons')]
},
```

## 2.4 split chunks 代码分包

在没配置任何东西的情况下，webpack 4 就智能的帮你做了代码分包。
入口文件依赖的文件都被打包进了 `main.js`，那些大于 30kb 的第三方包，如：echarts、xlsx、dropzone 等都被单独打包成了一个个独立 bundle。
其它被我们设置了异步加载的页面或者组件变成了一个个 chunk，也就是被打包成独立的 bundle。它内置的代码分割策略是这样的：

- 新的 chunk 是否被共享或者是来自 node_modules 的模块;
- 新的 chunk 体积在压缩之前是否大于 30kb;
- 按需加载 chunk 的并发请求数量小于等于 5 个;
- 页面初始加载时的并发请求数量小于等于 3 个;

大家可以根据自己的项目环境来更改配置。
**webpack 配置代码如下**：

```js
splitChunks({
  cacheGroups: {
    vendors: {
      name: `chunk-vendors`,
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      chunks: "initial",
    },
    dll: {
      name: `chunk-dll`,
      test: /[\\/]bizcharts|[\\/]\@antv[\\/]data-set/,
      priority: 15,
      chunks: "all",
      reuseExistingChunk: true,
    },
    common: {
      name: `chunk-common`,
      minChunks: 2,
      priority: -20,
      chunks: "all",
      reuseExistingChunk: true,
    },
  },
});
```

没有使用 webpack4.x 版本的项目，可以通过按需加载的形式进行分包：
webpack 如何使用按需加载

**vite 配置代码如下：**

```js
 build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',  // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js',  // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]' // 资源文件像 字体，图片等
      }
    }
 }

```

## 2.5 tree shaking

**tree shaking**（摇树）。望文生义，它是用来清除我们项目中的一些无用代码，它依赖于 ES 中的模块语法得以实现。比如日常使用 lodash 的时候：

```js
import _ from "lodash";
```

如果如上引用 lodash 库，在构建包的时候是会把整个 lodash 包打入到我们的 bundle 包中的。

```js
import _isEmpty from "lodash/isEmpty";
```

如果如上引用 lodash 库，在构建包的时候只会把 isEmpty 这个方法抽离出来再打入到我们的 bundle 包中。

tree shaking 可以大大减少包体积，是性能优化中的重要一环。在 vite 和 webpack4.x 中都已经默认开启 tree-shaking。

```js
// 使用 ES Module 的模式引入,  且不需要 babel 编译
import { isEmpty } from "lodash-es";
```

## 2.6 vite 关闭一些打包配置项()

webpack 也有类似的配置，自行查阅

```js
build: {
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      //关闭文件计算
      reportCompressedSize: false,
      //关闭生成map文件 可以达到缩小打包体积
      sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
}
```

# 3.总体优化

## 3.1 SSR 服务端渲染

**SSR**(Server Side Rendering)，即服务端渲染。它指的是渲染过程在服务端完成，最终的渲染结果 HTML 页面通过 HTTP 协议发送给客户端，又叫“同构“。

SSR 主要带来的好处就是 SEO 和首屏加载速度大大提高。
目前流行的 Vue/React 前端框架，都已经推出了 SSR 的解决方案：
Vue 的 `nuxt.js`<br>
React 的 `next.js`

## 3.2 开启 gzip 压缩

Gzip 对文件进行压缩，能大大提高首屏加载速度，对于纯文本文件我们可以至少压缩到原大小的 40%。注意：图片最好不要进行 gzip 压缩！

![图片](/images/other/1.jpg)

为了减轻服务器压力，我们可以在打包时就生成 gzip 压缩文件，具体操作如下：

第一步，在 vue 项目中安装依赖并将 productionGzip 改为 true，开启 Gzip 压缩：npm install --save-dev compression-webpack-plugin

![图片](/images/other/2.jpg)

第二步，运行 npm run build 打包项目，这时可能会报错，提示 ValidationError: Compression Plugin Invalid Options。根据官网提示，需要将 CompressionWebpackPlugin 的设置由 asset 改为 filename。

![图片](/images/other/3.jpg)

![图片](/images/other/4.jpg)

第三步，npm run build 打包项目，生成.gz 文件即为成功

## 3.3 Brotli 算法压缩

Brotli 压缩算法 是 Google 2015 年推出的无损压缩算法。

- 启用 Brotli 压缩算法，对比 Gzip 压缩 CDN 流量再减少 20%。

- 针对常见的 Web 资源内容，Brotli 的性能相比 Gzip 提高了 17-25%；

- 当 Brotli 压缩级别为 1 时，压缩率比 Gzip 压缩等级为 9（最高）时还要高；

- 在处理不同 HTML 文档时，Brotli 依然能够提供非常高的压缩率。

- 兼容性：目前除了 IE 和 Opera Mini 之外，几乎所有的主流浏览器都已支持 Brotli 算法。

![图片](/images/other/5.jpg)

**使用条件 >>>**

- Content-Length 大于 256 字节；

- 客户端请求头需携带 Accept-Encoding: br；

- Content-Type 满足如下 MIME 列表：

```js
text/plain
text/javascript
text/css
text/xml
text/x-component
application/javascript
application/x-javascript
application/xml
application/json
application/xhtml+xml
application/rss+xml
application/atom+xml
application/x-font-ttf
application/vnd.ms-fontobject
image/svg+xml
image/x-icon
font/opentype
text/html -- default

```

vite 项目开启 brotli 压缩 >>>

- 使用 vite-plugin-compression (opens new window)对平台进行 gzip 或者 brotli 压缩，nginx 对这两种压缩模式都支持，压缩后部署到 nginx 将极大提高网页加载速度。

- 修改 .env.production 文件，设置 VITE_COMPRESSION 全局变量即可，如下：

```
# 不开启压缩，默认

VITE_COMPRESSION = "none"
//以下配置压缩时不删除原始文件的配置
开启 gzip 压缩，
VITE_COMPRESSION = "gzip"

开启 brotli 压缩
VITE_COMPRESSION = "brotli"

# 同时开启 gzip 与 brotli 压缩

VITE_COMPRESSION = "both"

//以下配置压缩时删除原始文件的配置
开启 gzip 压缩
VITE_COMPRESSION = "gzip-clear"

开启 brotli 压缩
VITE_COMPRESSION = "brotli-clear"

# 同时开启 gzip 与 brotli 压缩

VITE_COMPRESSION = "both-clear"
```

## 3.4 缓存

缓存的原理就是更快读写的存储介质+减少 IO+减少 CPU 计算=性能优化。而性能优化的第一定律就是：优先考虑使用缓存。<br>
**缓存的主要手段有**：浏览器缓存、CDN、反向代理、本地缓存、分布式缓存、数据库缓存。

[浏览器缓存](https://blog.csdn.net/qq_38974163/article/details/119890262)

## 3.5 Ajax 可缓存

Ajax 在发送的数据成功后，为了提高页面的响应速度和用户体验，会把请求的 URL 和返回的响应结果保存在缓存内，当下一次调用 Ajax 发送相同的请求（URL 和参数完全相同）时，它就会直接从缓存中拿数据。在进行 Ajax 请求的时候，可以选择尽量使用 get 方法，这样可以使用客户端的缓存，提高请求速度。

## 3.6 组件按需引入

使用第三方组件库时，要按需引入，例如 import { Button } from 'vant';

## 3.7 动态加载

使用 import()动态引入的语法引入一些第三方库和组件，例如我们在测试环境下开启 vconsole 调试：

```js
if (location.host !== "正式环境域名") {
  import("@/utils/vconsole");
}
```

## 3.8 组件异步加载

组件异步加载有两种方式：

```js
// 1. import 懒加载
() => import('@/pages/xxx.vue')
// 2. 使用 require
resolve => require(['@/pages/xxx.vue'], resolve),
```

## 3.9 路由懒加载

路由懒加载是组件异步加载的运用：

```js
//routes
{
path: '/index',
name: 'index',
component: () => import('@view/xxx.vue'),
//或者 component: require(['@/view/xxx.vue'], resolve),
meta: { title: '首页' }
}
```

## 3.10 CDN 内容分发

**CDN** 的全称是 Content Delivery Network，即内容分发网络。静态文件，音频，视频，js 资源，图片等都可以放 CDN 上。<br>
CDN 的原理类似于京东，其实就是将资源放在遍布世界各地的服务器上，访问资源的时候，请求会重定向到 离用户最近的服务节点上。

## 3.11 域名发散（域名收敛）

就是将同一站点下的静态资源分布在不同域名下。例如：
主站域名www.a.com
访问图片的域名www.a-img.com
访问文件的域名www.a-link.com
[参考](https://blog.csdn.net/qq_38974163/article/details/126667968)

## 3.12 DNS 预解析

当你的网站第一次请求某个跨域域名时，需要先解析该域名（例如页面访问 cdn 资源，第一次访问需要先解析 cdn）。可以在请求的 Timing 上看到有一个 DNS Lookup 阶段，而在这个请求之后的其他该域名的请求都没有这项时间支出。

```html
<link rel="dns-prefetch" href="xxx.com" />
```

使用说明： >>>

http 页面下所有的 a 标签的 href 都会自动去启用 DNS Prefetch，也就是说，你网页的 a 标签 href 带的域名，是不需要在 head 里面加上 link 手动设置的。https 页面需要使用 meta 标签强制开启：

```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
```

dns-prefetch 适用于网页引用了大量其他域名的资源，例如淘宝。

## 3.13 web worker

**Web Worker** 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。<br>
这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

合理实用 web worker 可以优化复杂计算任务
