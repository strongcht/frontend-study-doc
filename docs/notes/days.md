---
layout: doc
---

## 2023 年 3 月 30 日

#### 1. `vue`中的`filters` 无法获取`this`

- 在 `<template>` 中 传入`this`

```vue
<span class="detail-box-text">
    {{ data.signalDTO.version | signalVersion(this) }}
</span>
```

- 在 `filters` 中

```js
filters: {
    signalVersion: (val, vm) => {
      if (!val) return ""
      return vm.protocolTypeOptions.find(item => item?.value === val)?.label || ""
    }
},
```

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

## 2023 年 4 月 3 日

#### 1. 变化的数字（vue2）

- 变动的数字： <number-label :value="2500" />
<script>
  import NumberLabel from '../components/vue2/number-ani-label.vue'
</script>

```vue
<!-- 使用方法 -->
<!-- 方法1 -->
<number-label :value="numberValue" />
<!-- 方法2 -->
<number-label :value="numberValue">
  <div style="color: red" slot-scope="number">{{ number }}</div>
</number-label>

<script>
import NumberLabel from "./number-ani-label";
</script>
```

```vue
<!-- number-ani-label.vue -->
<script>
export default {
  props: {
    default: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    /**
     * 数字的长度，默认是-1，表示数字是什么，给到插槽的内容就是什么
     * 如果有对数字做格式化处理的话，则长度还需要包括格式化后的其他字符
     */
    length: {
      type: Number,
      default: -1,
    },
    /**
     * 如果数字的长度小于leng时，要显示的前缀
     */
    padStart: {
      type: String,
      default: "0",
    },
    dataType: {
      type: String,
      // string array 传递给插槽的值是字符串还是数组
      default: "array",
    },
    format: {
      type: String,
      // thousandSeparated 按千位分隔
      // 默认是无
      default: "",
    },
  },
  data() {
    return {
      currentValue: "",
    };
  },
  methods: {
    startPlay(from, to) {
      from = parseFloat(from);
      if (isNaN(from)) {
        from = 0;
      }

      to = parseFloat(to);
      if (isNaN(to)) {
        to = 0;
      }

      // 第一次计算，则从默认值开始算
      if (!from) {
        from = this.default;
      }

      // 如果正在倒计时，突然值又变化，则从当前值开始变化
      if (this.countInter != undefined && this.countInter != -1) {
        clearInterval(this.countInter);
        this.currentValue = from;
      }

      if (from === to) {
        this.currentValue = to;
        return;
      }

      // 计算2个值的差值
      const interTotalValue = to - from;

      // 区间值，默认是1
      let interValue = 1;

      const INTER_CHANGE_COUNT = 30;

      // 如果大于10，则区间值向下取整
      if (Math.abs(interTotalValue) >= INTER_CHANGE_COUNT) {
        interValue = Math.floor(interTotalValue / INTER_CHANGE_COUNT);
      }

      if (parseInt(interValue) != interValue) {
        interValue = parseFloat(interValue.toFixed(2));
      }

      let interCount = 0;

      if (this.currentValue === "") {
        this.currentValue = 0;
      }

      this.countInter = setInterval(() => {
        interCount++;

        if (interCount >= INTER_CHANGE_COUNT - 1) {
          this.currentValue = to;
        } else {
          this.currentValue += interValue;
        }

        if (parseInt(this.currentValue) != this.currentValue) {
          this.currentValue = parseFloat(this.currentValue.toFixed(2));
        }

        if (this.currentValue == to) {
          clearInterval(this.countInter);
          this.countInter = -1;
        }
      }, 30);
    },
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        this.startPlay(oldValue, newValue);
      },
      immediate: true,
    },
  },
  render(h) {
    let currentValueStr = this.currentValue + "";

    if (this.format === "thousandSeparated") {
      const numberFormat = (number) => {
        let res = number.toString().replace(/\d+/, (n) => {
          return n.replace(/(\d)(?=(\d{3})+$)/g, ($1) => {
            return $1 + ",";
          });
        });
        return res;
      };

      currentValueStr = numberFormat(currentValueStr);
    }

    // 如果不足要求的长度，则按照规则前面补0
    if (currentValueStr.length < this.length) {
      currentValueStr = currentValueStr.padStart(this.length, this.padStart);
    }

    if (this.$scopedSlots.default) {
      if (this.dataType === "array") {
        return this.$scopedSlots.default(currentValueStr.split(""));
      }
    }

    return h(
      "div",
      {
        class: "number-ani-label",
      },
      currentValueStr.split("").map((item) => {
        return h(
          "span",
          {
            class: "number-ani-char",
          },
          item
        );
      })
    );
  },
};
</script>
```

