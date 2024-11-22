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
                queueMicroTask(() => {
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
JSON.parse(JSON.stringify(obj)) 存在的问题


function cloneDeep() {

}


