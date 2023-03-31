---
layout: doc
---

## 一、基本概念

#### 1.1 容器(container)和项目(item)

```html
<div class="container">
  <div class="item">
    <p>1</p>
  </div>
  <div class="item">
    <p>2</p>
  </div>
  <div class="item">
    <p>3</p>
  </div>
</div>
```

其中最外层的 div 称为容器(container);内层的三个 div 称为项目(item)

#### 1.2 行(row)和列(column)

横为行，纵为列

#### 1.3 单元格(cell)

行与列交叉的区域

#### 1.4 网格线(grid line)

划分网格的线，其中水平网格线划分出行，垂直网格线划分出列。

## 二、容器属性(container)

Grid 布局的属性分成两类。一类定义在容器上面，称为容器属性；另一类定义在项目上面，称为项目属性。

#### 2.1 dispaly: grid;指定容器采用网格布局

```css
.container {
  display: grid; // 容器默认为块级元素；
  display: inline-grid; // 指定容器为行列快元素，并采用grid布局
}
```

> 注意，设为网格布局以后，容器子元素（项目）的 float、display: inline-block、display: table-cell、vertical-align 和 column-\*等设置都将失效.

#### 2.2 grid-tempalte-columns 属性，grid-template-rows 属性

其中 grid-tempalte-columns 属性定义每一列的宽度；grid-tempalte-rows 属性定义每一列的宽度

```css
.container {
  display: grid;
  grid-tempalte-columns: 100px 100px 100px;
  grid-tempalte-rows: 100px 100px 100px;
}
```

> 上面代码的意思为容器分为三行三列，且每一行和列的宽度均为 100px
> 也可以用百分比

```css
.container {
  display: grid;
  grid-tempalte-columns: 33.33% 33.33% 33.33%;
  grid-tempalte-rows: 33.33% 33.33% 33.33%;
}
```

##### 2.2.1 repeat()方法

`repeat(重复次数，重复的宽度)`;

```css
.container {
  display: grid;
  grid-tempalte-columns: repeat(3, 33.33%);
  grid-tempalte-rows: repeat(3, 100px);
  // 也可以重复多个宽度
  grid-template-columns: repeat(2, 100px 20px 80px);
}
```

##### 2.2.2 auto-fill 关键字

有时容器的宽度不确定，而单元格的大小是固定的，如果希望每一行和列尽可能多的容纳单元格，这样就可以用`auto-fill` 关键字来自动填充

```css
.container {
  display: grid;
  grid-tempalte-columns: repeat(auto-fill, 100px);
  grid-template-rows: repeat(auto-fill, 100px);
}
```

##### 2.2.3 fr 关键字

为了方便表示比例关系，网格布局提供了`fr` 关键字。如果两列的宽度分别为 `1fr, 2fr` 表示后者是前者的两倍

```css
.container {
  display: grid;
  // 表示两列 且宽度相同
  grid-tempalte-columns: 1fr 1fr;

  //也可以和绝对长度混合使用
  grid-template-columns: 150px 1fr 2fr;
}
```

##### 2.2.4 minmax() 表示长度范围

`minmax(最小值，最大值)`

```css
.container {
  display: grid;
  grid-tempalte-columns: 1fr 1fr minmax(100px, 1fr);
}
```

##### 2.2.5 auto 关键字

有浏览器自动填充

```css
.container {
  display: grid;
  // 表示第二列宽度自适应
  grid-template-columns: 100px auto 100px;
}
```

##### 2.2.6 网格线名称

`grid-template-columns`属性和 `grid-template-rows`属性中可用方括号指定每一个网格线的名字，方便以后引用

```css
.container {
  display: grid;
  grid-template-columns: [c1] 100px [c2] 100px [c3] auto [c4];
  grid-template-rows: [r1] 100px [r2] 100px [r3] auto [r4];

  // 允许同一根网格线有多个名字，比如[fifth-line row-5]
}
```

#### 2.3 grid-row-gap 属性，grid-column-gap 属性，grid-gap 属性

> `grid-row-gap` 属性设置行于行之间的间隔， `grid-column-gap` 属性 用于设置列于列之间的间隔。

```css
.container {
  display: grid;
  grid-row-gap: 20px;
  grid-column-gap: 20px;

  // grid-gap 属性为行一列属性的简写 上面的代码可写为
  grid-gap: 20px 20px;
  // 其中行一列的宽度一致可省略一个参数，
  grid-gap: 20px;
}
```

> 根据最新标准，上面三个属性名的 grid-前缀已经删除，grid-column-gap 和 grid-row-gap 写成 column-gap 和 row-gap，grid-gap 写成 gap。

#### 2.4 grid-template-areas 属性

网格布局允许指定区域(area),一个区域由单个多多个单元格组成。
`grid-template-areas` 属性用于定义区域

```css
.container {
    display: grid;
    grid-template-columns: repeat(3,100px);
    grid-template-rows: repeat(3,100px);
    grid-template-areas: 'a b c'
                         'd e f'
                         'g h i'
    //上面代码先划分出9个单元格，然后将其定名为a到i的九个区域，分别对应这九个单元格
    // 多个单元格合并成一个区域的写法如下
    grid-template-areas: 'a a a'
                         'b b b'
                         'c c c'
    //上面代码将9个单元格分成a、b、c三个区域
    // 如果某些区域不需要利用，则使用"点"（.）表示。
    grid-template-areas: 'a . c'
                         'd . f'
                         'g . i'

}
```

> 注意，区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为`区域名-start`，终止网格线自动命名为`区域名-end`。

> 比如，区域名为`header`，则起始位置的水平网格线和垂直网格线叫做`header-start`，终止位置的水平网格线和垂直网格线叫做`header-end`。

