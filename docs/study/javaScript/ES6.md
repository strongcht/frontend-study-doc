# ES6 数组去重排序：

    let arr = [3,5,2,1,3,2,4];
    let newArr = [ ...new Set( arr ) ].sort();

# 拷贝数组：

    // good
    const itemsCopy = [...items];

# 使用 Array.from 方法，将类似数组的对象转为数组。

    const foo = document.querySelectorAll('.foo');
    const nodes = Array.from(foo);

# ES6 新增字符串处理方法：

    String.fromCodePoint()  //新增 Unicode 码点返回对应字符
    String.raw()   //该方法返回一个斜杠都被转义（每一个斜杠都会被转义）
    实例方法：codePointAt() //与fromCodePoint()方法相反
    实例方法：normalize() // 统一 【Ǒ（\u01D1）】和【Ǒ（\u004F\u030C）】 '\u01D1'.normalize() === '\u004F\u030C'.normalize()    返回// true
    实例方法：includes(), startsWith(), endsWith()  // 包含，头部包含，尾部包含，返回值是一个bool型，接受第二个参数 从那开始---使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。
    实例方法：repeat() //repeat方法返回一个新字符串，表示将原字符串重复n次
    实例方法：padStart()，padEnd() // 头部补全，尾部补全'x'.padStart(4, 'ab') // 'abax'       'x'.padEnd(5, 'ab') // 'xabab'
    实例方法：trimStart()，trimEnd()// 头部去空格，尾部去空格
    实例方法：matchAll() // 正则全匹配
    实例方法：replaceAll() // 可以一次性替换所有匹配。

# 数组的扩展

## 1. 扩展运算符

###### ---扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

```
console.log(...[1, 2, 3])
// 1 2 3

console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5

```

## 2.Array.of()

###### Array.of()方法用于将一组值，转换为数组。

    Array.of(3, 11, 8) // [3,11,8]
    Array.of(3) // [3]
    Array.of(3).length // 1

## 3. copyWithin()

###### 数组实例的 copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

它接受三个参数。

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

  [1, 2, 3, 4, 5].copyWithin(0, 3)
  // [4, 5, 3, 4, 5]

###### 上面代码表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2。

## 4.数组实例的 find() 和 findIndex()

```
[1, 4, -5, 10].find((n) => n < 0)

[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 2

```

###### 数组实例的 findIndex 方法的用法与 find 方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。

## 5.fill()

###### fill 方法使用给定值，填充一个数组。

###### fill 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

    ['a', 'b', 'c'].fill(7, 1, 2)
    // ['a', 7, 'c']

## 6.数组实例的 entries()，keys() 和 values()

ES6 提供三个新的方法——entries()，keys()和 values()——用于遍历数组。它们都返回一个遍历器对象（详见《Iterator》一章），可以用 for...of 循环进行遍历，唯一的区别是 keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。

    for (let index of ['a', 'b'].keys()) {
      console.log(index);
    }
    // 0
    // 1

    for (let elem of ['a', 'b'].values()) {
      console.log(elem);
    }
    // 'a'
    // 'b'

    for (let [index, elem] of ['a', 'b'].entries()) {
      console.log(index, elem);
    }
    // 0 "a"
    // 1 "b"
