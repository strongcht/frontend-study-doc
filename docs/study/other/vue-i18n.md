---
layout: doc
---

> 在vue项目中的多语言配置`vue-i18n`

介绍 `vue-i18n 8.x ` 和 `vue-i18n 9.x`实现原理

# vue-i18n 8.x

## 使用方式

在`vue2`中使用 `vun-i18n 8.x` [官网](https://kazupon.github.io/vue-i18n/started.html#html)

```js
import Vue from 'vue';
import VueI18n from 'vue-i18n';

// Ready translated locale messages
const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  zh: {
    message: {
      hello: '你好世界'
    }
  }
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'zh', // set locale
  messages, // set locale messages
})


// Create a Vue instance with `i18n` option
new Vue({ i18n }).$mount('#app')

// Now the app has started!

// 使用
{/* <div id="app">
  <p>{{ $t("message.hello") }}</p>
</div> */}
```

## 实现原理

[参考地址](https://juejin.cn/post/6965660033728135176)


# vue-i18n 9.x

## 使用方式
[官网](https://vue-i18n.intlify.dev/guide/essentials/started.html)
```js
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
    locale: 'zh',
    fallbackLocale: 'en',
    messages: {
        en: {
            message: {
                hello: 'hello world'
            }
        },
        zh: {
            message: {
                hello: '你好世界'
            }
        }
    }
})

const app = createApp(Vue)
app.use(i18n)
app.mount('#app')
```

## 实现原理

[源码地址](https://github.com/intlify/vue-i18n)

在 `vue-i18n-core/src/i18n.ts`下 导出的 `createI18n` 返回一个 带有`install`的`Object`, 用于使用`Vue.use`;

```js
export function createI18n(options, VueI18nLegacy) {
  // prettier-ignore
  const __legacyMode = __LITE__ ? false : __FEATURE_LEGACY_API__ && isBoolean(options.legacy) ? options.legacy : __FEATURE_LEGACY_API__;
  // prettier-ignore
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __instances = new Map();
  const [globalScope, __global] = createGlobal(options, __legacyMode,VueI18nLegacy);
  const symbol = /* #__PURE__*/ makeSymbol(__DEV__ ? 'vue-i18n' : '');

  function __getInstance(component) {
    return __instances.get(component) || null
  }
  function __setInstance(component, instance){
    __instances.set(component, instance)
  }
  function __deleteInstance(component) {
    __instances.delete(component)
  }

  const i18n = {
    // mode
    get mode() {
      return !__LITE__ && __FEATURE_LEGACY_API__ && __legacyMode ? 'legacy' : 'composition';
    },
    // install plugin
    async install(app, ...options) {
      if ((__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) && !__NODE_JS__) {
        app.__VUE_I18N__ = i18n
      }

      // setup global provider
      app.__VUE_I18N_SYMBOL__ = symbol
      app.provide(app.__VUE_I18N_SYMBOL__, i18n)

      // set composer & vuei18n extend hook options from plugin options
      if (isPlainObject(options[0])) {
        const opts = options[0];
        i18n.__composerExtend = opts.__composerExtend;
        i18n.__vueI18nExtend = opts.__vueI18nExtend;
      }

      // global method and properties injection for Composition API
      let globalReleaseHandler = null
      if (!__legacyMode && __globalInjection) {
        globalReleaseHandler = injectGlobalFields(app, i18n.global)
      }

      // install built-in components and directive
      if (!__LITE__ && __FEATURE_FULL_INSTALL__) {
        applyPlugin(app, i18n, ...options)
      }

      // setup mixin for Legacy API
      if (!__LITE__ && __FEATURE_LEGACY_API__ && __legacyMode) {
        app.mixin(
          defineMixin(__global, __global.__composer, i18n)
        )
      }

      // release global scope
      const unmountApp = app.unmount
      app.unmount = () => {
        globalReleaseHandler && globalReleaseHandler()
        i18n.dispose()
        unmountApp()
      }

      // setup vue-devtools plugin
      if ((__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) && !__NODE_JS__) {
        const ret = await enableDevTools(app, i18n)
        if (!ret) {
          throw createI18nError(I18nErrorCodes.CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN)
        }
        const emitter = createEmitter()
        if (__legacyMode) {
          const _vueI18n = __global;
          _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter)
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const _composer = __global;
          _composer[EnableEmitter] && _composer[EnableEmitter](emitter)
        }
        emitter.on('*', addTimelineEvent)
      }
    },
    // global accessor
    get global() {
      return __global
    },
    dispose() {
      globalScope.stop();
    },
    __instances,
    __getInstance,
    __setInstance,
    __deleteInstance
  }
  return i18n
}
```

关键方法 `applyPlugin` 和 `defineMixin`;
+ `applyPlugin`: 用于注册全局组件 `I18nT, I18nN, I18nD`和全局指令 `v-t`; 
```js
// vue-i18n-core/src/plugin/next.ts
import { Translation } from '../components/Translation'
import { NumberFormat } from '../components/NumberFormat'
import { DatetimeFormat } from '../components/DatetimeFormat'
import { vTDirective } from '../directive'
import { isPlainObject, isBoolean } from '@intlify/shared'

import type { App } from 'vue'
import type { I18n } from '../i18n'
import type { I18nPluginOptions } from './types'

export function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {}
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true

  if (!__LITE__ && globalInstall) {
    // install components
    [Translation.name, 'I18nT'].forEach(name =>
      app.component(name, Translation)
    );
    [NumberFormat.name, 'I18nN'].forEach(name =>
      app.component(name, NumberFormat)
    );
    [DatetimeFormat.name, 'I18nD'].forEach(name =>
      app.component(name, DatetimeFormat)
    );
  }

  // install directive
  if (!__LITE__) {
    app.directive('t', vTDirective(i18n))
  }
}
```
+ `defineMixin`: 用于使用 app.mixin方法 在组件的声明周期中的 `beforeCreate, mounted, unmounted`,
会在`beforeCreate`中的 `createVueI18n `注册 `watch` 监听 `loacl message`的变化 更新和 `$t、$rt、$tc、$te、$d、$n、$tm方法`
在 `mounted`中注册emitter
在 `unmounted`中卸载事件和方法
```js
// vue-i18n-core/src/mixins.ts

export function defineMixin(vuei18n,composer,i18n) {
  return {
    beforeCreate() {
      const instance = getCurrentInstance()
      /* istanbul ignore if */
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
      }

      const options = this.$options
      if (options.i18n) {
        const optionsI18n = options.i18n;
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n
        }
        optionsI18n.__root = composer
        if (this === this.$root) {
          // merge option and gttach global
          this.$i18n = mergeToGlobal(vuei18n, optionsI18n)
        } else {
          optionsI18n.__injectWithOption = true
          optionsI18n.__extender = i18n.__vueI18nExtend
          // atttach local VueI18n instance
          this.$i18n = createVueI18n(optionsI18n)
          // extend VueI18n instance
          const _vueI18n = this.$i18n;
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n)
          }
        }
      } else if (options.__i18n) {
        if (this === this.$root) {
          // merge option and gttach global
          this.$i18n = mergeToGlobal(vuei18n, options)
        } else {
          // atttach local VueI18n instance
          this.$i18n = createVueI18n({
            __i18n: options.__i18n,
            __injectWithOption: true,
            __extender: i18n.__vueI18nExtend,
            __root: composer
          })
          // extend VueI18n instance
          const _vueI18n = this.$i18n;
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n)
          }
        }
      } else {
        // attach global VueI18n instance
        this.$i18n = vuei18n
      }

      if (options.__i18nGlobal) {
        adjustI18nResources(composer, options, options)
      }

      // defines vue-i18n legacy APIs
      this.$t = (...args) => this.$i18n.t(...args)
      this.$rt = (...args) => this.$i18n.rt(...args)
      this.$tc = (...args) => this.$i18n.tc(...args)
      this.$te = (key, locale) => this.$i18n.te(key, locale)
      this.$d = (...args) => this.$i18n.d(...args)
      this.$n = (...args) => this.$i18n.n(...args)
      this.$tm = (key) =>this.$i18n.tm(key)

      i18n.__setInstance(instance, this.$i18n)
    },

    mounted(): void {
      /* istanbul ignore if */
      if (
        (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
        !__NODE_JS__ &&
        this.$el &&
        this.$i18n
      ) {
        const _vueI18n = this.$i18n;
        this.$el.__VUE_I18N__ = _vueI18n.__composer
        const emitter = (this.__v_emitter = createEmitter());
        _vueI18n.__enableEmitter && _vueI18n.__enableEmitter(emitter)
        emitter.on('*', addTimelineEvent)
      }
    },

    unmounted(): void {
      const instance = getCurrentInstance()
      /* istanbul ignore if */
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR)
      }

      const _vueI18n = this.$i18n;

      /* istanbul ignore if */
      if (
        (__DEV__ || __FEATURE_PROD_VUE_DEVTOOLS__) &&
        !__NODE_JS__ &&
        this.$el &&
        this.$el.__VUE_I18N__
      ) {
        if (this.__v_emitter) {
          this.__v_emitter.off('*', addTimelineEvent)
          delete this.__v_emitter
        }
        if (this.$i18n) {
          _vueI18n.__disableEmitter && _vueI18n.__disableEmitter()
          delete this.$el.__VUE_I18N__
        }
      }

      delete this.$t
      delete this.$rt
      delete this.$tc
      delete this.$te
      delete this.$d
      delete this.$n
      delete this.$tm

      if (_vueI18n.__disposer) {
        _vueI18n.__disposer()
        delete _vueI18n.__disposer
        delete _vueI18n.__extender
      }

      i18n.__deleteInstance(instance)
      delete this.$i18n
    }
  }
}
```
