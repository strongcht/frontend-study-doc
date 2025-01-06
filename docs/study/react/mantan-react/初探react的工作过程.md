### 前言

现在 react 18 已经进入了快速迭代期，相信再过不久就会出稳定版本，到时我们就可以使用稳定版本提供的新特性 - Concurrent 模式了。 Concurrent 模式会将 react 原来的同步阻塞渲染变为可中断的异步渲染，能极大的提升用户体验。

为了能更深入的了解 Concurrent 特性，掌握第一手资料，就萌生了阅读 react 源码的想法。经过几个月的学习，总算对 react 的原理有了一个比较清晰的认识。在这里，我准备输出一些自己的学习所得，一方面是对这一段之间的学习做一个总结，另一方面也是想把自己学到的东西分享给大家，能在大家使用 react 以及阅读源码时给到大家一点帮助。

其实关于 react 的源码解析，网上已经有大量的资料了。在这里，向大家推荐一个非常优秀的学习资料 - 卡颂大佬的 [React 技术揭秘](https://react.iamkasong.com/ "https://react.iamkasong.com/") 。在阅读源码的过程中，自己就重复阅读了好几次，受益良多，在这里要向卡颂大佬致敬 👍🏻。

好了，闲话不多说了，我们直接进入主题吧。(本文中含有大量的图片，浏览时请耐心等候加载，😂)

### 铺垫知识

react 的工作过程，涉及的点非常多，包括 fiber tree 架构、任务调度器 Scheduler、协调器 Reconciler、渲染器 Renderer 、组件的更新及更新优先级的判定、Concurrent 模式和 Legancy 模式等。如果一上来就直接讲解这些东西，那看的人估计会一脸懵逼，看都不想看，梳理的人也无从下手 😂。

为了能帮助大家更友好的理解 react 的工作过程，我们需要先来一些铺垫知识。

#### 1\. react、vue 等这类框架为什么这么火

前端开发，说到底最终都是要和 **dom tree** 打交道的。在 **jquery** 甚至更久远的时代，开发人员需要自己动手操作 dom tree，费时费力，还不能保证最优的性能。

而 **react**、**vue** 等这类框架(没有用过 angular 😓)的出现，给我们带来了福音。它们将我们从复杂繁琐的 dom 操作解放出来，只需关注具体的业务实现，大大提高了生产力。**react**、**vue** 等框架的**核心**是**数据驱动视图**。在使用框架时，我们只需**关注数据的变化**，不再需要关心 **dom** 操作，框架本身会自动帮助我们以最优的方式实现 **dom tree** 的更新。

#### 2\. react element

在编写 **react 组件**时，大家都会使用 **jsx** 语法，如下：

```javascript
const Component = () => {
    const list = [1, 2, 3];
    return <ul>{list.map(item => <li key={item}>{item}</li>)}</ul>
}
```

**jsx** 模板，会在 **react** 项目**打包构建**的时候，通过 **babel** 转译为一个 **React.createElement** 的**函数调用**。

```ini
const Component = () => {
  const list = [1, 2, 3];
  return React.createElement("ul", null, list.map(item => React.createElement("li", { key: item}, item)));
}
```

当 **Component** 组件函数被调用时，会执行 **React.createElement** 方法，返回一个称为 **react element** 的 **AST** 对象。

```yaml
{
    $$typeof: Symbol(react.element),
    key: null,  
    ref: null,
    type: 'ul',
    props: {
        children: [{
            $$typeof: Symbol(react.element),
            key: 1, 
            ref: null,
            type: 'li',
            props: { children: 1},
            ...
        }, {
            $$typeof: Symbol(react.element),
            key: 2, 
            ref: null,
            type: 'li',
            props: { children: 1},
            ...
        }, {
            $$typeof: Symbol(react.element),
            key: 3, 
            ref: null,
            type: 'li',
            props: { children: 1 },
            ...
        }]
    },
    ...
}
```

**AST**, 全称 **Abstract Syntax Tree**，学名**抽象语法树**，简称**语法树**，是源代码语法结构的一种抽象表示。在 react 中， react element 作为 AST，是 jsx 模板抽象出来的树形数据结构，在 react 工作过程中起到了非常重要的作用(具体作用，我们会在下面章节中讲解)。

#### 3\. 从 jsx 到 dom 结构

先来看一个简单的 react 示例: [template](https://codesandbox.io/s/template-gddld "https://codesandbox.io/s/template-gddld")

![Sep-07-2021 11-52-57.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77e01e529c6d4f4b8dc1ade976e1dbf2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在上面的示例中，当应用启动以后，react 会自动将我们定义的 template 转化为 dom 结构。

从 **template** 到 **dom** 结构，中间经历的主要过程如下：

![template.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c0ba7a77ee149f09f7bee2de675887b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

其中，fiber tree 是上述整个过程的核心部分。 fiber tree 和 dom tree 中间存在映射关系，两颗 tree 的相关节点会一一对应。 当 fiber tree 结构发生变化时，dom tree 也会相应的更新变化。

#### 从 react element 到 fiber tree

我们通过一个比较简单的示例来说明一下 react element 是如何转化为一颗 fiber tree。

首先是一个结构比较简单的 react element：

```css
{                                               
    type: 'A'
    props: {
        children: [{
            type: 'B',
            props: {
                children: [{                        A
                    type: 'e',                      |    
                    props: {}                       B - C - D
                }]                                  |   |
            }                                       E   F - G
        }, {                                         
            type: 'C',
            props: {
                children: [{
                    type: 'F',                          
                    props: {}                      
                }, {
                    type: 'G',                          
                    props: {}                      
                }]
            }
        }, {
            type: 'D',
            props: {}
        }]
    }
}
```

通过 react element 创建 fiber tree 的过程，我们通过一张图解来说明:

![create-2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c495e19f3119474893569b10882a108c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

结合上面图解，我们做一个总结：

+   fiber tree 中存在三种类型的指针 child、sibling、return。其中，child 指向第一个子节点，sibling 指向兄弟节点，return 指针指向父节点；
    
+   fiber tree 采用的深度优先遍历，如果节点有子节点，先遍历子节点；子节点遍历结束以后，再遍历兄弟节点；没有子节点、兄弟节点，就返回父节点，遍历父节点的兄弟节点；
    
+   当节点的 return 指针返回 null 时，fiber tree 的遍历结束；
    

### react 更新的本质

使用过 react 的同学都知道，当我们调用 setState 方法修改 state 时，就会触发 react 更新。react 更新完成时，页面的 dom tree 结构会发生变化，同时我们在组件中定义的 componentDidMount、componentDidUpdate、useEffect 的 callback 等方法也会触发。

整个过程，其实可以这样理解：react 更新，使得 fiber tree 的结构发生了变化。fiber tree 结构的变化，引发了一系列副作用 - effect，诸如: dom tree 结构的变化、组件生命周期方法执行等。react 会在 fiber tree 更新完成以后，会依次处理产生的副作用。

fiber tree 在更新时，有不同的操作，如 unmount - 卸载不要的 fiber node、mount - 挂载新建的 fiber node 以及 update - 更新 fiber node。不同的操作，引发的副作用也不相同。

在这里我们通过一个示例：[fiber tree 结构更新](https://codesandbox.io/s/mount-unmount-update-move-vg05l "https://codesandbox.io/s/mount-unmount-update-move-vg05l"), 来为大家展示 fiber tree 更新的各类操作以及对应的副作用。

示例如下：

![Sep-08-2021 20-46-18.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d8543e0ef754a7a978b61eb6c5515b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

在上面的示例中，我们通过点击显示、隐藏、修改列表这三个按钮来触发 fiber tree 结构的变化：

+   当我们点击隐藏按钮时，visible 为 false，fiber tree 会 unmount 按钮节点、组件 Component 及子节点；
+   当我们点击显示按钮时，visible 为 true，fiber tree 重新 mount 按钮节点、组件 Component 及子节点；
+   当我们点击修改按钮时，list 列表中的元素会随机调换位置，对应的 Component 的子节点的位置也会移动、更新背景颜色。

另外，在程序中，我们覆写了原生的 createElement、insertBefore 和 appendChild 方法，用来监听 dom 节点的 create 和 move 操作。

接下来，我们就来对上述提到的 **mount**、**unmount**、**update** 操作以及引发的副作用一一分析。

+   **unmount**
    
    点击隐藏按钮，visible 属性为 false，按钮节点、组件 Component 及子节点不需要显示，对应的 fiber node 就会从 fiber tree 中移除。由于 fiber tree 和 dom tree 之间存在映射关系，fiber tree 结构的变化引发了副作用: dom tree 的结构变化。
    
    ![unmount.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b38dfff64e7f408b9a17bb1c01ab6837~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    除此之外，fiber node 的 unmount 操作还会引发其他副作用：
    
    +   组件 componentWillUnmount、useEffect 的 destory 方法的触发；
    +   ref 引用的删除(被删除的节点关联 ref)；
    +   ...
+   **mount**
    
    点击 show 按钮，visible 属性为 true，按钮节点、组件 Component 及子节点需要显示，对应的 fiber node 就需要重新创建并添加到 fiber tree 中。fiber node 的添加，导致 dom tree 也出现了节点的新增操作。
    
    ![mount.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0103b228ac9a4115a24167bb1405dd90~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    由于我们在程序中监听了 createElement 方法，所以当发生 fiber node 的 mount 操作时，我们可以在控制台中看到打印的日志 - "创建 dom 节点"，这样也就能说明确实发生了新建 dom 节点的操作。
    
    初次以外，fiber node 的 mount 操作还会引发其他副作用：
    
    +   组件 componentDidMount、useEffect 的 callback 方法的触发；
    +   ref 应用的初始化；
    +   ...
+   **update**
    
    点击 change 按钮，list 数据发生变化，Component 组件中的列表结构也相应的发生变化。
    
    ![update.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc5d44ea19ce4259aeaabfda384ea562~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    观察控制台打印的日志，我们发现有 "insertBefore 插入节点"、"appendChild 插入节点" 的日志信息，但是没有 "创建 dom 节点" 的日志信息，说明 dom 节点并没有被创建，只是通过 insertBefore、appendChild 方法进行了移动。
    
    由于我们修改了 dom 节点的 background-color 属性，所以 dom 节点还需要更新属性。
    
    除此之外，fiber node 的 update 操作还会引发其他副作用:
    
    +   组件 componentDidUpdate、useEffect 的 callback 方法的触发；
        
    +   ref 引用的更新；
        

另外，react 内部将一次更新分为两个阶段：**render** 阶段和 **commit** 阶段。**render** 阶段，就是对 **fiber tree** 做更新操作，收集更新过程中产生的副作用。而 commit 阶段，主要是处理 render 阶段收集的副作用 - effect。

### react 的工作过程

有了前面知识的铺垫，接下来再来理解 react 的工作过程就比较简单了。

react 的整个工作过程，其实可以分为两个阶段：**应用启动阶段**和**应用交互阶段**。

**应用启动阶段**，就是我们在浏览器输入应用 url 以后，**首屏渲染**的整个过程。在这个过程中，会执行 ReactDOM.render 方法，从无到有构建出一颗 fiber tree，然后根据 fiber tree 渲染出对应的 dom tree。

**首屏渲染**结束后，就进入了**应用交互阶段**。随着用户和页面之间发生的各种交互，fiber tree 的结构也相应的发生变化，触发页面的更新。

可以这么说，fiber tree 的创建、更新是 react 工作过程的核心。

为了能更好的理解 fiber tree 的整个构建、更新过程，本节将从双缓存 fiber tree、fiber tree 的创建、fiber tee 的更新这三个方面，来为大家梳理 react 的工作过程。

#### 双缓存 fiber tree

react 做更新处理时，会同时存在**两颗 fiber tree**。一颗是已经存在的 **old fiber tree**，对应当前屏幕显示的内容，称为 **current fiber tree**；另外一颗是更新过程中构建的 **new fiber tree**，称为 **workInProgress fiber tree**。

当更新完成以后，使用 workInProgress fiber tree 替换掉 current fiber tree，作为下一次更新的 current fiber tree。

#### fiber tree 的创建

fiber tree 的的整个创建过程，我们还是通过之前用过的: [fiber tree 结构更新](https://codesandbox.io/s/mount-unmount-update-move-vg05l "https://codesandbox.io/s/mount-unmount-update-move-vg05l") 来梳理，具体的整个过程如下：

1.  根据 **ReactDOM.render** 方法传入的第一个参数，创建一个 **react Element**；
    
    ```javascript
    ReactDOM.render(<App />, document.getElementById('app'));
    ```
    
    上述代码，在编译打包阶段，经过 babel 处理以后，格式如下:
    
    ```javascript
    ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
    ```
    
    render 方法执行时，会先执行 React.createElement, 返回一个 react element，如下:
    
    ```csharp
      {
          $$typeof: Symbol(react.element),
          key: null,
          props: {},
          ref: null,
          type: App,  // App(不管函数组件还是类组件) 在这里是一个函数方法
          ...
      }
    ```
    
    React.createElement 方法执行完毕以后，开始执行 render 方法，正式进入 fiber tree 的构建阶段。
    
2.  创建一个 fiber root node，作为 fiber tree 的根节点。
    
    树形数据结构，必然有一个根节点 - root，因此需要先为 fiber tree 创建一个 fiber root node。
    
    ![create.b.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5969d46eca249bb928213e43f15aa37~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
3.  根据容器节点，创建一个 div 类型的 fiber node，作为 current fiber tree 的根节点；
    
    ![create.w.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf6a1365e2a4487aa23a43abe148163c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    current fiber tree 和当前的页面结构是对应的。当前页面只有一个 id="app" 的容器节点，所以 current fiber tree 只有一个 fiber node。
    
4.  重新根据 id="app" 的容器节点，创建一个 fiber node，作为 workInProgress fiber tree 的根节点；
    
    ![create.r.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3dc64489d9704821a6fd79f84dc4e316~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    workInProgress fiber tree 确定以后，之后 fiber node 的更新变化都发生在 wokrInProgress fiber tree 上。
    
5.  根据第一步返回的组件 App 的 react element，创建一个组件类型的 fiber node；
    
    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a7493cf3b5f454788e8cdfeb4401116~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
6.  执行组件 App 函数，返回一个 react element；
    
    组件 App 的结构:
    
    ```javascript
    function App() {
        const [visible, setVisible] = useState(true);
        const [list, setList] = useState(["A", "B", "C"]);
        return (
            <div>
                <button onClick={() => setVisible(true)}>显示</button>
                <button onClick={() => setVisible(false)}>隐藏</button>
                <button onClick={() => setList(list.sort(() => 0.5  - Math.random()).slice(0))}>修改</button>
                {visible && <button>按钮</button>}
                {visible && <Component list={list} />}
            </div>
        )
    }
    ```
    
    编译打包阶段，经 babel 处理以后的代码格式为：
    
    ```less
    function App() {
      const [visible, setVisible] = useState(true);
      const [list, setList] = useState(["A", "B", "C"]);
      return React.createElement("div", null, React.createElement("button", onClick: () => setVisible(true) }, "\u663E\u793A"), React.createElement("button", { onClick: () => setVisible(false)}, "\u9690\u85CF"), React.createElement("button", { onClick: () => setList(list.sort(() => 0.5 - Math.random()).slice(0))}, "\u4FEE\u6539"), visible && React.createElement("button", null, "\u6309\u94AE"),visible && React.createElement(Component, { list: list }));
    }
    ```
    
    App 组件函数执行以后，返回的 react element 如下:
    
    ```yaml
    {
        $$typeof: Symbol(react.element),
        key: null,  
        ref: null,
        type: 'div',
        props: {
            children: {
                $$typeof: Symbol(react.element),
                key: null,  
                ref: null,
                type: 'div',
                props: {
                    children: [{
                        $$typeof: Symbol(react.element),
                        key: null,  
                        ref: null,
                        type: 'button',                                
                        props: {                                    
                            children: '显示',                           
                            onClick: () => { ... }
                        },
                        ...
                    }, {
                        $$typeof: Symbol(react.element),               
                        key: null,                                     
                        ref: null,
                        type: 'button',
                        props: {
                            children: '隐藏',
                            onClick: () => { ... }
                        },
                        ...
                    }, {
                        $$typeof: Symbol(react.element),
                        key: null,  
                        ref: null,
                        type: 'button',
                        props: {
                            children: '修改',
                            onClick: () => { ... }
                        },
                        ...
                    }, {
                        $$typeof: Symbol(react.element),
                        key: null,  
                        ref: null,
                        type: 'button',
                        props: {
                            children: '按钮'
                        },
                        ...
                    }, {
                        $$typeof: Symbol(react.element),
                        key: null,  
                        ref: null,
                        type: Component,  // Component 是一个组件
                        props: { list: list},
                        ...
                    }]
                },
                ...
            }
        },
        ...
    }
    ```
    
    react element 是一个树形结构，父节点可以通过 props.children 来访问子节点。
    
7.  将上一步返回的 react element，转化为一颗 sub fiber tree，添加到 fiber tree 中；
    
    ![create.u.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5779e87487cf44b5be986cb0da02ebab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    此时 workInProgress 指针指向 Component 节点，Component 是一个组件。
    
8.  执行组件 Component 函数，返回一个 react element。
    
    组件 Component 的结构如下：
    
    ```javascript
    const Component = (props) => {
        useEffect(() => {
            console.log("mounted");
            return () => {
                console.log("unmounted");
            };
        }, []);
        return (
            <ul>
                {props.list.map((item, index) => (
                    // 加上 key 属性， dom 节点才会发生 move
                    <li key={item} style={{ backgroundColor: color[index] }}>
                        {item}
                    </li>
                ))}
            </ul>
        )
    };
    ```
    
    经 babel 处理以后的代码为:
    
    ```javascript
    const Component = props => {
        useEffect(() => {
            console.log("mounted");
            return () => {
              console.log("unmounted");
            };
        }, []);
        return React.createElement("ul", null, props.list.map((item, index) => React.createElement("li", { key: item, style: { backgroundColor: color[index] }}, item)));
    }
    ```
    
    Component 函数方法执行以后，返回的 react element 为:
    
    ```csharp
    { 
        $$typeof: Symbol(react.element), 
        key: null, 
        ref: null, 
        type: 'ul', 
        props: {
            children: [{
                $$typeof: Symbol(react.element),
                key: 'A',  
                ref: null,
                type: 'li',
                props: { children: 'A'}
            }, {
                $$typeof: Symbol(react.element),
                key: 'B',  
                ref: null,
                type: 'div',
                props: { children: 'B'}
            }, {
                $$typeof: Symbol(react.element),
                key: null,  
                ref: null,
                type: 'li',
                props: { children: 'C'}
            }]
        }
    }
    ```
    
9.  将 react element 转化为一颗 sub fiber tree，挂到 fiber tree 上;
    
    ![create.p.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0661aa6fdf0d4ac18e0bc3ba886f65d8~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    ![create.i.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6de4b0dd607b44d78c494b36ea0e18dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
    ![create.y.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1ca0f7a691644bc8abdba5955093f19~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
10.  将 root 的 current 指针指向 workInProgress fiber tree
    
    ![create.m..png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cac2102564f941c6a73ecff763b0f0d2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    
11.  fiber tree 创建完成，处理对应的副作用。
    
    首屏渲染阶段，fiber tree 从无到有，所有的 fiber node 都是第一次 mount，产生的副作用包括：
    
    +   所有 dom 节点的新增；
    +   componentDidMount、useEffect 的 callback 函数的触发；
    +   ref 引用的初始化；
    
    在 commit 阶段，所有的副作用被处理，新增的 dom 节点添加到页面上，componentDidMount、useEffect 的 callback 函数触发。
    
    ![create.n.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5e60fe9aadc4b4e8fd95bf79a872465~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
    

随着 fiber tree 构建完成，所有的副作用处理完毕，首屏渲染完成。

#### fiber tree 的更新

还是借助示例：[fiber tree 结构更新](https://codesandbox.io/s/mount-unmount-update-move-vg05l "https://codesandbox.io/s/mount-unmount-update-move-vg05l"), 我们来梳理一下 fiber tree 的更新过程。

[fiber tree 结构更新](https://codesandbox.io/s/mount-unmount-update-move-vg05l "https://codesandbox.io/s/mount-unmount-update-move-vg05l") 中，涉及到 unmount、重新 mount、update 操作，我们通过一系列图解来详细说明。

+   **unmount 更新**
    
    点击隐藏按钮，通过 setVisible(false)，触发 react 更新。在本次更新中，需要对 fiber tree 做 unmount 操作，过程如下:
    
    1.  在 current fiber tree 中，标记发生更新的 fiber node;
        
        ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8216436e12164871bf8c67c83f36c3ea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
        
    2.  开始更新 fiber tree；
        
        ![update.unmount.5.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/923227dc3c724da48713e771bc1b1453~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
        
    3.  组件节点 App 需要更新，执行组件函数方法，返回一个新的 react element，将新的 react element 转化为 fiber node；
        
        由于 visible 属性为 false，返回的 react element 发生了变化，没有按钮、Component 节点。
        
        新的 react element 的结构为：
        
        ```yaml
        {
             $$typeof: Symbol(react.element),
             key: null,  
             ref: null,
             type: 'div',
             props: {
                 children: {
                     $$typeof: Symbol(react.element),
                     key: null,  
                     ref: null,
                     type: 'div',
                     props: {
                         children: [{
                             $$typeof: Symbol(react.element),
                             key: null,  
                             ref: null,
                             type: 'button',                                
                             props: {                                    
                                 children: '显示',                           
                                 onClick: () => { ... }
                             },
                             ...
                         }, {
                             $$typeof: Symbol(react.element),               
                             key: null,                                     
                             ref: null,
                             type: 'button',
                             props: {
                                 children: '隐藏',
                                 onClick: () => { ... }
                             },
                             ...
                         }, {
                             $$typeof: Symbol(react.element),
                             key: null,  
                             ref: null,
                             type: 'button',
                             props: {
                                 children: '修改',
                                 onClick: () => { ... }
                             },
                             ...
                         }]
                     },
                     ...
                 }
             },
             ...
         }
        ```
        
        fiber tree 的更新过程如下：
        
        ![update.unmount.6.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/845c67db065a40ec9436e2b1927671dc~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
        
        ![update.unmount.8.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f11fd3801ee4ce68452db8598c699ef~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
    4.  将 fiber root node 的 current 指针指向 workInProgress tree；
        
        ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/66c9031a379a4d18ac182715f23eef7b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
    5.  fiber tree 更新完成，处理副作用
        
        ![update.unmount.10.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f33cb0a06c54b0a9c78b5f0f942ab0e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
        此次更新，对 fiber tree 进行了 unmount 操作，触发的副作用的包括：
        
        +   dom 节点的移除；
        +   组件 componentWillUnmount、useEffect 的 destory 方法的触发；
        
        此外，在实际应用中，unmount 操作还会触发 ref 引用的删除、等副作用。
        
+   **mount 更新**
    
    点击显示按钮，通过 setVisible(true)，触发 react 更新。在本次更新中， fiber tree 做 mount 操作，过程如下:
    
    1.  在 current fiber tree 中，标记发生更新的 fiber node；
        
        ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f80bd6e4540f497e9a333d2db86c3f15~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
    2.  开始更新 fiber tree；
        
        ![update.mount.3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35ee751dffd140d1be609cc59c535ac5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
        
    3.  组件节点 App 需要更新，执行组件函数方法，返回一个新的 react element，将新的 react element 转化为 fiber node；
        
        ![update.mount.5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a040d4528f7145b6b665dde39ab79b0b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
        ![update.mount.6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2fae0d974954af88dcf1f45b2cb6691~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
    4.  将 fiber root node 的 current 指针指向 workInProgress tree;
        
        ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18bdcbb40dd148749481320878fbab16~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
    5.  fiber tree 更新完成，处理副作用
        
        ![update.mount.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68736ca0d0314eae8e2119b25e0980f0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
+   **update 更新**
    
    点击修改按钮，通过 setList(list)，触发 fiber tree 的更新。在本次更新中， fiber tree 做 update 操作，过程如下:
    
    1.  在 current fiber tree 中，标记发生更新的 fiber node;
        
        ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8216436e12164871bf8c67c83f36c3ea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
        
    2.  开始更新 fiber tree；
        
        ![update.unmount.5.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/923227dc3c724da48713e771bc1b1453~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)
        
    3.  组件节点 App 需要更新，执行组件函数方法，返回一个新的 react element，将新的 react element 转化为 fiber node；
        
        ![update.update.1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c218c26cc5e44a2a4251847b834a603~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
    4.  将 fiber root node 的 current 指针指向 workInProgress fiber tree；
        
        ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9f7616b2536419b84308a6232a7ed15~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        
    5.  fiber tree 更新完成，处理副作用；
        
        ![update.update.3.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/561216656dc94f02bb04140d8c67daf5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)
        

### 写在最后

到这里，关于 react 工作过程的梳理就结束了。如果小伙伴们能看到这里，那么真是非常感谢了，感谢小伙伴们对本文的支持！

最后，我们再来总结一下本文的重要知识点：

+   从 jsx 到最后的 dom 节点，中间要经历：
    
    1.  jsx 模板通过 babel 编译为 createElement 语法；
    2.  执行组件方法，触发 createElement 的执行，返回 react element；
    3.  根据 react element 生成 fiber tree；
    4.  根据 fiber tree 生成 dom tree；
+   react 更新的本质 - 通过修改组件 state 触发 fiber tree 更新，fiber tree 的更新，产生了副作用，需要在 fiber tree 更新完成以后更新 dom tree、执行生命周期方法等；
    
+   react 更新时会同时存在两颗 fiber tree: current fiber tree 和 workInProgress fiber tree。current fiber tree 对应当前页面的 dom 结构，workInProgress fiber tree 为更新过程中创建的新的 fiber tree。更新结束以后，workInProgress fiber tree 会作为下一次更新的 current fiber tree。
    

正如标题所言，其实本文只是对 react 的工作过程做了简单的初步梳理，并没有对核心内容做详细说明。花这么长的篇幅，并使用大量的图解，主要是为了想先让小伙伴们对 react 的工作过程有一个比较形象的认识，方便后面能更容易的理解诸如 fiber tree 的协调过程、任务调度、组件更新等这些知识点。

下一篇文章，我们将会对 react 的工作过程做一个更加详细的说明，梳理 fiber tree 的协调过程、diff 算法、副作用的收集以及处理等过程，希望到时能帮助大家更好的理解 react 的工作过程。

### 参考资料

+   [React 官方文档](https://react.docschina.org/docs/getting-started.html "https://react.docschina.org/docs/getting-started.html")
+   [React 技术揭秘](https://react.iamkasong.com/ "https://react.iamkasong.com/")