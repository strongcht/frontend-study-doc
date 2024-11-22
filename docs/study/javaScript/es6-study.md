## ES6 学习回顾

#### 1. let const 
    + let const var三个的区别
    + 暂时性死区 （块级作用域）
    + 重复声明
    + 变量提升
    + 初始值
    + 是否可被修改 const 不可修改的是变量的地址
    + 全局添加属性

#### 2. 解构赋值
    + 数组解构：交换赋值、扩展运算 （...会跳过空格）
    + 字符串的结构 ...str
    + 对象的结构： 默认值 简写-变量和对象方法
    + 函数参数的结构： 
        提供默认值、
        length指没有提供默认参数的参数个数、
        rest参数 剩余参数 ...rest、
        name (anonymous、bound foo、 foo、)、
        箭头函数、
        尾调用优化、
#### 3. 字符串
    + 模版字符串
    + codePointAt()、formCodePoint()
    + includes、startsWith、endsWidth
    + repeat、padStart、padEnd、trimStart、trimEnd
#### 4. 数值
    + BigInt数据类型
    + Number.isFinite、isNaN、parseInt、parseFloat
    + Number.EPSILON、Number.isSefeInterger
#### 5. 数组
    + 扩展运算符 ...
    + Array.from、Array.of
    + find、findIndex、fill、flat、
    + keys、values、entries、includes、
#### 6.对象
    + 属性简写、方法简写
    + ?.链式判断
    + ?? null || undefined判断
    + Object.is、Object.assign、
    + Object.getPrototypeOf()
    + Object.keys、values、entries

#### 7. 方法
    + 箭头函数
    + name
    + 默认参数、剩余参数
    + catch省略参数
    + this指向
#### 8.symbol
    + 创建独一无二的属性名
    + Reflect.ownkeys()、Object.getOwnPropertySymbols(obj)

#### 9.Set WeakSet Map WeakMap
    + weakSet、weakMap 弱引用不参数垃圾回收标记、不知道何时进行垃圾回收所以没有遍历方法和size方法 （避免内存泄漏）
    + add/set has delete size keys values entries
    + Set不能存在重复
    + Map 按存入顺序排序

#### 10. Proxy
    + 代理
    + const proxy = new Proxy({}, {
        get: function(target, propKey, receiver) {}
        set: function(target, propKey, value, receiver) {}
    })
    + receiver 指向proxy
    + this指向 proxy
#### 11. Refect
    + 包含为了操作对象而提供的新 API
    +（1） 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。
    +（2） 修改某些Object方法的返回结果，让其变得更合理。
    +（3） 让Object操作都变成函数行为。
    +（4）Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。
#### 12. Promise
    + promise: pedding fulfilled rejected
    + promise.reslove() promise.reject()
    + Promise.all race allSettled any 
    + Promise.prototype.then catch finally
#### 13. Iterator
    + 迭代器
    + [Symbol.iterator]() {}
    + for ... of 可以遍历value  for...in只能遍历key
#### 14. Generator 
    + 生成器
    + * function () { yield }
    + yield*  相当于对后面的生成器执行 for ...of 
    + Generator.prototype.next、throw、return
    + 自执行的生成器
        + thunk 利用回调函数实现
        + co 利用promise实现的
    + 异步处理方法：
        + 回调函数 -- 回调地狱
        + 事件监听 -- 错过就监听不到了
        + 发布订阅
        + promise.then 链式调用--很长的then链
        + 利用Generator自执行实现的异步处理方法 --async await
#### 15. async
    + async就是Generator的语法糖  更好的语义化 返回值是promise 更简洁
    + 多个await不存在继发关系最好让他们一同出发 let [f1, f2] = await Promise.all([fn1(), fn2()]);
    + try catch 捕获错误
    + await 只能存在 async函数体内 不能存在普通函数体内
    + async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。
    

#### 16. class
    + es5原型的语法糖
    + 静态方法 static 、#proto 静态值
    + 继承 、super new.target 

#### 17. module
    + Commonjs 运行时加载，无法做静态分析； module 编译时加载（静态加载）、可以做静载资源分析
    + Commonjs require()可以在代码的任意位置，是同步加载代码； module 的import export 只能存在模块的顶层 因为是编译时 不会去分析代码逻辑 可以使用import() 是运行时加载的-返回的是一个promise 是异步加载；
    + CommonJS 模块输出的是值的缓存，不存在动态更新; export 导出的值可以动态更新， import  导入的都是只读的，如果是对象值修改是可以的其他模块也可以读到修改后的值；import 可以提升的 先试用 再导入也是可以的； import 是单例模式 多次导入 不同 只会执行一次
    + 浏览器加载 Es6模块 `<script type="module"></script>` 异步加载 相当于增加 defer 渲染完后再执行； async 是加载完就执行 ；模块自成作用域 不会干扰外部作用域 默认严格模式，this为undefiend 
    + Commonjs 输出的是值的拷贝；export 是值的引用
    + nodejs 中 mjs--es6 、cjs--commonjs


