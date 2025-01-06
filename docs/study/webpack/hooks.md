Webpack 的生命周期是指从启动构建到生成最终资源的整个过程，贯穿了多个构建阶段。每个阶段都会触发一系列的钩子函数（Hooks），而 Webpack 使用 `Tapable` 库来管理这些钩子，实现插件机制，使得开发者可以在 Webpack 的生命周期的不同阶段插入自定义的逻辑。

在Webpack的compiler 和 compilation中有很多钩子 通过 `tap`，`tapAsync` 和 `tapPromise` 等方法注册回调方法
#### compiler中重要钩子
[compiler hooks](https://www.webpackjs.com/api/compiler-hooks/#hooks)
1. **beforeRun**：
   在 Webpack 构建任务开始前触发，常用于构建前的准备工作。

   ```javascript
   compiler.hooks.beforeRun.tap('MyPlugin', (compiler) => {
     console.log('beforeRun 钩子');
   });
   ```

2. **compile**：
   Webpack 构建开始时触发，进入模块编译阶段。

   ```javascript
   compiler.hooks.compile.tap('MyPlugin', (params) => {
     console.log('compile 钩子');
   });
   ```

3. **emit**：
   在输出文件写入磁盘前触发，插件可以修改输出的内容。

   ```javascript
   compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
     console.log('emit 钩子');
     callback();
   });
   ```

4. **done**：
   当 Webpack 完成所有构建并且输出资源完成时触发。

   ```javascript
   compiler.hooks.done.tap('MyPlugin', (stats) => {
     console.log('done 钩子');
   });
   ```

#### compilation中重要钩子

[compilation hooks](https://www.webpackjs.com/api/compilation-hooks/)

1. **optimize**  SyncHook
> 优化阶段开始时触发。