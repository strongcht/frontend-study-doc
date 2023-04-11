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
