---
layout: doc
---

## 2023 年 3 月 31 日

#### 1. 通用的边框阴影

```css
box-shadow: rgba(0, 0, 0, 0.22) 0px 25.6px 57.6px 0px, rgba(0, 0, 0, 0.18) 0px 4.8px
    14.4px 0px;
```

#### 2. object-fit 属性

`object-fit` CSS 属性指定可替换元素（例如：`<img>` 或 `<video>`）的内容应该如何适应到其使用高度和宽度确定的框。

支持属性：

- `contain` 内容被压缩，再填充框内保持 **自身** 的宽高比
- `cover` 内容被裁剪，以适应**填充框**的宽高来填充满填充框
- `fill`(默认) 如果宽高比不匹配 拉伸图片来填充满填充框
- `none` 保持原有尺寸
- `scale-down` 内容的尺寸与 `none` 或 `contain` 中的一个相同，取决于它们两个之间谁得到的对象尺寸会更小一些。

```css
img {
  width: 150px;
  height: 100px;
  border: 1px solid #000;
  margin: 10px 0;
}
  object-fit: fill;
  object-fit: contain;
  object-fit: cover;
  object-fit: none;
  object-fit: scale-down;
}
```