#### 2. 变化的数字（vueUse）

使用 vueUse 中的`useTransition`实现

- 变动的数字： <TransitionValue />

<script setup>
import TransitionValue from '../components/vue3/transition-value.vue'
</script>

```vue
<template>
  {{ output.toFixed(0) }}
</template>

<script setup>
import { ref, onMounted } from "vue";
import { TransitionPresets, useTransition } from "@vueuse/core";

const source = ref(0);

const output = useTransition(source, {
  delay: 1000, // 延时 ms
  duration: 1000, // 执行周期 ms
  disabled: false, // 是否启用过渡效果
  onStarted() {
    // called after the transition starts
  },
  onFinished() {
    // called after the transition ends
  },
  transition: TransitionPresets.easeInOutCubic, // 过渡方式
});
function init() {
  source.value = Math.floor(Math.random() * 2000);
}

onMounted(() => {
  init();
});
</script>
```

## 2023 年 4 月 4 日

## 2023 年 4 月 7 日

vue3 中的 `effectScope`

#### EffectScope 使用

[官方文档](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0041-reactivity-effect-scope.md)

```js
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // 如果作用域不活跃就为 undefined
  stop(): void
}
```

#### `detached` 参数的使用

> `detached` 表示是否阻断和父级的联系，若为 true 则表示与父级断开关联，执行父级 stop 方法时会递归停止子集的监听，但子集 detached 为 true 时则不会停止

```js
let nestedScope;

const parentScope = effectScope();

parentScope.run(() => {
  const doubled = computed(() => counter.value * 2);

  // with the detected flag,
  // the scope will not be collected and disposed by the outer scope
  nestedScope = effectScope(true /* detached */);
  nestedScope.run(() => {
    watch(doubled, () => console.log(doubled.value));
  });

  watchEffect(() => console.log("Count: ", doubled.value));
});

// disposes all effects, but not `nestedScope`
parentScope.stop();

// stop the nested scope only when appropriate
nestedScope.stop();
```

#### `onScopeDispose` 的使用

```vue
<script lang="ts" setup>
import { effectScope, onScopeDispose } from "vue";

const scopeEventListener = effectScope();

function registerEventListener() {
  scopeEventListener.run(() => {
    useEventListener(document, "keydown", keydownHandler);
    useEventListener(document, mousewheelEventName, mousewheelHandler);
    // 调用stop方法是调用该方法 类似onUnmounted
    onScopeDispose(() => {
      console.log("cleaned!");
    });
  });
}

function unregisterEventListener() {
  // 停止监听，触发onScopeDispose
  scopeEventListener.stop();
}
</script>
```

## 2023 年 4 月 10 日

空值合并运算符 `??` **vs** 逻辑或运算符`||`

- **空值合并运算符**(??)是一个逻辑运算符，当左侧的操作数为 `null` 或者 `undefined` 时，返回其右侧操作数，否则返回左侧操作数。
- **逻辑或运算符**(||)会在左侧操作数为**假值**时返回右侧操作数。

```js
null ?? "default string"; // >> default string
0 ?? 42; // >> 0

null || "default string"; // >> default string
0 || 42; // >> 42
```

## 2023 年 4 月 13 日

#### 接入 qiankun 的总结

简介：该文档主要记录了 web 项目作为子应用接入 **qiankun** 框架遇到的一些问题，以及对应的处理方式和解决方案，可供后续参考。

#### 1. mars3d 地图加载不出来

**问题描述**： 通过 `new mars3d.Map(id, options)` 这种传入 `id` 的方式初始化地图，会导致地图挂载不上，无法显示。

**产生原因**： 获取不到对应的 `dom` 节点，详见问题 5。 解决方案： 直接传入 `dom` 节点初始化地图，代替 `id`，如下所示：

