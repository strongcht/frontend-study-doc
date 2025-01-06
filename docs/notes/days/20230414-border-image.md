---
layout: doc
---

## 2023 年 4 月 14 日

#### border-image 学习

![border-image](/images/days/border-image1.png)
**`border-image`**：`border-image-source || border-image-slice [ / border-image-width | / border-image-width ? / border-image-outset ]? || border-image-repeat`

- `border-image-source`：定义边框图像的路径
- `border-image-slice`：定义边框图像的分割位置；
- `border-image-width`：定义边框图像的宽度；
- `border-image-outset`：定义边框图像的外延尺寸（边框图像区域超出边框的量）；
- `border-image-repeat`：定义边框图像的平铺方式。

#### 1. border-image-source

`border-image-source` 定义图像本身是什么, 可以接收以下值：

- none: 显示默认边框的样式。
- url(): 定义边框要使用的图像路径, 若图像不可用则显示默认边框的样式
- linear-gradient(): 使用渐变色

例：

```css
border-image-source: none;
border-image-source: url(xxx.png);
border-image-source: linear-gradient(45deg, red, yellow);
```

#### 2. border-image-slice

`border-image-slice` 设置的是图像原图的切割方式, 可以接收三种类型的值：

- `<number>`：数值，用具体数值指定图像分割的位置，数值代表图像的像素位置或向量坐标，不允许负值；

- `<percentage>`：百分比，相对于图像尺寸的百分比，图像的宽度影响水平方向，高度影响垂直方向；

- `fill`：除非你在 border-image-slice 属性中指定 fill 关键字，否则中心块切片不会被使用。如果你使用了 fill 关键字，那么中心块切片的图像会被作为元素的背景图像来使用。fill 关键字可以放置在 border-image-slice 属性值的任何位置，可以在值的前面，后面，甚至是在两个值的中间。

![border-image-slice示例](/images/days/border-image2.png)

border-image-slice 属性可以指定上、下、左、右四个方位来分割图像，并将图像分成 4 个角、4 条边和中间区域等 9 个部份，中间区域始终是透明的（不会填充图像），除非加上关键字 fill。和其他常用 css 属性一样, 顺序是上、右、下、左， 支持省略写法。

例：

```css
border-image-slice: 10% fill 7 12;
border-image-slice: 10% 7 12 fill;
```

#### 3. border-image-width

`border-image-widt`h 设置的是边框的实际宽度, 可以接收以下值：

- `<length>`：使用数值加单位的形式指定图像边框的宽度，不允许为负值；
- `<percentage>`：用百分比的形式指定图像边框的宽度，参照图像边框区域的宽和高进行换算，不允许负值；
- `<number>`：使用浮点数指定图像边框的宽度，该值对应 border-width 的倍数，例如值为 2，则参数的实际值为 2 \* border-width，不允许负值；
- `auto`：由浏览器自动设定，当 border-image-width 设置为 auto 时，它的实际值与 border-image-slice 相同的值。

例:

```css
border-image-width: 10px 1 0.5 15px;
```

#### 4. border-image-outset

`border-image-outset` 设置的是图像边框延伸到盒子模型以外的偏移量,可以接收以下值：

- `<length>`：用具体的数值加单位的形式指定图像边框向外偏移的距离，不允许为负值；
- `<number>`：用浮点数指定图像边框向外偏移的距离，该值表示 border-width 的倍数，例如值为 2，则表示偏移量为 2 \* border-width，不允许为负值。

例:

```css
border-image-outset: 25px;
```

#### 5. border-image-repeat

`border-image-repeat` 设置的是图像边框的填充方式, 可以接收以下值：

- `stretch`：默认值, 将被分割的图像使用拉伸的方式来填充满边框区域；
- `repeat`：将被分割的图像使用重复平铺的方式来填充满边框区域，当图像碰到边界时，超出的部分会被截断；
- `round`：与 `repeat` 关键字类似，不同之处在于，当背景图像不能以整数次平铺时，会根据情况缩放图像；
- `space`：与 `repeat` 关键字类似，不同之处在于，当背景图像不能以整数次平铺时，会用空白间隙填充在图像周围。

border-image-repeat 属性能够接受 1~2 个参数值：如果提供两个参数，那么第一个参数将用于水平方向，第二个将用于垂直方向；如果只提供一个参数，那么将在水平和垂直方向都应用该值。

![border-image-repeat示例](/images/days/border-image3.png)

::: tip 注意

1. 兼容问题, 如果 border-radius 失效, 解决方法: 用一个父容器包裹之, 设置 border-radius, 再 overflow:hidden
2. 如果想要边框的边角不失真, 不拉伸,border-image-slice 要和 border-image-width 设置成一样
3. border-image-slice 如果设定 px 的时候直接写数字就可以, 写了 px 反而会不生效。

:::
