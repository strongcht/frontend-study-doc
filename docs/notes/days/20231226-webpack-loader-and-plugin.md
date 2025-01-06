
---
layout: doc
---

## 2023 年 12 月 26 日
## webpack-loader-and-plugin
[参考地址loader](https://www.jianshu.com/p/7fa359ffcf8d)

[参考地址Plugin](https://juejin.cn/post/6996572755634159629)

## 一、Loader
> webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效模块，以供应用程序使用，以及被添加到依赖图中。

#### 1. loader 分类
> Webpack中的loader可以分为两类：普通loader和enforce-loader
+ 普通loader：普通loader执行的顺序是从右向左，从下往上。也就是说，在webpack配置文件中，最后一次加入的loader会最先执行，然后依次向上执行。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['a-loader', 'b-loader', 'c-loader'], // 从右到左，c-loader -> b-loader -> a-loader
      },
      {
        test: /\.css$/, // test属性，规定哪些文件会被转换
        use: [ // use属性，在进行转换时，应用哪些 loader
          { loader: 'style-loader' }, 
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          { loader: 'sass-loader' } 
        ] // 从下到上，sass-loader -> css-loader -> style-loader
      }
    ],
  },
}
```

+ enforce-loader: 则有更高的优先级。enforce属性可设置为pre或post，如果设置为pre，表示在普通loader之前执行；如果设置为post，表示在普通loader之后执行。这样就可以确保enforce-loader在所有loader中优先执行，并且能够准确地对文件进行处理。

如下： 遇到`.js`文件时，原本应按从下到上顺序执行，但由于`some-other-loader`中配置了`enforce: 'pre'`，表示在`babel-loader`之前`先执行。所以会先执行`some-other-loader`，再执行`babel-loader`。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      enforce: 'pre', // 注意这里
      loader: 'some-other-loader',
    },
    {
      test: /\.js$/,
      loader: 'babel-loader',
    },
  ],
}
```

#### 2.内联方式
可以在 `import` 语句或任何 与 `"import" 方法同等的引用方式` 中指定 loader。使用 ! 将资源中的 loader 分开。每个部分都会相对于当前目录解析。

`import Styles from 'style-loader!css-loader?modules!./styles.css';`
通过为内联 `import` 语句添加前缀，可以覆盖**配置** 中的所有 loader, preLoader 和 postLoader：

+ 使用 `!` 前缀，将禁用所有已配置的 normal loader(普通 loader)

`import Styles from '!style-loader!css-loader?modules!./styles.css';`
+ 使用 `!!` 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）

`import Styles from '!!style-loader!css-loader?modules!./styles.css';`
+ 使用 `-!` 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders

`import Styles from '-!style-loader!css-loader?modules!./styles.css';`

选项可以传递查询参数，例如 `?key=value&foo=bar`，或者一个 JSON 对象，例如 `?{"key":"value","foo":"bar"}`。

#### 3.自己实现loader
[官网示例](https://www.webpackjs.com/contribute/writing-a-loader/#setup)

```js
const babel = require("@babel/core");
const { getOptions, interpolateName } = require("loader-utils");

function loader(source, inputSourceMap, data) {
  console.log(getOptions);
  // let loaderOptions = getOptions(this) || {};
  const options = {
    presets: ["@babel/preset-env", "@babel/react"],
    inputSourceMap: inputSourceMap,
    sourceMaps: true,
    filename: this.request.split("!")[1].split("/").pop(),
  };
  let { code, map, ast } = babel.transform(source, {
    // ...loaderOptions,
    ...options,
  });
  return this.callback(null, code, map, ast);
}
// module.exports = loader;
export default loader;
```


## 二、Plugin
> 插件 是 webpack 的 支柱 功能。Webpack 自身也是构建于你在 webpack 配置中用到的 相同的插件系统 之上！**插件目的在于解决 loader 无法实现的其他事**。

1. #### webpack 插件由以下组成：

+ 一个 JavaScript 命名函数或 JavaScript 类。
+ 在插件函数的 prototype 上定义一个 apply 方法。
+ 指定一个绑定到 webpack 自身的事件钩子。
+ 处理 webpack 内部实例的特定数据。
+ 功能完成后调用 webpack 提供的回调。

```js
// 一个 JavaScript 类
class FileListPlugin {

