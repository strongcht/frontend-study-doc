## html
#### 1. html新增了哪些特性
    + 语义化标签 `footer nav main aside section`
    + input 类型
    + video audio
    + session Storage local Storage 
    + svg canvas
    + websocket geolocation
#### 2. 行内元素和块级元素
    + 行内 a span input img
    + 块级元素 div p li h 
#### 3. 声明 `<!DOCTYPE html>`

## css
#### 1. 外部样式 内部样式 内敛样式
#### 2. 选择器 优先级
#### 3. 盒子模型
#### 4. 可继承与不可继承
#### 5. 盒子模型
#### 6. 回流重绘
#### 7. BFC
#### 8. 浮动
#### 9. flex grid
#### 10. 预处理器 后处理器 
#### 11.引入方式 link @import
#### 12. 动画 requestAminationFrame 定位

## js 基础
#### 1. 数据类型
    Number、String、Boolean、BigInt、Symbol、Null、Undefined、Object
    typeof 、instanceOf、constructor、Object.propotype.toString.call().slice(8, -1).toLowerCase();
    function MyInstanceOf (left, right) {
        let prop = Object.getPrototypeOf(left);
        const prototype = right.prototype;
        while(true) {
            if(prop === null) return false;
            if(prop === prototype) return true;
            prop = Object.getPrototypeOf(prop);
        }
    }
#### 2. 类型转换
    + 转换为Number String Boolean 
    + /+ - * // 操作转换
    + 对象转化为Number --valueOf 转化为String -- toString()
    + 隐式转换 -- /+ 一侧是字符则全部转化为字符 否则转换为数值 `/< /> ` 两侧都为字符 按字母表比较其他都转化为number比较

#### 3. new
    创建空对象、将对象原型设置为函数的prototype、让函数的this指向新建的对象并执行函数、判断函数返回类型 如果是值类型返回新建的对象 否则返回结果
    function MyNew() {
        const constroutor = Array.prototype.shift().call(arguments);
        if(typeof constructor != 'function') {
            return;
        }
        let obj = Object.create(constructor.prototype);
        let res = constructor.apply(obj, arguments);

        let flag = res !== null && (typeof res == 'object' || typeof res ==  'function');
        return flag ? res: obj;
    }
#### 4.this指向问题
    <!-- call 接收多个参数 -->
    function myCall(context) {
        context = context || window;
        let args = [...arguments].slice(1);
        const fn = Symbol();
        context[fn] = this;
        const result = context[fn](...args);
        delete context[fn];
        return result;        
    }
    <!-- 接收两个参数第二个是个数组 -->
    function MyApply(context) {
        context = context || window;
        const args = [...arguments[1]];
        const fn = Symbol();
        context[fn] = this;
        const result = conetxt[fn](...args);
        delete context[fn];
        return result;
    }
    <!-- 返回的是一个新的方法，调用该方法在执行绑定的函数 -->
    function MyBind(context) {
        context = context || window;
        const args = [...arguments].slice(1);
        const fn = this;
        return function Fn() {
            return fn.apply(
                this instanceOf Fn ? this : context,
                args.concat(...arguments);
            )
        }
    }

