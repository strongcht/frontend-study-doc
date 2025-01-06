# Webpack 性能优化
[webpack性能优化（一）](https://juejin.cn/post/7395969637878693942)

## 打包分析

::: tip 前提
在进行 Webpack 性能优化之前，如果我们知道我们每一个打包的文件有多大，打包时间是多少，它对于我们进行性能优化是很有帮助的，这里我们使用`webpack-bundle-analyzer`来帮助我们解决这个问题。
:::
首先需要使用如下命令去安装这个插件：

```sh
$ npm install webpack-bundle-analyzer --save-dev
```

安装完毕后，我们需要在`webpack.prod.js`文件中做一点小小的改动：

```js
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const prodConfig = {
  // 其它配置项
  mode: "production",
  plugins: [new BundleAnalyzerPlugin()],
};
```

配置完毕后，我们运行`npm run build`命令来查看打包分析结果，以下打包结果仅供参考：

![打包分析结果](/images/webpack/30.png)

## 缩小文件的搜索范围

::: tip 理解
首先我们要弄明白 Webpack 的一个配置参数(`Resolve`)的作用：它告诉了 Webpack 怎么去搜索文件，它同样有几个属性需要我们去理解：

- `extensions`：它告诉了 Webpack 当我们在导入模块，但没有写模块的后缀时应该如何去查找模块。
- `mainFields`：它告诉了 Webpack 当我们在导入模块，但并没有写模块的具体名字时，应该如何去查找这个模块。
- `alias`：当我们有一些不得不引用的第三方库或者模块的时候，可以通过配置别名，直接引入它的`.min.js`文件，这样可以库内的直接解析
- 其它`include`、`exclude`、`test`来配合 loader 进行限制文件的搜索范围
  :::

#### extensions 参数

就像上面所说的那样，`extensions`它告诉了 Webpack 当我们在导入模块，但没有写模块的后缀时，应该如何去查找模块。这种情况在我们开发中是很常见的，一个情形可能如下所示：

```js
// 书写了模块后缀
import main from "main.js";

// 没有书写模块后缀
import main from "main";
```

像上面那样，我们不写`main.js`的`.js`后缀，是因为 Webpack 会默认帮我们去查找一些文件，我们也可以去配置自己的文件后缀配置：
::: warning 注意
`extensions`参数应尽可能只配置主要的文件类型，不可为了图方便写很多不必要的，因为每多一个，底层都会走一遍文件查找的工作，会损耗一定的性能。
:::

```js
module.exports = {
  // 其它配置
  resolve: {
    extensions: [".js", ".json", ".vue"],
  },
};
```

如果我们像上面配置后，我们可以在代码中这样写：

```js
// 省略 .vue文件扩展
import BaseHeader from "@/components/base-header";

// 省略 .json文件扩展
import CityJson from "@/static/city";
```

#### mainFields 参数

`mainFields`参数主要应用场景是，我们可以不写具体的模块名称，由 Webpack 去查找，一个可能的情形如下:

```js
// 省略具体模块名称
import BaseHeader from "@components/base-header/";

// 以上相当于这一段代码
import BaseHeader from "@components/base-header/index.vue";
// 或者这一段
import BaseHeader from "@components/base-header/main.vue";
```

我们也可以去配置自己的`mainFields`参数：
::: tip 说明
同`extensions`参数类似，我们也不建议过多的配置`mainFields`的值，原因如上。
:::

```js
module.exports = {
  // 其它配置
  resolve: {
    extensions: [".js", ".json", ".vue"],
    mainFields: ["main", "index"],
  },
};
```

#### alias 参数

`alias`参数更像一个别名，如果你有一个目录很深、文件名很长的模块，为了方便，配置一个别名这是很有用的；对于一个庞大的第三方库，直接引入`.min.js`而不是从`node_modules`中引入也是一个极好的方案，一个可能得情形如下：
::: warning 注意
通过别名配置的模块，会影响`Tree Shaking`，建议只对整体性比较强的库使用，像`lodash`库不建议通过别名引入，因为`lodash`使用`Tree Shaking`更合适。
:::

```js
// 没有配置别名之前
import main from "src/a/b/c/main.js";
import React from "react";

// 配置别名之后
import main from "main.js";
import React from "react";
```

```js
// 别名配置
const path = require("path");
module.exports = {
  // 其它配置
  resolve: {
    extensions: [".js", ".json", ".vue"],
    mainFields: ["main", "index"],
    alias: {
      main: path.resolve(__dirname, "src/a/b/c"),
      react: path.resolve(__dirname, "./node_modules/react/dist/react.min.js"),
    },
  },
};
```

## Tree Shaking 去掉冗余的代码

::: tip 说明
`Tree Shaking`配置我们已经在上面讲过，配置`Tree Shaking`也很简单。
:::

```js
module.exports = {
  // 其它配置
  optimization: {
    usedExports: true,
  },
};
```

<!-- 如果你对`Tree Shaking`还不是特别理解，请点击[Tree Shaking](/webpack/webpack/advanced.html#tree-shaking)阅读更多。 -->

## DllPlugin 减少第三方库的编译次数

对于有些固定的第三方库，因为它是固定的，我们每次打包，Webpack 都会对它们的代码进行分析，然后打包。那么有没有什么办法，让我们只打包一次，后面的打包直接使用第一次的分析结果就行。答案当然是有的，我们可以使用 Webpack 内置的`DllPlugin`来解决这个问题，解决这个问题可以分如下的步骤进行：

- 把第三方库单独打包在一个`xxx.dll.js`文件中
- 在`index.html`中使用`xxx.dll.js`文件
- 生成第三方库的打包分析结果保存在`xxx.manifest.json`文件中
- 当`npm run build`时，引入已经打包好的第三方库的分析结果
- 优化

#### 单独打包第三方库

::: tip 步骤
为了单独打包第三方库，我们需要进行如下步骤：

- 根目录下生成`dll`文件夹
- 在`build`目录下生成一个`webpack.dll.js`的配置文件，并进行配置。
- 在`package.json`文件中，配置`build:dll`命令
- 使用`npm run build:dll`进行打包
  :::
  生成`dll`文件夹：

```sh
$ mkdir dll
```

在`build`文件夹下生成`webpack.dll.js`:

```sh
$ cd build
$ touch webpack.dll.js
```

创建完毕后，需要在`webpack.dll.js`文件中添加如下代码：

```js
const path = require("path");
module.exports = {
  mode: "production",
  entry: {
    vendors: ["lodash", "jquery"],
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "../dll"),
    library: "[name]",
  },
};
```

最后需要在`package.json`文件中添加新的打包命令：

```js {6}
{
  // 其它配置
  "scripts": {
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js",
    "build:dll": "webpack --config ./build/webpack.dll.js"
  }
}
```

使用`npm run build:dll`打包结果，你的打包结果看起来是下面这样的：

```js
|-- build
|   |-- webpack.common.js
|   |-- webpack.dev.js
|   |-- webpack.dll.js
|   |-- webpack.prod.js
|-- dll
|   |-- vendors.dll.js
|-- src
|   |-- index.html
|   |-- index.js
|-- package.json
```

#### 引用`xxx.dll.js`文件

在上一小节中我们成功拿到了`xxx.dll.js`文件，那么如何在`index.html`中引入这个文件呢？答案是需要安装`add-asset-html-webpack-plugin`插件：

```sh
$ npm install add-asset-html-webpack-plugin -D
```

在`webpack.common.js`中使用`add-asset-html-webpack-plugin`插件：

```js
const addAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const configs = {
  // 其它配置
  plugins: [
    new addAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, "../dll/vendors.dll.js"),
    }),
  ],
};
module.exports = configs;
```

我们将第三方库全局暴露了一个`vendors`变量，现引入`xxx.dll.js`文件结果如下所示：

![引用结果](/images/webpack/29.png)

#### 生成打包分析文件

在`webpack.dll.js`中使用 Webpack 内置的`DllPlugin`插件，进行打包分析：

```js {16}
const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "production",
  entry: {
    vendors: ["lodash", "jquery"],
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "../dll"),
    library: "[name]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.resolve(__dirname, "../dll/[name].manifest.json"),
    }),
  ],
};
```

#### 引用打包分析文件

在`webpack.common.js`中使用 Webpack 内置的`DllReferencePlugin`插件来引用打包分析文件：

```js {17}
const htmlWebpackPlugin = require("html-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const addAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
module.exports = {
  // 其它配置
  plugins: [
    new cleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: "src/index.html",
    }),
    new addAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, "../dll/vendors.dll.js"),
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dll/vendors.manifest.json"),
    }),
  ],
};
```

#### 优化

现在我们思考一个问题，我们目前是把`lodash`和`jquery`全部打包到了`vendors`文件中，那么如果我们要拆分怎么办，拆分后又该如何去配置引入？一个可能的拆分结果如下：

```js {6,7}
const path = require("path");
const webpack = require("webpack");
module.exports = {
  mode: "production",
  entry: {
    vendors: ["lodash"],
    jquery: ["jquery"],
  },
  output: {
    filename: "[name].dll.js",
    path: path.resolve(__dirname, "../dll"),
    library: "[name]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]",
      path: path.resolve(__dirname, "../dll/[name].manifest.json"),
    }),
  ],
};
```

根据上面的拆分结果，我们需要在`webpack.common.js`中进行如下的引用配置：

```js {16,22}
const htmlWebpackPlugin = require("html-webpack-plugin");
const cleanWebpackPlugin = require("clean-webpack-plugin");
const addAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const path = require("path");
const configs = {
  // ... 其他配置
  plugins: [
    new cleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: "src/index.html",
    }),
    new addAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, "../dll/vendors.dll.js"),
    }),
    new addAssetHtmlWebpackPlugin({
      filepath: path.resolve(__dirname, "../dll/jquery.dll.js"),
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dll/vendors.manifest.json"),
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "../dll/jquery.manifest.json"),
    }),
  ],
};
module.exports = configs;
```

我们可以发现：随着我们引入的第三方模块越来越多，我们不断的要进行 Webpack 配置文件的修改。对于这个问题，我们可以使用`Node`的核心模块`fs`来分析`dll`文件夹下的文件，进行动态的引入，根据这个思路我们新建一个`makePlugins`方法，它返回一个 Webpack 的一个`plugins`数组：

```js
const makePlugins = function () {
  const plugins = [
    new cleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: "src/index.html",
    }),
  ];

  // 动态分析文件
  const files = fs.readdirSync(path.resolve(__dirname, "../dll"));
  files.forEach((file) => {
    // 如果是xxx.dll.js文件
    if (/.*\.dll.js/.test(file)) {
      plugins.push(
        new addAssetHtmlWebpackPlugin({
          filepath: path.resolve(__dirname, "../dll", file),
        })
      );
    }
    // 如果是xxx.manifest.json文件
    if (/.*\.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, "../dll", file),
        })
      );
    }
  });
  return plugins;
};
configs.plugins = makePlugins(configs);
module.exports = configs;
```

使用`npm run build:dll`进行打包第三方库，再使用`npm run build`打包，打包结果如下:
::: tip 说明
本次试验，第一次打包时间为 1100ms+，后面的打包稳定在 800ms+，说明我们的 Webpack 性能优化已经生效。
:::

```js
|-- build
|   |-- webpack.common.js
|   |-- webpack.dev.js
|   |-- webpack.dll.js
|   |-- webpack.prod.js
|-- dist
|   |-- index.html
|   |-- jquery.dll.js
|   |-- main.1158fa9f961c50aaea21.js
|   |-- main.1158fa9f961c50aaea21.js.map
|-- dll
|   |-- jquery.dll.js
|   |-- jquery.manifest.json
|   |-- vendors.dll.js
|   |-- vendors.manifest.json
|-- src
|   |-- index.html
|   |-- index.js
|-- package.json
|-- postcss.config.js
```

**小结**：Webpack 性能优化是一个长久的话题，本章也仅仅只是浅尝辄止，后续会有关于 Webpack 更加深入的解读博客，敬请期待(立个`flag`:triangular_flag_on_post:)。

## webpack5 打包优化
> Webpack 是一个强大的打包工具，但随着项目规模的增加，构建时间和包大小可能会显著增加。以下是一些常见的性能优化方法，适用于 Webpack 5：

## 1. 使用持久缓存

Webpack 5 引入了持久缓存，能显著减少构建时间。你可以在 Webpack 配置中启用缓存：

```javascript
module.exports = {
  cache: {
    type: 'filesystem',
  },
};
```

## 2. 优化 `mode` 和 `devtool`

根据你的环境设置适当的 `mode` 和 `devtool`：

- 开发环境：`mode: 'development'` 和 `devtool: 'eval-cheap-module-source-map'`
- 生产环境：`mode: 'production'` 和 `devtool: 'source-map'`

```javascript
module.exports = (env, argv) => ({
  mode: argv.mode,
  devtool: argv.mode === 'development' ? 'eval-cheap-module-source-map' : 'source-map',
});
```

## 3. 分割代码

利用代码分割来减少单个文件的大小并提高加载速度：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

## 4. 懒加载和动态导入

使用懒加载和动态导入来按需加载代码：

```javascript
import(/* webpackChunkName: "my-chunk-name" */ './myModule').then(module => {
  const myModule = module.default;
  // 使用 myModule
});
```

## 5. 优化模块解析

通过限制解析模块的范围和减少解析的路径数量来优化性能：

```javascript
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
};
```

## 6. 使用 Tree Shaking

确保你的代码中只包含需要的部分。Webpack 5 默认支持 tree shaking，但确保你使用的是 ES6 模块。

## 7. 压缩和缩小代码

使用 TerserPlugin 来压缩和缩小 JavaScript 代码：

```javascript
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
```

## 8. 压缩 CSS

使用 `css-minimizer-webpack-plugin` 压缩和优化 CSS：

```javascript
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      '...', // 保留其他默认的 minimizers
      new CssMinimizerPlugin(),
    ],
  },
};
```

## 9. 使用 Babel Loader 的缓存

为 `babel-loader` 启用缓存，减少重复编译：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};
```

## 10. 使用 Source Map 以调试

在开发环境中使用轻量的 source map，以加快构建速度：

```javascript
module.exports = {
  devtool: 'eval-cheap-module-source-map',
};
```

## 11. 使用多线程和缓存

使用 `thread-loader` 和 `cache-loader` 来提高构建速度：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          {
            loader: 'thread-loader',
            options: {
              workers: 2,
            },
          },
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
};
```

## 12. 图片优化

使用 `image-webpack-loader` 优化图片文件：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
};
```

## 13. 使用生产模式构建

确保在生产模式下构建，以启用各种优化功能：

```sh
NODE_ENV=production webpack --mode production
```

通过以上方法，可以显著提高 Webpack 构建的性能，减少打包时间和包的大小。如果项目仍然存在性能问题，可以使用 Webpack 的分析工具（如 `webpack-bundle-analyzer`）找出瓶颈并进行优化。