#### 2.5 grid-auto-flow 属性

划分网格以后，容器的子元素会按照顺序，自动放置在每一个网格。默认的放置顺序是“先行后列”，即先填满第一行，在开始放入第二行。

```css
.container {
    display: grid;
    // grid-auto-flow 属性默认值为row
    若需要按先列后行则需修改该属性为column
    grid-auto-flow: column;
}

```

其中若选择排列方式之后并想 尽可能紧密填充，尽量不出现空格，则可设置为：

```css
.container {
  display: grid;
  grid-auto-flow: row dense;
  // 列排序
  grid-auto-flow: column dense;
}
```

#### 2.6 justify-items 属性，align-items 属性，palce-items 属性

`justify-items` 属性设置单元格内容的水平位置;
`align-items` 属性设置单元格内容的垂直位置;
`place-items` 属性是 `align-items` 属性和 `justify-items` 属性的简写形式 `place-items:<align-items> <justify-items>`;

```css
.container {
  justify-items: start | end | center | stretch;
  align-items: start | end |center | stretch;
  place-items: start end;
}
```

- start：对齐单元格的起始边缘。

- end：对齐单元格的结束边缘。
- center：单元格内部居中。
- stretch：拉伸，占满单元格的整个宽度（默认值）。

#### 2.7 justify-content 属性， align-content 属性， place-content 属性

`justify-content` 属性是整个内容区域在容器里面的水平位置；
`align-content`属性是真个内容区域在容器中的垂直位置；
`place-content`属性是上两个属性的简写
`place-content:<align-content> <justify-content>`;

- start：对齐容器的起始边框。
- end：对齐容器的结束边框。
- center：容器内部居中。
- stretch：项目大小没有指定时，拉伸占据整个网格容器。
- space-around: 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与容器边框的间隔大一倍。
- space-between: 项目与项目的间隔相等，项目与容器边框之间没有间隔。
- space-evenly: 项目与项目的间隔相等，项目与容器边框之间也是同样长度的间隔。

#### 2.8 grid-auto-columns 属性，grid-auto-rows 属性

`grid-auto-columns`属性和`grid-auto-rows`属性用来设置，浏览器自动创建的多余网格的列宽和行高

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-template-rows: 100px 100px 100px;
  grid-auto-rows: 50px;
}
```

#### 2.9 grid-template 属性 ，grid 属性

`grid-template`属性是`grid-template-columns`、`grid-template-rows`和`grid-template-areas`这三个属性的合并简写形式。

`grid`属性是`grid-template-rows`、`grid-template-columns`、`grid-template-areas`、 `grid-auto-rows`、`grid-auto-columns`、`grid-auto-flow`这六个属性的合并简写形式。

## 三、项目属性

#### 3.1 grid-columns-start 属性，grid-columns-end 属性,grid-row-start 属性，grid-row-end 属性

项目的位置是可以指定的，具体方法就是致电给项目的四个边框，分别定位在哪根网格线。

- grid-column-start 属性：左边框所在的垂直网格线
- grid-column-end 属性：右边框所在的垂直网格线
- grid-row-start 属性：上边框所在的水平网格线
- grid-row-end 属性：下边框所在的水平网格线

```css
.item-1 {
  grid-column-start: 2;
  grid-column-end: 4;
}

.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
  grid-row-end: 4;
}
```

> 这四个属性的值，除了指定为第几个网格线，还可以指定为网格线的名字。

```css
.item-1 {
  grid-column-start: header-start;
  grid-column-end: header-end;
}
```

> 这四个属性的值还可以使用`span`关键字，表示"跨越"，即左右边框（上下边框）之间跨越多少个网格。

```css
.item-1 {
  grid-column-start: span 2;
  // 与上面的写法具有相同的效果
  grid-column-end: span 2;
}
```

> 使用这四个属性，如果产生了项目的重叠，则使用`z-index`属性指定项目的重叠顺序。

#### 3.2 grid-column 属性,grid-row 属性

`grid-column`属性是`grid-column-start`和`grid-column-end`的合并简写形式;
`grid-row`属性是`grid-row-start`属性和`grid-row-end`的合并简写形式。

```css
.item {
  grid-column: <start-line> / <end-line>;
  grid-row: <start-line> / <end-line>;
}
.item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
/* 等同于 */
.item-1 {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
```

上面代码中，项目`item-1`占据第一行，从第一根列线到第三根列线。

这两个属性之中，也可以使用`span`关键字，表示跨越多少个网格。

```css
.item-1 {
  background: #b03532;
  grid-column: 1 / 3;
  grid-row: 1 / 3;
}
/* 等同于 */
.item-1 {
  background: #b03532;
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}
```

#### 3.3 grid-area 属性

`grid-area`属性指定项目放在哪个区域

```css
.item-1 {
  grid-aera: e;
}
```

> `grid-area`属性还可用作`grid-row-start`、`grid-column-start`、`grid-row-end`、`grid-column-end`的合并简写形式，直接指定项目的位置。

```css
.item {
  grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
}
.item-1 {
  grid-area: 1 / 1 / 3 / 3;
}
```

#### 3.4 justify-self 属性，align-self 属性，place-self 属性

`justify-self` 属性设置单元格内容水平位置；
`align-self` 属性设置单元格美容的垂直位置；
`place-self` 属性为`justify-self `属性和`align-self`属性的简写 `palce-self:<align-self> <justify-self>;`

```css
.item {
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

- start：对齐单元格的起始边缘。
- end：对齐单元格的结束边缘。
- center：单元格内部居中。
- stretch：拉伸，占满单元格的整个宽度（默认值。
