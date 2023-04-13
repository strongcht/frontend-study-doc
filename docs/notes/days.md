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