```vue
<template>
  <div ref="mapRef" class="map-container"></div>
</template>
<script setup>
const mapRef = ref(null);
new mars3d.Map(mapRef.value, mapOption);
</script>
```

#### 2. cesium 中的图片、js 库等资源映射路径错误

**问题描述**： 通过 cdn 的方式引入 **`cesium`**，**`cesium.js`** 和 **`widgets.css`** 文件可以请求成功，但是调用 cesium 内部 api 和图片资源时加载失败，映射文件路径错误。

**产生原因**： 由于路由和资源路径不统一，cesium 会获取浏览器 url 去做路径的拼接，导致路径匹配不上。 解决方案： 手动配置 `cesium` 的基础路径，直接在 head 标签里添加如下代码

```js
<script type="text/javascript">
  window.CESIUM_BASE_URL = "<%= BASE_URL %>static/libs/sutpc3d-cesium/Cesium/";
</script>
```

参考：https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/#step-2-set-up-the-cesiumjs-client

#### 3. ui 组件弹框，抽屉等样式不生效

**问题描述**： 当使用 `element、antd` 弹框、抽屉等组件时，相关的 `css` 样式没有生效。

**产生原因**： 弹框组件默认挂载在 `document.body` 下，而非 `app` 下，当子应用接入主应用之后，弹窗元素实际会挂载到主应用的 `body` 下。而 `qiankun` 开启沙箱模式样式隔离后，子应用的样式只针对 `app`内部的元素生效，和外部元素样式完全隔离，所以会产生此类问题。

**解决方案**： 挂载弹框到指定 `dom` 下，将 `body` 下的组件都挂载到 `app` 内部。以` antd` 的弹框为例： `app.vue`：

```vue
<template>
  <div id="tunnelModalRef"></div>
  <router-view />
</template>

<!-- 弹框组件： -->
<template>
  <a-modal v-model:visible="visible" :get-container="getContainer"> </a-modal>
</template>
<script setup>
const getContainer = () => {
  if (window.__POWERED_BY_QIANKUN__) {
    return document
      .querySelector("#__qiankun_microapp_wrapper_for_road__")
      .shadowRoot.querySelector("#tunnelModalRef");
  } else {
    return document.querySelector("#tunnelModalRef");
  }
};
</script>
```

#### 4. iconfont 字体图标无法显示

**问题描述**： `iconfont` 字体无法显示 产生原因： `qiankun` 开启沙箱模式后，`@keyframes`, `@font-face`, `@import`, `@page` 将不被支持，详见https://qiankun.umijs.org/zh/api

**解决方案**：

- 第一种： 使用 `svg` 等常规方式替代
- 第二种： 在主应用中加载字体，将`@font-face` 代码块放在主应用引入，在子应用里正常使用字体。

```css
@font-face {
  font-family: "iconfont";
  src: url("iconfont.woff2?t=1680524349253") format("woff2"), url("iconfont.woff?t=1680524349253")
      format("woff"), url("iconfont.ttf?t=1680524349253") format("truetype");
}
```

#### 5. 组件挂载不上，获取不到 dom 元素等相关问题

**问题描述**： qiankun 无法直接获取到子应用 `dom`，需要通过 `document.querySelector` 类似 `js` 方式获取 `dom` 元素的功能都会受到影响，例如地图初始化、地图弹框挂载、`echarts` 图表加载等场景。

**产生原因**： 沙箱模式下 `qiankun` 会为每个微应用的容器包裹上一个 `shadow dom` 节点，`shadow-root` 包裹下的对象不在全局的 `DOM` 树中，因此 `getElementById` 等方法获取不到包裹中的对象。

**解决方案**：

- 尽量避免 `js` 直接操作 `dom`，可以使用 `vue` 的 `ref` 方式获取 `dom` 节点

- 先获取 `shadow-root` 的父级节点，然后用 `shadowRoot` 取得这个父级节点的 `shadow` 块，再进行操作，如下

```js
document.querySelector("#rootid").shadowRoot.querySelector("#domid");
```

项目作为子应用，被他人的 qiankun 主应用接入时遇到问题总结

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
