## 构建工具

## 一. webpack

### 1. webpack 打包流程

### 2. webpack 热更新原理
    + 基于webpack-dev-server(express) 启动本地服务后再启动webscoket服务 建立本地与浏览器的双向通信
    + 编译后产生hash值，作为下次更新完文件命名， json、js文件
    + 编译完成通知浏览器加载变化的文件
    + 浏览器加载js文件，替换调旧的模块实现热更新

    好处：节省开发时间、提升开发体验、无需刷新整个页面做到局部更新

### 3. webpack plugin
    + module.exports = MyPlugin; Class MyPlugin { apply(compiler) {} }
    + 发布订阅， 注册回调事件 处理

### 4. webpack loader
    + module.exports = function () {};
    + 根据配置 解析各种文件 使可以被webpack加载的模块
    + 从右到左、从下到上执行
    + pre： 前置loader 、normal： 普通loader 、inline： 内联loader 、post： 后置loader

### 5. webpack5 Module Federation(模块联邦)
    + 

### 6. webpack优化

#### 6.1 打包过程优化
    + 合理配置loader的检索范围，babel-loader 开启缓存
    + 缩小文件检索范围: 合理配置 extensions 参数、alias 参数（明确路径）
    + 对第三方库单独打包
    + 使用多线程和缓存提交打包速度
    + 配置合理的suorce map

#### 6.2 构建产物优化
    + webpack-bundle-analyzer 对打包后的文件分析（loadsh与loadsh-es重复，element-plus 全量打包， element-plus/icons使用）
    + tree shanking、代码分割、mode='production'、代码压缩、


## 二、vite
### 1. vite原理

### 2. vite为什么更快
#### 2.1. 为什么esbuild这么快？
+ 它是用 **Go 语言**编写的，该语言可以编译为本地代码。其他的一般使用js编写的。 而且 Go 的执行速度很快。 一般来说，JS 的操作是毫秒级，而 Go 则是纳秒级。
+ 解析，生成最终打包文件和生成 source maps 的操作全部完全**并行**化，
+ 无需昂贵的数据转换，只需很少的几步即可完成所有操作
+ 该库以提高编译速度为编写代码时的第一原则，并尽量避免不必要的内存分配。

#### 2.2. 为什么使用esbuild
现代浏览器对于`esm`模块的支持， Vite 以 原生 ESM 方式提供源码，只需要在浏览器请求源码时进行转换并按需提供源码。
Esbuild 作为构建的性能利器，Vite 利用其 Bundler 的功能进行依赖预构建，
+ 用其 Transformer 的能力进行 TS 和 JSX 文件的转译，
+ 也用到它的压缩能力进行 JS 和 CSS 代码的压缩。

#### 2.3. 为什么vite再生产环境不使用esbuild
+ 尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在**生产环境中发布未打包的 ESM 仍然效率低下**（即使使用 HTTP/2）。
+ 为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。
+ esbuild 针对构建应用的重要功能仍然还在持续开发中 —— 特别是**代码分割**和 **CSS 处理方面**。

### 3. vite热更新原理

### 4. vite打包优化

## 三、Babel


## 四、性能优化

## 五、国际化

## 六、Eslint、prettier

## 七、微前端

## 八、主题切换

## 九、服务端渲染

## 十、nodejs
