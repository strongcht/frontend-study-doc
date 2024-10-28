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

// 数组
// 1. 最长递增子序列 （动态规划）
// 输入： [3,5,7,1,2,8] 输出：[3,5,7,8]

function lengthOfLIS(nums) {
    const dp = new Array(nums.length).fill(1);

    for (let i = 0; i < nums.length; i++) {
        for (let j = i; i < nums.length; j++) {
            if (nums[i] < nums[j]) {
                dp[j] = Math.max(dp[j], dp[i] + 1);
            }
        }
    }
    return Math.max(...dp);
}

// 2.买股票问题（动态规划）
// [1, 12, 13, 9, 15, 8, 6, 16]，fee为 2，求获得利润的最大值一次买入 卖出只收一次手续费

function buyStock(nums, fee) {

    // dp[i][0] 第i天介绍手里没有股票的最大利润
    // dp[i][0] = Math.max(dp[i - 1][1] + nums[i] - fee, dp[i - 1][0]);
    // dp[i][1] 第i天介绍手里有股票的最大利润
    // dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - nums[i] - fee);

    const dp = Array.from(new Array(nums.length), () => new Array(2).fill(0));
    dp[0][0] = 0;
    dp[0][1] = -nums[0] - fee;

    for (let i = 1; i < nums.length; i++) {
        dp[i][0] = Math.max(dp[i - 1][1] + nums[i] - fee, dp[i - 1][0]);
        dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - nums[i] - fee);
    }

    return dp[nums.length - 1][0];
}

// 3.硬币找零问题 (动态规划) 
// 贪心算法存在问题 coins: [1, 20, 50] amount: 60 贪心算法 50 + 10 * 1  正确答案 20 + 20 + 10

// 输入 coins = [1, 2, 5], amount = 11  最少硬币数 没有返回-1

function findCoins(coins, amount) {
    if (coins.length === 0) return -1;
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    for (let i = 1; i <= amount; i++) {
        for (let j = 0; j < coins.length; j++) {
            if (i - coins[j] >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
            }
        }
    }

    return dp[amount] === Infinity ? -1 : dp[amount];
}

// 4. 数组拼接最小值(sort排序)
// 如[3, 45, 12]，拼接的最小值为12345
function printMinNumber(arr) {
    arr.sort((a, b) => {
        return (`${a}${b}`) - (`${b}${a}`);
    });

    return arr.join('');
}

// 5.奇偶排序（双指针）
// 一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有的奇数位于数组的前半部分，所有的偶数位于数组的后半部分
function exchangeOddEven(arr) {
    let l = 0, r = arr.length - 1;

    while (l < r) {
        while (l < r && arr[l] % 2 === 1) {
            l++
        }

        while (l < r && arr[r] % 2 === 0) {
            r--;
        }

        if (l < r) {
            [arr[l], arr[r]] = [arr[r], arr[l]];
            l++;
            r--;
        }

    }
    return arr;
}

// 6.两数之和(Map 快速查找)
// 给定一个整数数组 nums 和一个目标值 target在该数组中找出和为目标值的两个整数，并返回他们
function twoSum(arr, target) {
    const map = new Map();

    for (let i = 0; i < arr.lengthl i++) {
        const count = target - arr[i];
        if (map.has(count)) {
            return [i, map.get(count)]
        }

        map.set(arr[i], i);
    }
    return [];
}

// 7.三数之和（双指针）
// 给定一个整数数组，找出所有满足条件的三个数，使得三个数的和为0，返回所有满足条件的数组
function threeSum(arr, target) {
    arr.sort();
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (i > 0 && arr[i] === arr[i - 1]) continue;
        let l = i + 1, r = arr.length - 1;
        const count = target - arr[i];

        while (l < r) {

            if (arr[l] + arr[r] === count) {
                result.push([arr[i], arr[l++], arr[r--]]);

                while (l < r && arr[l] === arr[l - 1]) {
                    l++;
                }

                while (l < r && arr[r] === arr[r + 1]) {
                    r--;
                }
            } else if (arr[l] + arr[r] < count) {
                l++;
            } else {
                r--;
            }

        }
    }

    return result;
}

// 8.四数之和
// 给定一个整数数组 nums，判断 nums 中是否存在四个元素a，b，c，d ，使得 a + b + c + d = target，找出所有满足条件且不重复的四元组合

function fourSum(arr, target) {
    if (arr.length < 4) return [];
    arr.sort();
    const result = [];
    const length = arr.length;

    for (let i = 0; i < length - 3; i++) {
        if (i > 0 && arr[i] === arr[i - 1]) continue;
        if (arr[i] + arr[i + 1] + arr[i + 2] + arr[i + 3] > target) break;
        if (arr[i] + arr[length - 1] + arr[length - 2] + arr[length - 3] < target) continue;

        for (let j = i + 1; j < length - 2; j++) {
            if (j > i + 1 && arr[j] === arr[j - 1]) continue;
            if (arr[i] + arr[j] + arr[j + 1] + arr[j + 2] > target) break;
            if (arr[i] + arr[j] + arr[length - 1] + arr[length - 2] < target) continue;
            let l = j + 1, r = length - 1;
            const count = target - arr[i] - arr[j];

            while (l < r) {
                if (arr[l] + arr[r] === count) {
                    result.push([arr[i], arr[j], arr[l++], arr[r--]]);
                    while (l < r && arr[l] === arr[l - 1]) {
                        l++;
                    }

                    while (l < r && arr[r] === arr[r + 1]) {
                        r--;
                    }
                } else if (arr[l] + arr[r] < count) {
                    l++;
                } else {
                    r--;
                }
            }



        }
    }

    return result;
}

// 9.连续整数之和 （滑动窗口）
// 给定一个正整数 target，输出所有和为 target 的连续正整数序列（至少含有两个数）



