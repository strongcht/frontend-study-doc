import{_ as s,c as a,o as n,N as l}from"./chunks/framework.d6f43b2b.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{"layout":"doc"},"headers":[],"relativePath":"study/css/grid.md","lastUpdated":null}'),e={name:"study/css/grid.md"},p=l(`<h2 id="一、基本概念" tabindex="-1">一、基本概念 <a class="header-anchor" href="#一、基本概念" aria-label="Permalink to &quot;一、基本概念&quot;">​</a></h2><h4 id="_1-1-容器-container-和项目-item" tabindex="-1">1.1 容器(container)和项目(item) <a class="header-anchor" href="#_1-1-容器-container-和项目-item" aria-label="Permalink to &quot;1.1 容器(container)和项目(item)&quot;">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">&lt;div class=&quot;container&quot;&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;div class=&quot;item&quot;&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        &lt;p&gt;1&lt;/p&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;/div&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;div class=&quot;item&quot;&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        &lt;p&gt;2&lt;/p&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;/div&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;div class=&quot;item&quot;&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">        &lt;p&gt;3&lt;/p&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    &lt;/div&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">&lt;/div&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>其中最外层的 div 称为容器(container);内层的三个 div 称为项目(item)</p><h4 id="_1-2-行-row-和列-column" tabindex="-1">1.2 行(row)和列(column) <a class="header-anchor" href="#_1-2-行-row-和列-column" aria-label="Permalink to &quot;1.2 行(row)和列(column)&quot;">​</a></h4><p>横为行，纵为列</p><h4 id="_1-3-单元格-cell" tabindex="-1">1.3 单元格(cell) <a class="header-anchor" href="#_1-3-单元格-cell" aria-label="Permalink to &quot;1.3 单元格(cell)&quot;">​</a></h4><p>行与列交叉的区域</p><h4 id="_1-4-网格线-grid-line" tabindex="-1">1.4 网格线(grid line) <a class="header-anchor" href="#_1-4-网格线-grid-line" aria-label="Permalink to &quot;1.4 网格线(grid line)&quot;">​</a></h4><p>划分网格的线，其中水平网格线划分出行，垂直网格线划分出列。</p><h2 id="二、容器属性-container" tabindex="-1">二、容器属性(container) <a class="header-anchor" href="#二、容器属性-container" aria-label="Permalink to &quot;二、容器属性(container)&quot;">​</a></h2><p>Grid 布局的属性分成两类。一类定义在容器上面，称为容器属性；另一类定义在项目上面，称为项目属性。</p><h4 id="_2-1-dispaly-grid-指定容器采用网格布局" tabindex="-1">2.1 dispaly: grid;指定容器采用网格布局 <a class="header-anchor" href="#_2-1-dispaly-grid-指定容器采用网格布局" aria-label="Permalink to &quot;2.1 dispaly: grid;指定容器采用网格布局&quot;">​</a></h4><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid; // 容器默认为块级元素；</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: inline-grid; // 指定容器为行列快元素，并采用grid布局</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>注意，设为网格布局以后，容器子元素（项目）的 float、display: inline-block、display: table-cell、vertical-align 和 column-*等设置都将失效.</p></blockquote><h4 id="_2-2-grid-tempalte-columns-属性-grid-template-rows-属性" tabindex="-1">2.2 grid-tempalte-columns 属性，grid-template-rows 属性 <a class="header-anchor" href="#_2-2-grid-tempalte-columns-属性-grid-template-rows-属性" aria-label="Permalink to &quot;2.2 grid-tempalte-columns 属性，grid-template-rows 属性&quot;">​</a></h4><p>其中 grid-tempalte-columns 属性定义每一列的宽度；grid-tempalte-rows 属性定义每一列的宽度</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-columns: 100px 100px 100px;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-rows: 100px 100px 100px;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>上面代码的意思为容器分为三行三列，且每一行和列的宽度均为 100px 也可以用百分比</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-columns: 33.33% 33.33% 33.33%;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-rows: 33.33% 33.33% 33.33%;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h5 id="_2-2-1-repeat-方法" tabindex="-1">2.2.1 repeat()方法 <a class="header-anchor" href="#_2-2-1-repeat-方法" aria-label="Permalink to &quot;2.2.1 repeat()方法&quot;">​</a></h5><p><code>repeat(重复次数，重复的宽度)</code>;</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-columns: repeat(3,33.33%);</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-rows: repeat(3,100px);</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 也可以重复多个宽度</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-columns: repeat(2, 100px 20px 80px);</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h5 id="_2-2-2-auto-fill-关键字" tabindex="-1">2.2.2 auto-fill 关键字 <a class="header-anchor" href="#_2-2-2-auto-fill-关键字" aria-label="Permalink to &quot;2.2.2 auto-fill 关键字&quot;">​</a></h5><p>有时容器的宽度不确定，而单元格的大小是固定的，如果希望每一行和列尽可能多的容纳单元格，这样就可以用<code>auto-fill</code> 关键字来自动填充</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-columns: repeat(auto-fill,100px);</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-rows: repeat(auto-fill,100px);</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h5 id="_2-2-3-fr-关键字" tabindex="-1">2.2.3 fr 关键字 <a class="header-anchor" href="#_2-2-3-fr-关键字" aria-label="Permalink to &quot;2.2.3 fr 关键字&quot;">​</a></h5><p>为了方便表示比例关系，网格布局提供了<code>fr</code> 关键字。如果两列的宽度分别为 <code>1fr, 2fr</code> 表示后者是前者的两倍</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 表示两列 且宽度相同</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-columns: 1fr 1fr;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    //也可以和绝对长度混合使用</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-columns: 150px 1fr 2fr;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h5 id="_2-2-4-minmax-表示长度范围" tabindex="-1">2.2.4 minmax() 表示长度范围 <a class="header-anchor" href="#_2-2-4-minmax-表示长度范围" aria-label="Permalink to &quot;2.2.4 minmax() 表示长度范围&quot;">​</a></h5><p><code>minmax(最小值，最大值)</code></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-tempalte-columns: 1fr 1fr minmax(100px,1fr);</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h5 id="_2-2-5-auto-关键字" tabindex="-1">2.2.5 auto 关键字 <a class="header-anchor" href="#_2-2-5-auto-关键字" aria-label="Permalink to &quot;2.2.5 auto 关键字&quot;">​</a></h5><p>有浏览器自动填充</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 表示第二列宽度自适应</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-columns: 100px auto 100px;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h5 id="_2-2-6-网格线名称" tabindex="-1">2.2.6 网格线名称 <a class="header-anchor" href="#_2-2-6-网格线名称" aria-label="Permalink to &quot;2.2.6 网格线名称&quot;">​</a></h5><p><code>grid-template-columns</code>属性和 <code>grid-template-rows</code>属性中可用方括号指定每一个网格线的名字，方便以后引用</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    // 允许同一根网格线有多个名字，比如[fifth-line row-5]</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="_2-3-grid-row-gap-属性-grid-column-gap-属性-grid-gap-属性" tabindex="-1">2.3 grid-row-gap 属性，grid-column-gap 属性，grid-gap 属性 <a class="header-anchor" href="#_2-3-grid-row-gap-属性-grid-column-gap-属性-grid-gap-属性" aria-label="Permalink to &quot;2.3 grid-row-gap 属性，grid-column-gap 属性，grid-gap 属性&quot;">​</a></h4><blockquote><p><code>grid-row-gap</code> 属性设置行于行之间的间隔， <code>grid-column-gap</code> 属性 用于设置列于列之间的间隔。</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row-gap: 20px;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-gap: 20px;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">    // grid-gap 属性为行一列属性的简写 上面的代码可写为</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-gap: 20px 20px;</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 其中行一列的宽度一致可省略一个参数，</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-gap: 20px;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>根据最新标准，上面三个属性名的 grid-前缀已经删除，grid-column-gap 和 grid-row-gap 写成 column-gap 和 row-gap，grid-gap 写成 gap。</p></blockquote><h4 id="_2-4-grid-template-areas-属性" tabindex="-1">2.4 grid-template-areas 属性 <a class="header-anchor" href="#_2-4-grid-template-areas-属性" aria-label="Permalink to &quot;2.4 grid-template-areas 属性&quot;">​</a></h4><p>网格布局允许指定区域(area),一个区域由单个多多个单元格组成。 <code>grid-template-areas</code> 属性用于定义区域</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-columns: repeat(3,100px);</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-rows: repeat(3,100px);</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-areas: &#39;a b c&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                         &#39;d e f&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                         &#39;g h i&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">    //上面代码先划分出9个单元格，然后将其定名为a到i的九个区域，分别对应这九个单元格</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 多个单元格合并成一个区域的写法如下</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-areas: &#39;a a a&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                         &#39;b b b&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                         &#39;c c c&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">    //上面代码将9个单元格分成a、b、c三个区域</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 如果某些区域不需要利用，则使用&quot;点&quot;（.）表示。</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-areas: &#39;a . c&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                         &#39;d . f&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;">                         &#39;g . i&#39;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为<code>区域名-start</code>，终止网格线自动命名为<code>区域名-end</code>。</p></blockquote><blockquote><p>比如，区域名为<code>header</code>，则起始位置的水平网格线和垂直网格线叫做<code>header-start</code>，终止位置的水平网格线和垂直网格线叫做<code>header-end</code>。</p></blockquote><h4 id="_2-5-grid-auto-flow-属性" tabindex="-1">2.5 grid-auto-flow 属性 <a class="header-anchor" href="#_2-5-grid-auto-flow-属性" aria-label="Permalink to &quot;2.5 grid-auto-flow 属性&quot;">​</a></h4><p>划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是“先行后列”，即先填满第一行，在开始放入第二行。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    // grid-auto-flow 属性默认值为row</span></span>
<span class="line"><span style="color:#A6ACCD;">    若需要按先列后行则需修改该属性为column</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-auto-flow: column;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>其中若选择排列方式之后并想 尽可能紧密填充，尽量不出现空格，则可设置为：</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-auto-flow: row dense;</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 列排序</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-auto-flow: column dense;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="_2-6-justify-items-属性-align-items-属性-palce-items-属性" tabindex="-1">2.6 justify-items 属性，align-items 属性，palce-items 属性 <a class="header-anchor" href="#_2-6-justify-items-属性-align-items-属性-palce-items-属性" aria-label="Permalink to &quot;2.6 justify-items 属性，align-items 属性，palce-items 属性&quot;">​</a></h4><p><code>justify-items</code> 属性设置单元格内容的水平位置; <code>align-items</code> 属性设置单元格内容的垂直位置; <code>place-items</code> 属性是 <code>align-items</code> 属性和 <code>justify-items</code> 属性的简写形式 <code>place-items:&lt;align-items&gt; &lt;justify-items&gt;</code>;</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    justify-items: start | end | center | stretch;</span></span>
<span class="line"><span style="color:#A6ACCD;">    align-items: start | end |center | stretch;</span></span>
<span class="line"><span style="color:#A6ACCD;">    place-items: start end;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li><p>start：对齐单元格的起始边缘。</p></li><li><p>end：对齐单元格的结束边缘。</p></li><li><p>center：单元格内部居中。</p></li><li><p>stretch：拉伸，占满单元格的整个宽度（默认值）。</p></li></ul><h4 id="_2-7-justify-content-属性-align-content-属性-place-content-属性" tabindex="-1">2.7 justify-content 属性， align-content 属性， place-content 属性 <a class="header-anchor" href="#_2-7-justify-content-属性-align-content-属性-place-content-属性" aria-label="Permalink to &quot;2.7 justify-content 属性， align-content 属性， place-content 属性&quot;">​</a></h4><p><code>justify-content</code> 属性是整个内容区域在容器里面的水平位置； <code>align-content</code>属性是真个内容区域在容器中的垂直位置； <code>place-content</code>属性是上两个属性的简写 <code>place-content:&lt;align-content&gt; &lt;justify-content&gt;</code>;</p><ul><li>start：对齐容器的起始边框。</li><li>end：对齐容器的结束边框。</li><li>center：容器内部居中。</li><li>stretch：项目大小没有指定时，拉伸占据整个网格容器。</li><li>space-around: 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。</li><li>space-between: 项目与项目的间隔相等，项目与容器边框之间没有间隔。</li><li>space-evenly: 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。</li></ul><h4 id="_2-8-grid-auto-columns-属性-grid-auto-rows-属性" tabindex="-1">2.8 grid-auto-columns 属性，grid-auto-rows 属性 <a class="header-anchor" href="#_2-8-grid-auto-columns-属性-grid-auto-rows-属性" aria-label="Permalink to &quot;2.8 grid-auto-columns 属性，grid-auto-rows 属性&quot;">​</a></h4><p><code>grid-auto-columns</code>属性和<code>grid-auto-rows</code>属性用来设置，浏览器自动创建的多余网格的列宽和行高</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.container {</span></span>
<span class="line"><span style="color:#A6ACCD;">    display: grid;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-columns: 100px 100px 100px;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-template-rows: 100px 100px 100px;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-auto-rows: 50px;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="_2-9-grid-template-属性-grid-属性" tabindex="-1">2.9 grid-template 属性 ，grid 属性 <a class="header-anchor" href="#_2-9-grid-template-属性-grid-属性" aria-label="Permalink to &quot;2.9 grid-template 属性 ，grid 属性&quot;">​</a></h4><p><code>grid-template</code>属性是<code>grid-template-columns</code>、<code>grid-template-rows</code>和<code>grid-template-areas</code>这三个属性的合并简写形式。</p><p><code>grid</code>属性是<code>grid-template-rows</code>、<code>grid-template-columns</code>、<code>grid-template-areas</code>、 <code>grid-auto-rows</code>、<code>grid-auto-columns</code>、<code>grid-auto-flow</code>这六个属性的合并简写形式。</p><h2 id="三、项目属性" tabindex="-1">三、项目属性 <a class="header-anchor" href="#三、项目属性" aria-label="Permalink to &quot;三、项目属性&quot;">​</a></h2><h4 id="_3-1-grid-columns-start-属性-grid-columns-end-属性-grid-row-start-属性-grid-row-end-属性" tabindex="-1">3.1 grid-columns-start 属性，grid-columns-end 属性,grid-row-start 属性，grid-row-end 属性 <a class="header-anchor" href="#_3-1-grid-columns-start-属性-grid-columns-end-属性-grid-row-start-属性-grid-row-end-属性" aria-label="Permalink to &quot;3.1 grid-columns-start 属性，grid-columns-end 属性,grid-row-start 属性，grid-row-end 属性&quot;">​</a></h4><p>项目的位置是可以指定的，具体方法就是致电给项目的四个边框，分别定位在哪根网格线。</p><ul><li>grid-column-start 属性：左边框所在的垂直网格线</li><li>grid-column-end 属性：右边框所在的垂直网格线</li><li>grid-row-start 属性：上边框所在的水平网格线</li><li>grid-row-end 属性：下边框所在的水平网格线</li></ul><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-start: 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-end: 4;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-start: 1;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-end: 3;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row-start: 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row-end: 4;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>这四个属性的值，除了指定为第几个网格线，还可以指定为网格线的名字。</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-start: header-start;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-end: header-end;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>这四个属性的值还可以使用<code>span</code>关键字，表示&quot;跨越&quot;，即左右边框（上下边框）之间跨越多少个网格。</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-start: span 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">    // 与上面的写法具有相同的效果</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-end: span 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p>使用这四个属性，如果产生了项目的重叠，则使用<code>z-index</code>属性指定项目的重叠顺序。</p></blockquote><h4 id="_3-2-grid-column-属性-grid-row-属性" tabindex="-1">3.2 grid-column 属性,grid-row 属性 <a class="header-anchor" href="#_3-2-grid-column-属性-grid-row-属性" aria-label="Permalink to &quot;3.2 grid-column 属性,grid-row 属性&quot;">​</a></h4><p><code>grid-column</code>属性是<code>grid-column-start</code>和<code>grid-column-end</code>的合并简写形式; <code>grid-row</code>属性是<code>grid-row-start</code>属性和<code>grid-row-end</code>的合并简写形式。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column: &lt;start-line&gt; / &lt;end-line&gt;;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row: &lt;start-line&gt; / &lt;end-line&gt;;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column: 1 / 3;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row: 1 / 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">/* 等同于 */</span></span>
<span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-start: 1;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column-end: 3;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row-start: 1;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row-end: 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><p>上面代码中，项目<code>item-1</code>占据第一行，从第一根列线到第三根列线。</p><p>这两个属性之中，也可以使用<code>span</code>关键字，表示跨越多少个网格。</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    background: #b03532;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column: 1 / 3;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row: 1 / 3;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">/* 等同于 */</span></span>
<span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    background: #b03532;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-column: 1 / span 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-row: 1 / span 2;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="_3-3-grid-area-属性" tabindex="-1">3.3 grid-area 属性 <a class="header-anchor" href="#_3-3-grid-area-属性" aria-label="Permalink to &quot;3.3 grid-area 属性&quot;">​</a></h4><p><code>grid-area</code>属性指定项目放在哪个区域</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-aera: e;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><blockquote><p><code>grid-area</code>属性还可用作<code>grid-row-start</code>、<code>grid-column-start</code>、<code>grid-row-end</code>、<code>grid-column-end</code>的合并简写形式，直接指定项目的位置。</p></blockquote><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-area: &lt;row-start&gt; / &lt;column-start&gt; / &lt;row-end&gt; / &lt;column-end&gt;;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">.item-1 {</span></span>
<span class="line"><span style="color:#A6ACCD;">    grid-area: 1 / 1 / 3 / 3;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h4 id="_3-4-justify-self-属性-align-self-属性-place-self-属性" tabindex="-1">3.4 justify-self 属性，align-self 属性，place-self 属性 <a class="header-anchor" href="#_3-4-justify-self-属性-align-self-属性-place-self-属性" aria-label="Permalink to &quot;3.4 justify-self 属性，align-self 属性，place-self 属性&quot;">​</a></h4><p><code>justify-self</code> 属性设置单元格内容水平位置； <code>align-self</code> 属性设置单元格美容的垂直位置； <code>place-self</code> 属性为<code>justify-self </code>属性和<code>align-self</code>属性的简写 <code>palce-self:&lt;align-self&gt; &lt;justify-self&gt;;</code></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">.item{</span></span>
<span class="line"><span style="color:#A6ACCD;">    justify-self: start | end | center | stretch;</span></span>
<span class="line"><span style="color:#A6ACCD;">    align-self: start | end | center | stretch;</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>start：对齐单元格的起始边缘。</li><li>end：对齐单元格的结束边缘。</li><li>center：单元格内部居中。</li><li>stretch：拉伸，占满单元格的整个宽度（默认值。</li></ul>`,90),o=[p];function t(c,i,r,d,C,A){return n(),a("div",null,o)}const y=s(e,[["render",t]]);export{u as __pageData,y as default};
