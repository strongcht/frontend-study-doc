## 记录有 vue2+antd1.x 升级到 vue3+antd4.x 的过程中遇到的问题

## 1.关于 antd 中的问题

#### 1.1 antd1.x 中的 a-icon 组件在 antd4.x 中被移除,需要使用 Icon 组件代替

- 基础使用

```js
import Icon, {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons-vue'

<icon class="trigger">
  <template #component>
    <MenuFoldOutlined />
  </template>
</icon>
```

- 全局安装 ant-design/icons-vue

```js
// 这里可以全局引入antd icon
// 使用 在main.ts底部 挂载完#app后加载
// nextTick(() => {
//   loadAntIcons(app)
// })
import { App } from 'vue'
import * as antIcons from '@ant-design/icons-vue'
export const loadAntIcons = (app: App) => {
  Object.keys(antIcons).forEach(iconName => {
    app.component(iconName, antIcons[iconName as keyof typeof antIcons])
  })
}
```

- 在 template 中使用

```js
// iconName为图标名称 例如 使用 <GlobalOutlined />组件 则iconName为GlobalOutlined
<component :is="iconName" />
```

- 在 h 函数中使用

```js
const AntdIcons = {
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
  SettingOutlined,
  ReloadOutlined,
  PicRightOutlined,
  FullscreenOutlined,
  BellOutlined,
  PoweroffOutlined,
  SearchOutlined,
};

const iconName = "GlobalOutlined";
h(AntdIcons[iconName]);
```

#### 1.2 组件中 v-model 失效问题

> 举例说明

- antd4.x 中 `<a-tabs v-model:activeKey="activeKey"></a-tabs>`
- antd1.x 中 `<a-tabs v-model="activeKey"></a-tabs>`

如果不对 v-model 改写激活状态不会生效

#### 1.3 a-form 中表单校验方式变化

+ 绑定校验方式

  - 1.x 中使用 v-decorator
  ```vue
  <a-form-item label="Note">
    <a-input
      v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]"
    />
  </a-form-item>
  ```

  - 4.x 中使用 rules 且需要给 a-form-item 组件添加 name 属性
  ```vue
  
    <a-form-item label="Note" name="node">
      <a-input
        rules={[{ required: true, message: 'Please input your note!' }]}
      />
    </a-form-item>
  ```
+ 手动校验规则validator方法

  - 1.x 中使用 validator(rule, value, callback) 必须调用 callback() 方法

    ```vue
      <a-form-item :label="$t('arrears.org')" v-bind="formItemLayout">
        <a-select
          :placeholder="请选择"
          v-decorator="[
            'branchId',
            {
              rules: [
                { required: true, message: '请选择' },
                {
                  validator: (rule, value, callback) =>
                    /^\s+$/.test(value) ? callback('请选择') : callback(),
                },
              ],
            },
          ]"
        ></a-select>
      </a-form-item>
    ```

  - 4.x 中使用 validator(rule, value) 返回 Promise 对象
    ```vue
      <a-form-item
        label="email"
      >
        <a-input
          name="email"
          :rules="[
            {
              required: true,
              message:'请输入邮箱',
              validator: (rule, value) => {
                if (!value) {
                  Promise.resolve('请输入邮箱')
                } else {
                  Promise.resolve()
                }
              },
            },
          ]"
        />
      </a-form-item>
    ```

  ```js


## 2.关于 vue-i18n使用

#### 2.1 关于 vue-i18n 的基础使用
+ messages配置
```js
// messages配置
const langsModules = import.meta.glob('./**/index.ts')
const locales = {
  zh_CN: langsModules['./zh_CN/index.ts'],
  en_US: langsModules['./en_US/index.ts'],
  fr_FR: langsModules['./fr_FR/index.ts'],
}

const messages: { [key: string]: any } = {}
Object.keys(locales).forEach(language => {
  locales[language]().then(module => {
    // 将导入的内容赋值给 messages 对象
    messages[language] = module.default
  })
})
export default messages
```

+ 初始化安装i18n
```js
// 初始化安装i18n
export function setupI18n(app) {
  i18n = createI18n({
    locale: 'zh_CN',
    fallbackLocale: 'zh_CN',
    legacy: false,
    messages: messages,
    silentTranslationWarn: true,
    globalInjection: true,
  })
  app.use(i18n)
}
```

+ 切换语言方法
```js
// 切换语言
export async function changeLang({ langId }) {
  const appStore = useAppStore()
  const curLangList = await loadLangs() // 加载语言包
  if (!Object.prototype.hasOwnProperty.call(curLangList, langId)) {
    langId = getLocalLang()
  }
  const { result } = await getLang(langId)

  langDetail = result.detail
  i18n.global.mergeLocaleMessage(result.iso, result.detail) // 合并语言包
  i18n.global.locale.value = langId // 要用.value 不然不生效
  storage.set('locale', langId)
  appStore.setLangId(langId)
}
```
+ 使用
```js
// 使用
// 在setup中使用
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
t('login.title')

// 在template中使用
{{ $t('login.title') }}
```
+ 另外一种在vue3 `<script>`setup函数中使用

```js
const {
  appContext: {
    config: { globalProperties },
  },
} = getCurrentInstance()

const title = globalProperties.$t(`function._${menu.name}`)

```

## 3.关于 vue-router 的使用

> vue-router 4.x 中addRoutes方法被移除，只可以使用addRoute添加动态路由

```js
// 递归调用 addRoute
function addRoutes(routesList, parentName = '') {
  // 层序遍历children
  routesList?.forEach(item => {
    if (item.path && item.component) {
      const routeItem = {
        component: item.component,
        meta: item.meta,
        name: item.path,
        path: item.path,
        redirect: item.redirect,
        parentName: item.path,
      }
      parentName
        ? router.addRoute(parentName, routeItem)
        : router.addRoute(routeItem)

      if (item?.children?.length) {
        addRoutes(item.children, item.path)
      }
    }
  })
}

```

> addRoute 方法添加路由后，需要使用 router.replace 方法进行跳转，否则会出现路由重复添加的问题

```js
// 在beforeEach 钩子中
// hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
next({ ...to, replace: true })

```

> 刷新后addRoute添加的路由会丢失，需要在beforeEach 钩子中进行判断

```js
// 一般用store中的变量判断是否刷新
// store如果没有做持久缓存 刷新后会变为初始值， 判断如果是初始值则在走一遍addRoutes逻辑
```

## 4.


