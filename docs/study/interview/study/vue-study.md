vue study

## vuejs文档阅读
#### 1.  v-for Object
    + 循环的逻辑按 Object.keys()的值排序 先数字 在字母顺序 在symbol
    + vue3.x v-if的优先级 高于 v-for ; vue2.x 中 v-if的优先级 低于 v-for;
#### 2. watch 新增
    + deep 后跟数字 则按数字层数深度监听
    + 增加once: true 只执行一次
    + watch 内新增 onWatcherClearup() 钩子 当监听器失效并准备重新运行时会调用
    ```vue
        watch() {
            onWatcherClearup() {
                console.log('监听器失效执行')
            }
        }
        // 第三个参数
        watch(id, (newId, oldId, onClearnup) => {

            onClearnup() {
                console.log('监听器失效执行')
            }

        }, {
            onec: true,
            deep: true | 1 2 3 4 5;
            flush: 'post'
        });

        watchEffect((onClearnup) => {
            onClearnuo() {
                console.log('监听器失效执行')
            }
        })
    ```

#### 3. 新增`useTemplateRef()`
    ```
        <template>
            <input ref='input-ref' />
        <temlate>

        <script setup>
            import { ref, useTemplateRef } from 'vue';
            const inputRef = useTemplateRef('input-ref');
        </script>
    ``` 

#### 4. v-bind: 简写

    + 同名value 可简写 :id=id -> :id

#### 5.增加 defineModel 宏
    + 基本使用

    ```
    <script setup>
        const model = defineModel()
    </script>

    <template>
        <input v-model="model" />
    </template>
    ```

    ```
    <template>
        <input :value="modelValue"  @input="emits('update:modelValue', $events.target.value)"/>
    </template>
    <script setup> 
        const props = defindProps({
            modelVlaue: {
                type: String,
                default: ''
            }
        })
        const emits = defineEmits(['update:modelValue']);
    </script>

    ```

    + const model = defineModel({
        default: '' // 默认值
        require: true // 必填
    })

    + const title = defineModel('title', {})

    + const [model, modifiers] = defineModel();

    + const [firstName, firstNameModifiers] = defineModel('firstName')

#### 6. toValue()
    + 将ref或getter规范化为值， 如果参数是ref他会返回ref的值，如果参数是函数它会调用函数并返回值， 否则原样返回；

#### 7. props validator 新增第二个参数
    ```
    const props = defineProps({
        deviceType: {
            type: String,
            default: 'Book',
            require: 'true',
            validator(value, props ){ 第二个参数为所有的props
                return ['Book', 'Car'].includes(value);
            }
        }
    })
    ```

#### 8. 异步组件 defineAsyncComponent  新增惰性激活策略(服务端渲染适用)
    + 空闲时激活 依赖于 requestIdelCallback
        ```

        import { defineAsyncComponent, hydrateOnIdel} from 'vue';
        const componentsA = defineAsyncComponent({
            loader: () => import('./components/index.vue'),
            hydrate: hydrateOnIdel(),
            // 加载异步组件时使用的组件
            loadingComponent: LoadingComponent,
            // 展示加载组件前的延迟时间，默认为 200ms
            delay: 200,

            // 加载失败后展示的组件
            errorComponent: ErrorComponent,
            // 如果提供了一个 timeout 时间限制，并超时了
            // 也会显示这里配置的报错组件，默认值是：Infinity
            timeout: 3000
        });
        ```
    + 在可见时激活 依赖于 InterSectionObserver()
        ```
        import { defineAsyncComponent, hydrateOnVisible} from 'vue';
        const componentsA = defineAsyncComponent({
            loader: () => import('./components/index.vue'),
            hydrate: hydrateOnVisible(),
        });
        ```

    + 在媒体查询匹配时激活 Media Query
       ```
        import { defineAsyncComponent, hydrateOnMediaQuery} from 'vue';
        const componentsA = defineAsyncComponent({
            loader: () => import('./components/index.vue'),
            hydrate: hydrateOnMediaQuery('(max-width:500px)'),
        });
        ```
    + 在交互时激活
      ```
        import { defineAsyncComponent, hydrateOnInteraction} from 'vue';
        const componentsA = defineAsyncComponent({
            loader: () => import('./components/index.vue'),
            hydrate: hydrateOnInteraction(['wheel', 'mouseover']),
            // hydrateOnInteraction('click'), 
        });
        ``` 

    + 自定义策略激活
    ``` 
    import { defineAsyncComponent, type HydrationStrategy } from 'vue';
    const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
        / forEachElement 是一个遍历组件未激活的 DOM 中所有根元素的辅助函数，
        // 因为根元素可能是一个模板片段而非单个元素
        forEachElement(el => {
            // ...
        })
        // 准备好时调用 `hydrate`
        hydrate()
        return () => {
            // 如必要，返回一个销毁函数
        }
    }; 
    const componetA = defineAsyncComponent({
        loader: () => import('./components/index.vue'),
        hydrate: myStrategy
    });
    ```

