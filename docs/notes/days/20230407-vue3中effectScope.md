---
layout: doc
---

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