    constructor(options = {}) {
        // 在应用默认选项前，先应用用户指定选项
        // 合并后的选项暴露给插件方法
        // 记得在这里校验所有选项
        this.options = { ...options };
    }
      
    apply(compiler) {
        const pluginName = FileListPlugin.name;

        // webpack 模块实例，可以通过 compiler 对象访问，
        // 这样确保使用的是模块的正确版本
        // （不要直接 require/import webpack）
        const { webpack } = compiler;

        // Compilation 对象提供了对一些有用常量的访问。
        const { Compilation } = webpack;

        // RawSource 是其中一种 “源码”("sources") 类型，
        // 用来在 compilation 中表示资源的源码
        const { RawSource } = webpack.sources;

        // 绑定到 “thisCompilation” 钩子，
        // 以便进一步绑定到 compilation 过程更早期的阶段
        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
        // 绑定到资源处理流水线(assets processing pipeline)
        compilation.hooks.processAssets.tap(
            {
            name: pluginName,

            // 用某个靠后的资源处理阶段，
            // 确保所有资源已被插件添加到 compilation
            stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
            },
            (assets) => {
            // "assets" 是一个包含 compilation 中所有资源(assets)的对象。
            // 该对象的键是资源的路径，
            // 值是文件的源码

            // 遍历所有资源，
            // 生成 Markdown 文件的内容
            const content =
                '# In this build:\n\n' +
                Object.keys(assets)
                .map((filename) => `- ${filename}`)
                .join('\n');

            // 向 compilation 添加新的资源，
            // 这样 webpack 就会自动生成并输出到 output 目录
            compilation.emitAsset(
                this.options.outputFile,
                new RawSource(content)
            );
            }
        );
    });
  }
}

module.exports = { FileListPlugin };
```

在插件开发中最重要的两个资源就是 **compiler** 和 **compilation** 对象。

+ `compiler`可以理解为一个webpack的实例，该实例存储了webpack配置、打包过程等一系列的内容。compiler提供了compiler.hooks,在为 webpack 开发插件时，你可能需要知道每个钩子函数是在哪里调用的，具体就可以查阅官方文档。这里可以看到有很多时刻，我们可以根据这些不同的时刻去让插件做不同的事情。

+ compilation 模块会被 compiler 用来创建新的编译（或新的构建）。该实例存放的是本次打包编译的内容。


#### 2. 实战
现在我需要自己写一个插件，在webpack打包结束后把一个readme.txt放到dist目录。 首先需要知道，这是怎样的时刻，是的，是在webpack打包结束后，生成资源到 output 目录之前。 通过查看文档中的complier hook。Very good！有emit这个hook!同时发现，这个emit是AsyncSeriesHook，异步的，所以记得上文提到过的，使用它的tapAsync方法,并且要回调函数。 思路已经很清晰了，代码写起来！
```js
class ReadmeWebpackPlugin {
    apply(compiler){
        compiler.hooks.emit.tapAsync('ReadmeWebpackPlugin',( compilation,callback ) => {
            console.log(compilation.assets)
            compilation.assets['readme.txt'] = {
                source:function(){
                    return 'readme'
                },
                size:function(){
                    return 6
                }
            }
            callback()
        })
    }
}
module.exports = ReadmeWebpackPlugin;
```

上述代码中打印了compilation.assets，打包后的内容有哪些是放在compilation的assets属性中的，所以我们可以依照上述增加键值对的方式再增加一个文件。 用一下：

```js
//webpack.config.js
...其他配置,
 plugins:[
    new ReadmetWebpackPlugin()
  ],
```