#### 5. promise
    function MyPromise(fn) {
        const that = this;
        let status = 'pedding'; // 'pedding' | 'rejected' | 'fulfilled'
        let value = null;
        let reason = '';
        const onFulfilledCallback = [];
        const onRejectedCallback = [];

        function resolve(val) {
            if(val instanceOf MyPromise) {
                return val.then(resolve, reject);
            }
            if(that.status === 'pedding') {
                that.status = 'fulfilled';
                that.value = val;
                queueMicrotask(() => {
                    that.onFulfilledCallback.forEach(f => f(that.value));
                })
            }
        }

        function reject(err) {  
            if(err instanceOf MyPromise) {
                return err.then(resolve, reject);
            }
            if(that.status === 'pedding') {
                that.status = 'rejected';
                that.reason = err;
                queueMicroTask(() => {
                    that.onRejectedCallback.forEach(f => f(that.reason));
                })
            }
        }
        try {
            fn(resolve, reject)
        } catch (err) {
            reject(err)
        }
    }

    MyPromise.prototype.then = function (onFulfilled, onRejected) {
        const that = this;
        let promise2;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};

        if(that.status === 'fulfilled') {
            return promise2 = new MyPromise(resolve, reject) {
                queueMicroTask(() => {
                    try {
                        let x = onFulfilled(that.value);
                        reslovePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }
        }

        if(that.status === 'rejected') {
            return promise2 = new MyPromise(resolve, reject) {
                queueMicroTask(() => {
                    try {
                        let x = onRejected(that.reason);
                        reslovePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }
        }

        if(that.status === 'pedding') {
            return promise2 = new MyPromise(resolve, reject) {
                that.onFulfilledCallback.push(() => {
                    try {
                        let x = onFulfilled(that.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err)
                    }
                })

                that.onRejectedCallback.push(() => {
                    try {
                        let x = onRejected(that.reason);
                        reslovePromise(promise2, x, resolve, reject)
                    } catch (err) {
                        reject(err)
                    }
                })
            }
        } 

        function resolvePromise(promise, x, resolve, reject) {
            let called = false;

            if(x instanceOf MyPromise) {
                if(this.status === 'peding') {
                   x.then(
                    (val) => {
                        resolvePromise(promise2, val, resolve, reject)
                    },
                    (err) => reject(err) 
                   )
                } else {
                    x.then(resolve, reject)
                }
            }
            return;

            if(x != null && (typeof x == 'object' || typeof === 'function')) {
                try {
                    let then = x.then;
                    if(typeof then === 'function') {
                        then.call(
                            x, 
                            y => {
                                if (called) return;
                                called = true;
                                resolvePromise(promise2, y, resolve, reject);
                            },
                            err => {
                                if(called) return;
                                called = true;
                                reject(err);
                            }
                        )
                    } esle {
                        resolve(x);
                    }
                } catch (err) {
                    if(called) return;
                    called = true;
                    reject(err);
                }
            } else {
                reslove(x);
            }
        }
    }

    function MyPromiseAll(promises) {
        return Promise((resolve, reject) => {
            let result = [];
            let completedCount = 0;
            for(let i = 0; i < promises.lenngth; i++) {
                Promise.resolve(promises[i])
                    .then((val) => {
                        result[i] = val;
                        completedCount++;
                        if(completedCount == promises.length) {
                            resolve(result);
                        }

                    })
                    .catch(err => {
                        reject(err)
                    })
            }
        }) 
    }

    function MyPromiseRace(promises) {
        return new Promise((resolve, reject) => {
            for(let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(val => resolve(val)).catch(err => reject(err));
            }
        })
    }

    function MyPromiseAllSettled(promises) {
        return new Promise((resolve,reject) => {
            let result = [];
            for(let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i])
                    .then(val => {
                        result.push({
                            status: 'fulfilled',
                            value: val
                        })
                    })
                    .cathc (err => {
                        result.push({
                            status: 'rejected',
                            reason: err
                        })
                    })
            }

            return result;
        });
    }

#### 6. 原型链
    function Fn() {};
    const p = new Fn();


    p.__proto__=== Fn.prototype;
    p.__proto__.constructor === Fn;
    Fn.prototype.__proto__ == Object.protutype;
    Object.prototype.__proto__ === null;
    Fn.prototype.constructor === Fn;

#### 7. 设计模式
    + 单例模式
    + 工厂模式
    + 发布订阅模式
    + 观察者模式

#### 8. 深拷贝
评价一个深拷贝是否完善，请检查以下问题是否都实现了：

基本类型数据是否能拷贝？
键和值都是基本类型的普通对象是否能拷贝？
Symbol作为对象的key是否能拷贝？
Date和RegExp对象类型是否能拷贝？
Map和Set对象类型是否能拷贝？
Function对象类型是否能拷贝？（函数我们一般不用深拷贝）
对象的原型是否能拷贝？
不可枚举属性是否能拷贝？
循环引用是否能拷贝？

JSON.stringfy() 存在以下一些问题：

+ 执行会报错：存在BigInt类型、循环引用。
+ 拷贝Date引用类型会变成字符串。
+ 键值会消失：对象的值中为Function、Undefined、Symbol 这几种类型，。
+ 键值变成空对象：对象的值中为Map、Set、RegExp这几种类型。
+ 无法拷贝：不可枚举属性、对象的原型链。

| 存在的问题 | 改进方案 |
| --- | --- |
| 1. 不能处理循环引用 | 使用 WeakMap 储存已拷贝对象的引用，以解决循环引用问题 |
| 2. 只考虑了Object对象 | 针对 Date、RegExp、Function、Map、Set 等特殊类型，直接生成并返回一个新的实例 |
| 3. 未处理属性名为Symbol的属性 | 使用 Reflect.ownKeys() 方法获取对象的所有自有属性，包括 Symbol 类型的键 |
| 4. 丢失了不可枚举的属性 | 利用 Reflect.ownKeys(obj) 获取对象的所有可枚举和不可枚举属性以及 Symbol 类型属性 |
| 5. 无法拷贝原型上的属性 | 使用 Object.getOwnPropertyDescriptors() 获取所有属性描述符，并通过 Object.create() 创建新对象继承原对象的原型链 |

注：Reflect.ownKeys(obj) 返回一个数组，包含对象自身的所有属性键，既包括可枚举属性也包括不可枚举属性，还包括 Symbol 类型的属性键。

```js

function deepClone(target) {
  // WeakMap作为记录对象Hash表（用于防止循环引用）
  const map = new WeakMap()

  // 判断是否为object类型的辅助函数，减少重复代码
  function isObject(target) {
    return (typeof target === 'object' && target ) || typeof target === 'function'
  }

  function clone(data) {

    // 基础类型直接返回值
    if (!isObject(data)) {
      return data
    }

    // 日期或者正则对象则直接构造一个新的对象返回
    if ([Date, RegExp].includes(data.constructor)) {
      return new data.constructor(data)
    }

    // 处理函数对象
    if (typeof data === 'function') {
      return new Function('return ' + data.toString())()
    }

    // 如果该对象已存在，则直接返回该对象
    const exist = map.get(data)
    if (exist) {
      return exist
    }

    // 处理Map对象
    if (data instanceof Map) {
      const result = new Map()
      map.set(data, result)
      data.forEach((val, key) => {
        // 注意：map中的值为object的话也得深拷贝
        if (isObject(val)) {
          result.set(key, clone(val))
        } else {
          result.set(key, val)
        }
      })
      return result
    }

    // 处理Set对象
    if (data instanceof Set) {
      const result = new Set()
      map.set(data, result)
      data.forEach(val => {
        // 注意：set中的值为object的话也得深拷贝
        if (isObject(val)) {
          result.add(clone(val))
        } else {
          result.add(val)
        }
      })
      return result
    }

    // 收集键名（考虑了以Symbol作为key以及不可枚举的属性）
    const keys = Reflect.ownKeys(data)
    // 利用 Object 的 getOwnPropertyDescriptors 方法可以获得对象的所有属性以及对应的属性描述
    const allDesc = Object.getOwnPropertyDescriptors(data)
    // 结合 Object 的 create 方法创建一个新对象，并继承传入原对象的原型链， 这里得到的result是对data的浅拷贝
    const result = Object.create(Object.getPrototypeOf(data), allDesc)

    // 新对象加入到map中，进行记录
    map.set(data, result)

    // Object.create()是浅拷贝，所以要判断并递归执行深拷贝
    keys.forEach(key => {
      const val = data[key]
      if (isObject(val)) {
        // 属性值为 对象类型 或 函数对象 的话也需要进行深拷贝
        result[key] = clone(val)
      } else {
        result[key] = val
      }
    })
      return result
  }

  return clone(target)
}
```


