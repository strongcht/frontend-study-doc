import{_ as a,c as e,o as n,N as r}from"./chunks/framework.d6f43b2b.js";const y=JSON.parse('{"title":"ES6 数组去重排序：","description":"","frontmatter":{},"headers":[],"relativePath":"study/javaScript/ES6.md","lastUpdated":null}'),l={name:"study/javaScript/ES6.md"},o=r(`<h1 id="es6-数组去重排序" tabindex="-1">ES6 数组去重排序： <a class="header-anchor" href="#es6-数组去重排序" aria-label="Permalink to &quot;ES6 数组去重排序：&quot;">​</a></h1><pre><code>let arr = [3,5,2,1,3,2,4];
let newArr = [ ...new Set( arr ) ].sort();
</code></pre><h1 id="拷贝数组" tabindex="-1">拷贝数组： <a class="header-anchor" href="#拷贝数组" aria-label="Permalink to &quot;拷贝数组：&quot;">​</a></h1><pre><code>// good
const itemsCopy = [...items];
</code></pre><h1 id="使用-array-from-方法-将类似数组的对象转为数组。" tabindex="-1">使用 Array.from 方法，将类似数组的对象转为数组。 <a class="header-anchor" href="#使用-array-from-方法-将类似数组的对象转为数组。" aria-label="Permalink to &quot;使用 Array.from 方法，将类似数组的对象转为数组。&quot;">​</a></h1><pre><code>const foo = document.querySelectorAll(&#39;.foo&#39;);
const nodes = Array.from(foo);
</code></pre><h1 id="es6-新增字符串处理方法" tabindex="-1">ES6 新增字符串处理方法： <a class="header-anchor" href="#es6-新增字符串处理方法" aria-label="Permalink to &quot;ES6 新增字符串处理方法：&quot;">​</a></h1><pre><code>String.fromCodePoint()  //新增 Unicode 码点返回对应字符
String.raw()   //该方法返回一个斜杠都被转义（每一个斜杠都会被转义）
实例方法：codePointAt() //与fromCodePoint()方法相反
实例方法：normalize() // 统一 【Ǒ（\\u01D1）】和【Ǒ（\\u004F\\u030C）】 &#39;\\u01D1&#39;.normalize() === &#39;\\u004F\\u030C&#39;.normalize()    返回// true
实例方法：includes(), startsWith(), endsWith()  // 包含，头部包含，尾部包含，返回值是一个bool型，接受第二个参数 从那开始---使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。
实例方法：repeat() //repeat方法返回一个新字符串，表示将原字符串重复n次
实例方法：padStart()，padEnd() // 头部补全，尾部补全&#39;x&#39;.padStart(4, &#39;ab&#39;) // &#39;abax&#39;       &#39;x&#39;.padEnd(5, &#39;ab&#39;) // &#39;xabab&#39;
实例方法：trimStart()，trimEnd()// 头部去空格，尾部去空格
实例方法：matchAll() // 正则全匹配
实例方法：replaceAll() // 可以一次性替换所有匹配。
</code></pre><h1 id="数组的扩展" tabindex="-1">数组的扩展 <a class="header-anchor" href="#数组的扩展" aria-label="Permalink to &quot;数组的扩展&quot;">​</a></h1><h2 id="_1-扩展运算符" tabindex="-1">1. 扩展运算符 <a class="header-anchor" href="#_1-扩展运算符" aria-label="Permalink to &quot;1. 扩展运算符&quot;">​</a></h2><h6 id="扩展运算符-spread-是三个点-。它好比-rest-参数的逆运算-将一个数组转为用逗号分隔的参数序列。" tabindex="-1">---扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。 <a class="header-anchor" href="#扩展运算符-spread-是三个点-。它好比-rest-参数的逆运算-将一个数组转为用逗号分隔的参数序列。" aria-label="Permalink to &quot;---扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。&quot;">​</a></h6><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">console.log(...[1, 2, 3])</span></span>
<span class="line"><span style="color:#A6ACCD;">// 1 2 3</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">console.log(1, ...[2, 3, 4], 5)</span></span>
<span class="line"><span style="color:#A6ACCD;">// 1 2 3 4 5</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="_2-array-of" tabindex="-1">2.Array.of() <a class="header-anchor" href="#_2-array-of" aria-label="Permalink to &quot;2.Array.of()&quot;">​</a></h2><h6 id="array-of-方法用于将一组值-转换为数组。" tabindex="-1">Array.of()方法用于将一组值，转换为数组。 <a class="header-anchor" href="#array-of-方法用于将一组值-转换为数组。" aria-label="Permalink to &quot;Array.of()方法用于将一组值，转换为数组。&quot;">​</a></h6><pre><code>Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
</code></pre><h2 id="_3-copywithin" tabindex="-1">3. copyWithin() <a class="header-anchor" href="#_3-copywithin" aria-label="Permalink to &quot;3. copyWithin()&quot;">​</a></h2><h6 id="数组实例的-copywithin-方法-在当前数组内部-将指定位置的成员复制到其他位置-会覆盖原有成员-然后返回当前数组。也就是说-使用这个方法-会修改当前数组。" tabindex="-1">数组实例的 copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。 <a class="header-anchor" href="#数组实例的-copywithin-方法-在当前数组内部-将指定位置的成员复制到其他位置-会覆盖原有成员-然后返回当前数组。也就是说-使用这个方法-会修改当前数组。" aria-label="Permalink to &quot;数组实例的 copyWithin()方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。&quot;">​</a></h6><p>它接受三个参数。</p><ul><li><p>target（必需）：从该位置开始替换数据。如果为负值，表示倒数。</p></li><li><p>start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。</p></li><li><p>end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。</p><p>[1, 2, 3, 4, 5].copyWithin(0, 3) // [4, 5, 3, 4, 5]</p></li></ul><h6 id="上面代码表示将从-3-号位直到数组结束的成员-4-和-5-复制到从-0-号位开始的位置-结果覆盖了原来的-1-和-2。" tabindex="-1">上面代码表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2。 <a class="header-anchor" href="#上面代码表示将从-3-号位直到数组结束的成员-4-和-5-复制到从-0-号位开始的位置-结果覆盖了原来的-1-和-2。" aria-label="Permalink to &quot;上面代码表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2。&quot;">​</a></h6><h2 id="_4-数组实例的-find-和-findindex" tabindex="-1">4.数组实例的 find() 和 findIndex() <a class="header-anchor" href="#_4-数组实例的-find-和-findindex" aria-label="Permalink to &quot;4.数组实例的 find() 和 findIndex()&quot;">​</a></h2><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">[1, 4, -5, 10].find((n) =&gt; n &lt; 0)</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">[1, 5, 10, 15].findIndex(function(value, index, arr) {</span></span>
<span class="line"><span style="color:#A6ACCD;">  return value &gt; 9;</span></span>
<span class="line"><span style="color:#A6ACCD;">}) // 2</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h6 id="数组实例的-findindex-方法的用法与-find-方法非常类似-返回第一个符合条件的数组成员的位置-如果所有成员都不符合条件-则返回-1。" tabindex="-1">数组实例的 findIndex 方法的用法与 find 方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。 <a class="header-anchor" href="#数组实例的-findindex-方法的用法与-find-方法非常类似-返回第一个符合条件的数组成员的位置-如果所有成员都不符合条件-则返回-1。" aria-label="Permalink to &quot;数组实例的 findIndex 方法的用法与 find 方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。&quot;">​</a></h6><h2 id="_5-fill" tabindex="-1">5.fill() <a class="header-anchor" href="#_5-fill" aria-label="Permalink to &quot;5.fill()&quot;">​</a></h2><h6 id="fill-方法使用给定值-填充一个数组。" tabindex="-1">fill 方法使用给定值，填充一个数组。 <a class="header-anchor" href="#fill-方法使用给定值-填充一个数组。" aria-label="Permalink to &quot;fill 方法使用给定值，填充一个数组。&quot;">​</a></h6><h6 id="fill-方法还可以接受第二个和第三个参数-用于指定填充的起始位置和结束位置。" tabindex="-1">fill 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。 <a class="header-anchor" href="#fill-方法还可以接受第二个和第三个参数-用于指定填充的起始位置和结束位置。" aria-label="Permalink to &quot;fill 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。&quot;">​</a></h6><pre><code>[&#39;a&#39;, &#39;b&#39;, &#39;c&#39;].fill(7, 1, 2)
// [&#39;a&#39;, 7, &#39;c&#39;]
</code></pre><h2 id="_6-数组实例的-entries-keys-和-values" tabindex="-1">6.数组实例的 entries()，keys() 和 values() <a class="header-anchor" href="#_6-数组实例的-entries-keys-和-values" aria-label="Permalink to &quot;6.数组实例的 entries()，keys() 和 values()&quot;">​</a></h2><p>ES6 提供三个新的方法——entries()，keys()和 values()——用于遍历数组。它们都返回一个遍历器对象（详见《Iterator》一章），可以用 for...of 循环进行遍历，唯一的区别是 keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。</p><pre><code>for (let index of [&#39;a&#39;, &#39;b&#39;].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of [&#39;a&#39;, &#39;b&#39;].values()) {
  console.log(elem);
}
// &#39;a&#39;
// &#39;b&#39;

for (let [index, elem] of [&#39;a&#39;, &#39;b&#39;].entries()) {
  console.log(index, elem);
}
// 0 &quot;a&quot;
// 1 &quot;b&quot;
</code></pre>`,30),s=[o];function t(i,d,c,p,h,f){return n(),e("div",null,s)}const b=a(l,[["render",t]]);export{y as __pageData,b as default};
