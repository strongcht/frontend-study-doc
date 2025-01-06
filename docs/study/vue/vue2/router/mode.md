## Hash模式与History模式


## history 模式
> 当使用这种历史模式时，URL 会看起来很 "正常"，例如 `https://example.com/user/id`。

#### 1. 如何配置history模式
+ **vue router 4.X**
```js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //...
  ],
})
```

+ **vue router 3.X**
```js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```
#### 2. 配置完history模式还需要做什么
> 但这样配置没有适当的服务器配置, 如果用户在浏览器地址栏中直接访问 `https://example.com/user/id` ，会得到一个404错误。 以nginx服务器为例

这是因为这样的请求服务器会在静态文件下 寻找 `[user]`目录下 -> `id.html` 文件或者`[id]`文件夹下的 `index.html` 文件,
因为一般只有一个根目录下的`index.html`文件,所以服务器会返回`404`资源不存在。

###### 2.1 那要怎么避免这种问题的发生呢？
根据[官网](https://router.vuejs.org/zh/guide/essentials/history-mode.html)配置

```sh
location / {
  try_files $uri $uri/ /index.html;
}
```

###### 2.2 try_files作用
+ 语法 `try_files file ... uri;`
+ 解释
> Checks the existence of files in the specified order and uses the first found file for request processing; the processing is performed in the current context. The path to a file is constructed from the file parameter according to the root and alias directives. It is possible to check directory’s existence by specifying a slash at the end of a name, e.g. “$uri/”. If none of the files were found, an internal redirect to the uri specified in the last parameter is made.

大意就是它会按照try_files后面的参数依次去匹配root中对应的文件或文件夹。如果匹配到的是一个文件，那么将返回这个文件；如果匹配到的是一个文件夹，那么将返回这个文件夹中index指令指定的文件。最后一个uri参数将作为前面没有匹配到的fallback。（注意try_files指令至少需要两个参数）

```sh
location / { 
    index           index.html; 
    try_files       $uri $uri/ /index.html; 
}
```
> $uri是nginx中的变量，比如我访问的网址是`https://example.com/user/id`，那么它就代表的`/user/id`。

#### 3. 警告
给个警告，因为这么做以后，你的服务器就不再返回 404 错误页面，因为对于所有路径都会返回 index.html 文件。为了避免这种情况，你应该在 Vue 应用里面覆盖所有的路由情况，然后再给出一个 404 页面。
```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```
或者，如果你使用 Node.js 服务器，你可以用服务端路由匹配到来的 URL，并在没有匹配到路由的时候返回 404，以实现回退。


## hash模式
> 它在内部传递的实际 URL 之前使用了一个哈希字符（#）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。
`https://example.com/#/user/id`
#### 1. 如何配置hash模式
+ **vue router 4.X**
```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    //...
  ],
})
```

+ **vue router 3.X**
```js
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```