#### 9. Teleport 新增defer属性
    + 延迟解析teleport 的目标容器
    ```
    <teleport to="#app" defer >
        <div v-if="show"> 
            <h1>Hello World</h1>
        </div>
    </teleport>
    ```

#### 10. 为什么要用SSR它与SPA相比优势在哪？
    + 更快的首屏加载
    + 统一的心智模型: 使用相同的语言和声明方式开发整个应用，不用区分后端和前端
    + 更好的SEO

    使用SSR的一些权衡：
    + 开发中的限制： 浏览器的特定代码中能在某些生命周期中使用； 第三方库是否支持SSR
    + 更多的构建配置和部署要求
    + 更高的服务端负载：与静态托管相比需要更高的CPU负荷

#### 11. 组合式API与选项式API
    + 更好的复用： 能够通过组合函数实现简单的逻辑复用，解决mixins的缺陷
    + 更灵活的代码组织
    + 更好的类型推断，typeScript的支持
    + 更小的生产包体积
    + 选项式API依赖this上下文

#### 12.mixins 存在的问题
    + 不清楚的数据来源
    + 命名空间冲突： 多个mixins 来自不同作者声明相同的变量方法
    + 隐式的跨mixins交流: 多个mixins需要依赖共享的属性名进行相互作用使他们隐式的耦合在一起

## vuejs 高频考点汇总

#### 1. vue2.0 与 vue3.0有哪些变化？
    + a. 在使用中的变化
        （1）vue3 支持组合式API可以更好的代码组织与代码复用， vue2.7以前的版本只支持选项式API，mixins做代码复用逻辑
        （2）vue3 引入documentFragment支出多根节点， vue2 中只支持单根节点
        （3）vue3中v-if的优先级高于v-for， vue2中v-if的优先级低于v-for
        （4）vue3的生命周期与vue2的生命周期有变化
    + b. 在源码底层实现的变化
        （1）vue3 使用Proxy对对象代理实现响应式处理， vue2使用Object.definePrototype()修改对象对对象深度遍历实现响应处理；解决了Object.definePrototype()无法检测对象的新增删除属性的响应式以及数组的响应处理；
        （2）vue3 支持tree shakeing 使没有用到的内置组件不包含在最终构建的代码中，产物的体积更小
        （3）vue3 优化了静态标记，可以减少内存使用，减少初始化和diff算法中的开销
        （4）vue3 使用最长递增子序列和静态标记减少不必要的对比，vue2使用双端比较的diff算法
        （5）提供更丰富的API和内置组件 ref shallRef Teleport

#### 2. vue响应式原理

    vue2.x中 使用 Object.definePrototype() 对data、props等中的数据递归做响应式处理, 在get中收集依赖，set中触发依赖更新；
    vue3.x中proxy实现对数据的响应式处理，也是通过对对象本身代理拦截不需要深度遍历，在读取时get收集依赖，变更时set触发依赖更新；

#### 3. vue2.0中data为什么是一个函数？
    目的是 为了更好的组件复用，避免多个组件实例中的数据污染；
    如果data是一个对象，当多个实例引用同一个对象时，只要一个实例对这个对象进行操作，其他实例中的数据也会发生变化。
    以函数返回值的形式定义，这样当每次复用组件的时候，就会返回一个新的data，也就是说每个组件都有自己的私有数据空间，它们各自维护自己的数据，不会干扰其他组件的正常运行。

#### 4. watch与computed的区别
    1. 使用上的区别
        + watch 需要明确声明依赖； computed 可以自己收集依赖，支持缓存只有依赖的数据发生变化才会重新计算；
        + watch 可以执行异步操作； computed 内不可以执行异步操作；
        为什么computed不支持异步操作呢？
            a. 首先computed的设计是为了提供高效的缓存和即时响应
            b. 如果使用异步 会导致不能立即得到计算结果 无法判断数据是否发生变化 导致缓存失效
            c. 异步还会导致 可能存在依赖收集不完整
    2. 在源码的实现方式区别
        + 首先两个都是watch: 区别一个是userWatcher,一个是 computedWatcher; 判断是基于 option.lazy -> dirty值  和 option.user 区别
        + watch 会返回一个 unWatchFn()用来取消监听; computed返回的是 计算后的结果值


#### 5. vue模版编译
    1. 编译（parse） : 将 template -> AST
    2. 优化（opimization） : 标记静态节点，静态根节点
    3. 生成（generate）: ast -> render()

    运行时：
    new Function(render) -> vnode -> diff(patch) -> update 