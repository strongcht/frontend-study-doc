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

#### 2. props 中的自定义校验函数

```js
infoType: {
  validator: function (value) {
    // 这个值必须匹配下列字符串中的一个
    return ['success', 'warning', 'danger'].includes(value)
  }
}

```