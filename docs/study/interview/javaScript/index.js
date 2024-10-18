function myNew() {
    const constructor = Array.prototype.shift.call(arguments);
    const obj = Object.create(constructor.prototype);
    const result = constructor.apply(obj, arguments);
    const flag = result && (typeof result === 'object' || typeof result === 'function');
    return flag ? result : obj;
}

function myInstanceOf(left, right) {
    let proto = Object.getPrototypeOf(left);
    const propotytpe = right.prototype;

    while (true) {
        if (!proto) return false;
        if (proto === propotytpe) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

function myCall(context, ...args) {
    // call 接收的第一个参数为this指向的对象，若不传则为window
    // 其余的参数当做参数传入函数中
    context = context || window;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
}

function myApply(context, args) {
    context = context || window;
    const fn = Symbol();
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
}

function myBind(context, args) {
    context = context || window;
    const f = Symbol();
    const fn = this;
    let result = function (...args1) {
        if (this instanceof fn) {
            this[f] = fn;
            this[f](...args, ...args1);
            delete this[f];
        } else {
            context[f] = fn;
            context[f](...args, ...args1);
            delete context[f];
        }
    }

    result.prototype = Object.create(fn.prototype);
    return result;
}

// [JS高级 - 手写Promise详解](https://mp.weixin.qq.com/s/Kj6yIae6AU1u818211KowQ)
function myPromise(fn) {
    const that = this;

    that.state = 'pending';  // 'pending', 'fulfilled','rejected'
    that.value = null;
    that.error = null;
    that.onFulfilledCallBack = [];
    that.onRejectedCallBack = [];

    function reslove(val) {
        if (val instanceof myPromise) {
            return val.then(reslove, reject);
        }
        if (that.state === 'pending') {
            that.state = 'fulfilled';
            that.value = val;

            queueMicrotask(() => {
                that.onFulfilledCallBack.forEach(fn => fn(that.value));
            });
        }
    }

    function reject(err) {
        if (that.state === 'pending') {
            that.state = 'rejected';
            that.error = err;
            queueMicrotask(() => {
                that.onRejectedCallBack.forEach(fn => fn(that.error));
            });
        }
    }

    try {
        fn(reslove, reject);
    } catch (err) {
        reject(err);
    }
}

myPromise.prototype.then = function (onFulfilled, onRejected) {
    const that = this;
    let promise2;

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

    if (that.state === 'fulfilled') {
        return promise2 = new myPromise((reslove, reject) => {
            queueMicrotask(() => {
                try {
                    const x = onFulfilled(that.value);
                    reslovePromise(promise2, x, reslove, reject);
                } catch (err) {
                    reject(err);
                }
            })
        })
    }

    if (that.state === 'rejected') {
        return promise2 = new myPromise((reslove, reject) => {
            queueMicrotask(() => {
                try {
                    const x = onRejected(that.error);
                    reslovePromise(promise2, x, reslove, reject);
                } catch (err) {
                    reject(err);
                }
            })
        })
    }

    if (that.state === 'pending') {
        return promise2 = new myPromise((reslove, reject) => {
            that.onFulfilledCallBack.push(() => {
                try {
                    const x = onFulfilled(that.value);
                    reslovePromise(promise2, x, reslove, reject);
                } catch (err) {
                    reject(err);
                }
            });
            that.onRejectedCallBack.push(() => {
                try {
                    const x = onRejected(that.error);
                    reslovePromise(promise2, x, reslove, reject);
                } catch (err) {
                    reject(err);
                }
            });
        })
    }
}

function reslovePromise(promise2, x, reslove, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise!'));
    }

    let called = false;
    if (x instanceof myPromise) {
        if (x.state === 'pending') {
            x.then(val => {
                reslovePromise(promise2, val, reslove, reject);
            }, err => {
                reject(err);
            })
        } else {
            x.then(reslove, reject);
        }
        return;
    }

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    reslovePromise(promise2, y, reslove, reject);

                }, err => {
                    if (called) return;
                    called = true;
                    reject(err);
                })
            } else {
                reslove(x);
            }
        } catch (err) {
            if (called) return;
            called = true;
            reject(err);
        }
    } else {
        reslove(x);
    }
}

// 并发请求，返回所有结果
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        let resolveCount = 0;
        const result = [];
        for (let i = 0; i <= promises.length - 1; i++) {
            Promise.resolve(promises[i])
                .then((val) => {
                    resolveCount++;
                    result[i] = val;
                    if (resolveCount == promises.length) {
                        resolve(result);
                    }
                })
                .catch(err => {
                    return reject(err)
                })
        }
    });
}

// 并发请求，返回最快的结果
function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i <= promises.length - 1; i++) {
            Promise.resolve(promises[i])
                .then((val) => {
                    return resolve(val)
                })
                .catch((err) => {
                    return reject(err)
                })
        }
    })
}

function promiseAllSettled(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        const result = [];

        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i])
                .then((val) => {
                    result[i] = {
                        status: 'fulfilled',
                        value: val
                    }
                })
                .catch((err) => {
                    result[i] = {
                        status: 'rejected',
                        reason: err
                    }
                })
                .finally(() => {
                    count++;
                    if (count === promises.length) {
                        resolve(result);
                    }
                })
        }
    })
}

// 防抖
function debounce(fn, delay) {
    let timer = null;

    return function (...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay)
    }
}

// 节流
function throttle(fn, delay) {
    let timer = null;

    return function (...args) {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay)
    }

}

// 对象深拷贝
function cloneDeep() {

}

// 数组扁平化
function flat() {

}

// 千分位
function formatThousandth() {

}

// 版本号排序
function versionSort() {

}

// 分数转小数

function fractionToDecimal() {

}

// 小数转分数

function decimalToFraction() {

}

// 柯里化
function curry() {

}

// 判断数据类型
function getType() {

}

// 大数相加

function bigSum() {

}

// 发布订阅模式

function eventBus() {

}

// LRU 
function LRU() {

}

// 排序算法

// 冒泡排序
function bubbleSort() {

}

// 快速排序
function quickSort() {

}

// 插入排序
function insertSort() {

}

// 选择排序
function selectSort() {

}

// 堆排序
function heapSort() {

}

// 归并排序
function mergeSort() {

}

