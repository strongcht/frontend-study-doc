## 什么是CSS Houdini

*   Houdini 是一组底层 API，它们公开了 CSS 引擎的各个部分，从而使开发人员能够通过加入**浏览器渲染引擎的样式和布局过程**来扩展 CSS。
*   Houdini 是一组 API，它们使开发人员可以直接访问CSS 对象模型 （CSSOM），使开发人员可以编写浏览器可以解析为 CSS 的代码，从而创建新的 CSS 功能，而无需等待它们在浏览器中本地实现。
*   简单说：可以自行实现你需要的css样式，而无需等待浏览器支持该特性

## JS Polyfill vs Houdini

JS Polyfill虽然也能实现一定的css新特性，但是存在以下主要问题：

##### 1. 实现可能很困难或者无法实现

CSSOM对js开放的API很少，开发者能做的很有限。只能简单地操纵DOM并对样式做动态计算和调整，更加深层次的操作如：布局、复杂的绘图等则基本无法实现。

##### 2. 实现效果较差

polyfill通过js来模拟css特性，而不是在渲染引擎上操作，通常实现起来的效果会比较差，或者存在一定的效果差异。

##### 3. 性能差

polyfill可能有一定程度的性能损耗，通常它是通过给dom增加内联样式来模拟特性，可能会造成重绘或回流等影响页面性能的问题。

## api介绍

几种常见的api如下

#### CSS Properties and Values API

用来注册新的 CSS 属性的 API。通过该 API 注册的属性必须用一种特定的解析语法书写，以定义其类型、继承行为以及初始值。可以使用js或者css定义。

    CSS.registerProperty({
      name: '--bg-color',
      syntax: '<color>',
      inherits: false,
      initialValue: 'red'
    });
    
    @property --bg-color {
      syntax: '<color>';
      inherits: false;
      initial-value: 'red';
    }

syntax还支持如：`<length>`、`<number>`、`<image>`、`<angle>`、[查看syntax的更多选项](https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax)

#### CSS Painting API

用来提升 CSS 扩展性的 API。它允许开发者通过 paint() 方法书写 JavaScript 函数，使用canvas context的api，可以轻松控制绘制元素的背景、边框或者内容区域等样式。

    class MultiRetanglePainter {
      paint(ctx, geom, properties) {
        // Use `ctx` as if it was a normal canvas
        const colors = ['red', 'green', 'blue'];
        const size = 32;
        for(let y = 0; y < geom.height/size; y++) {
          for(let x = 0; x < geom.width/size; x++) {
            const color = colors[(x + y) % colors.length];
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.rect(x * size, y * size, size, size);
            ctx.fill();
          }
        }          
      }
    }

    // Register our class under a specific name
    registerPaint('multiRetangle', MultiRetanglePainter);



    CSS.paintWorklet.addModule('multi-retangle.js');



    <style>
    .my-div {
      width: 400px;
      height: 300px;
      border: 1px solid red;
      background: paint(multiRetangle);
    }
    </style>

其他的如：layout api、CSS Typed OM、CSS Parser API等，暂不介绍。

## 示例演示和代码介绍

[查看chrome labs示例](https://googlechromelabs.github.io/houdini-samples/)

## 兼容性

[查看worklet的兼容性](https://developer.mozilla.org/en-US/docs/Web/API/Worklet)
[查看painting api的兼容性](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API)
[查看css properties ans values的兼容性](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Properties_and_Values_API)

## 最后

能力越大，责任越大！在 Houdini 的帮助下你能够在 css 中实现你自己的布局、栅格、或者区域特性，但是这么做并不是最佳实践。CSS 工作组已经做了许多努力来确保 CSS 中的每一项特性都能正常运行，覆盖各种边界情况，同时考虑到了安全、隐私，以及可用性方面的表现。如果你要深入使用 Houdini，确保你也把以上这些事项考虑在内！
