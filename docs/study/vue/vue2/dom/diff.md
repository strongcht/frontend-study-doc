[参考地址](https://juejin.cn/post/7367722307203563558)
## 前言

> 文中讲解代码为 Vue 组合式 API 的最后一个版本 2.6.14 ~ 为了更好的理解，省略了部分代码，留下核心逻辑进行讲解。如需完整代码解释，可在代码库拉取完整代码，每一行均有完整注释，并在不断地完善中，我也会不断补充所有 Vue 源码中涉及到的逻辑；文章中有需要纠正的地方，欢迎大家指出，我们共同打造一份详细易懂的源码解析 ~

如果大家想要了解代码中提到的函数，可以评论区留言，我会补充对该函数的讲解！

`Vue` 的 `Virtual DOM` 和 `Diff` 算法是其核心特性之一，也是面试的热点话题之一。它们使得 `Vue` 能够高效地更新视图。在本文中，我们将深入探讨 `Vue` 源码中的 `Diff` 算法，了解它是如何工作的以及它对 `Vue` 应用的性能优化有何影响

## 流程讲解

在 `Vue` 中，当数据发生变化的时候，会触发渲染 `watcher` 的回调函数（ `updateComponent` ），进而执行组件的更新过程（在本章我们无需关注如何触发更新，只需知道此时在更新组件，以及更新所调用的方法）

在之前的实例挂载章节提到过，当 `Vue` 挂载的时候，会初始化渲染 `watcher`，并传入更新方法 `updateComponent`

在之前的依赖收集章节提到过，当更新视图时，会调用更新方法，即 `updateComponent` => `vm._update`方法

```javascript
// src\core\instance\lifecycle.js

function mountComponent (vm, el, hydrating) {
  ...
  var updateComponent = function () { // 更新组件
    vm._update(vm._render(), hydrating);
  };
  
  // 实例化渲染Watcher (传入 updateComponent函数, 在更新时调用)
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
}
```

组件的更新调用了 `vm._update` 方法，而更新的核心方法便是 `vm.__patch__(prevVnode, vnode)` 这一步，而 `__patch__` 方法的本质就是 `patch` 方法

此方法在初次渲染时，将虚拟节点保存到 `_vnode` 上，作为是否初次渲染的标识

```javascript
// src\core\instance\lifecycle.js

Vue.prototype.__patch__ = patch;

Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  var vm = this;
  ...
  const prevVnode = vm._vnode
  vm._vnode = vnode;
  if (!prevVnode) { // 初始渲染
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else { // 更新渲染
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  
  ...
  
}
```

### createPatchFunction方法（patch方法的创建）

以下是创建 `patch` 函数的过程，通过执行 `createPatchFunction` 得到的返回值便是 `patch` 函数，其中还包括许多更新过程中需要用到的方法

```javascript
// src\core\vdom\patch.js

function createPatchFunction (backend) {

  function patchVnode() { ... }
  
  return function patch (oldVnode, vnode, hydrating, removeOnly) { ... }
}
```

### patch方法

现在单独分析 `patch` 方法的过程

首先，通常我们进行对比，会采用循环嵌套的方式去遍历，复杂度较高。而 `Diff` 算法的整体策略：深度优先算法，**同层比较**，不会跨层级比较，时间复杂度是 `O(n)`

![Diff比较方式.png](/images/vueAnalysis/diff-01.png) 然后，我们分析代码，在 `patch` 方法中会出现以下两种情况（此处不分析组件）：

1.  旧节点为虚拟节点且与新节点相同
    
    当新旧节点相同时，使用 `Diff` 算法更新，核心便是调用 `patchVnode` 方法
    

> 需要注意的是判断新旧节点相等的方法 `sameVnode` 的判断依据是节点的 `tag`（标签名）和 `key`（节点标识）相等。当 `key` 值都不存在时，则都为 `undefined` ，即为相等

2.  旧节点为虚拟节点且新旧节点不相同 或 旧节点为真实节点

+   新旧节点不同时，由于 `Diff` 算法只会同层级比较，所以创建新节点并销毁旧节点
+   旧节点为真实节点，则创建一个空节点(虚拟节点)替换它，再进行创建销毁操作

```javascript
// src\core\vdom\patch.js

function patch (oldVnode, vnode, hydrating, removeOnly) {

  if (isUndef(oldVnode)) {
    ...
  } else {
    var isRealElement = isDef(oldVnode.nodeType); // 是否为真实节点
    
    // 1. 旧节点为虚拟节点且新旧节点相同 (使用 Diff算法更新)
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      
    // 2. 旧节点为虚拟节点且新旧节点不相同 (创建并插入新节点, 移除旧节点)
    } else {
      var oldElm = oldVnode.elm; // 旧节点的真实 DOM
      var parentElm = nodeOps.parentNode(oldElm); // 旧节点的父节点

      createElm( // 创建新节点并插入父级节点
        vnode,
        insertedVnodeQueue,
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      );

      ...

      if (isDef(parentElm)) { // 销毁旧节点
        removeVnodes([oldVnode], 0, 0);
      }
    }
  }
  
  return vnode.elm
}
```

### patchVnode方法

然后我们紧接着看 `patchVnode` 方法，这里主要会做以下三步处理：静态节点的处理、节点属性的处理以及对子节点的处理，我们接下来一一分析

```javascript
// src\core\vdom\patch.js

function patchVnode (oldVnode, vnode ...) {
  
  ...

  var elm = vnode.elm = oldVnode.elm;

  // 1. 静态节点的处理

  // 2. 节点属性的处理

  // 3. 对子节点的处理
  
}
```

#### 静态节点的处理

新旧虚拟节点如果为静态节点，就不需要进行更新操作，直接跳过更新比对的过程

```javascript
// isStatic: 是否是静态节点
// isCloned: 是否是克隆节点
// isOnce: 是否使用 v-once 指令 (仅初渲染, 不随数据变化而变化)
if (isTrue(vnode.isStatic) &&
  isTrue(oldVnode.isStatic) &&
  vnode.key === oldVnode.key &&
  (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
) {
  vnode.componentInstance = oldVnode.componentInstance;
  return
}
```

静态节点的判断方法 `isStatic`，判断依据如下

1.  文本类型节点
2.  使用 `v-pre` 指令和 `pre` 标签（跳过元素和其子元素的编译过程）
3.  其他节点：

+   非动态绑定
+   不含 `v-if`，`v-for`，`v-else` 指令
+   非 `slot`，`component` 标签的节点
+   是否为符合当前平台的标签(例：`web` 平台可使用 `div`，`span`，`select` 等)
+   静态节点的父节点, 不能为使用 `v-for` 指令的 `template` 标签
+   节点是否包含静态属性( `type`，`tag`，`attrsList` 等)

```javascript
// vue\compiler\optimizer.js

function isStatic (node) {
  if (node.type === 2) { // 表达式
    return false
  }
  if (node.type === 3) { // 文本节点
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // 非动态绑定
    !node.if && !node.for && // 不含v-if v-for v-else指令
    !isBuiltInTag(node.tag) && // 非slot component标签
    isPlatformReservedTag(node.tag) && // 是否为符合当前平台的标签
    !isDirectChildOfTemplateFor(node) && // 祖先节点不能为使用 v-for指令的 template标签
    Object.keys(node).every(isStaticKey) // 节点是否包含静态属性
  ))
}
```

#### 节点属性的处理

通过遍历 `cbs.update` 方法，调用对属性的处理方法对属性进行操作，分别有以下几种处理函数：

+   `updateAttrs`：更新 `attr` 属性
+   `updateClass`：更新 `class` 属性
+   `updateDOMListeners`：更新绑定事件属性
+   `updateDOMProps`：更新 `props` 属性
+   `updateStyle`：更新 `style` 属性
+   `updateDrectives`：更新指令 `Drectives` 属性

```javascript
var oldCh = oldVnode.children;
var ch = vnode.children;

if (isDef(data) && isPatchable(vnode)) {
  for (i = 0; i < cbs.update.length; ++i) { 
    cbs.update[i](oldVnode, vnode); // 更新
  }
}
```

而变量 `cbs` 的定义过程如下，是包含以生命周期为键名，属性的处理函数集合为键值的对象

```javascript
// src\platforms\web\runtime\modules\attrs.js
// src\platforms\web\runtime\modules\class.js

function updateAttrs (oldVnode, vnode) {}
function updateClass (oldVnode, vnode) {}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

var klass = {
  create: updateClass,
  update: updateClass
};

...

var platformModules = [ // 处理方法
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

var modules = platformModules.concat(baseModules);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy']; // 生命周期

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;

  for (i = 0; i < hooks.length; ++i) { // 在不同生命周期下对属性的处理函数
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  ...

  return	return function patch (oldVnode, vnode, hydrating, removeOnly) {}
}
```

经过处理后的 `cbs` 如下

![](/images/vueAnalysis/diff-02.png)

> 此处重点为 `Diff` 算法，属性的更新只讲解流程，具体处理，在我的源码中有详细注释

#### 子节点的处理（重点）

此时首先会通过定义 `text` 属性来判断是否为文本节点

1.  新节点非文本节点的情况

+   新旧节点都有子节点且不相同，则调用 `updateChildren` 方法比较更新子节点（**重点**）
+   新节点有子节点，旧节点无子节点。说明更新后多了子节点，则创建新 `DOM` 添加到父节点
+   旧节点有子节点，新节点无子节点。说明更新后旧节点的子节点不存在，则移除子节点
+   旧节点为文本节点，则将 `DOM` 的文本内容设置为空

2.  新节点为文本节点的情况

+   新旧节点都为文本节点，但文本内容不一样，则将 `DOM` 的文本内容更新为新节点的文本内容

```javascript
if (isUndef(vnode.text)) { // 新节点非文本节点
  if (isDef(oldCh) && isDef(ch)) { // 新旧节点都有子节点
    if (oldCh !== ch) {
      updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); // 比较更新子节点
    }
  } else if (isDef(ch)) { // 新节点有子节点
    if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '');
    }
    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
  } else if (isDef(oldCh)) { // 旧节点有子节点
    removeVnodes(oldCh, 0, oldCh.length - 1);
  } else if (isDef(oldVnode.text)) { // 旧节点为文本节点
    nodeOps.setTextContent(elm, '');
  }
} else if (oldVnode.text !== vnode.text) { // 新旧节点都为文本节点且文本不一样
  nodeOps.setTextContent(elm, vnode.text);
}
```

### updateChildren方法

这便是 `Diff` 算法的核心，新旧虚拟节点的子节点对比，采用了双端指针 `Diff` 算法。对比的是虚拟 `DOM`，但是移动、删除、插入操作的是真实 `DOM`

```javascript
// src\core\vdom\patch.js

function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  var oldStartIdx = 0; // 旧节点的头指针
  var newStartIdx = 0; // 新节点的头指针
  var oldEndIdx = oldCh.length - 1; // 旧节点的尾指针
  var oldStartVnode = oldCh[0]; // 旧节点的头节点
  var oldEndVnode = oldCh[oldEndIdx]; // 旧节点的尾节点
  var newEndIdx = newCh.length - 1; // 新节点的尾指针
  var newStartVnode = newCh[0]; // 新节点的头节点
  var newEndVnode = newCh[newEndIdx]; // 新节点的尾节点
  var oldKeyToIdx, idxInOld, vnodeToMove, refElm;
  
  var canMove = !removeOnly;

  ...

  // 双端指针Diff
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 如果旧节点的头节点为空, 说明该节点已经在新节点列表中找到了位置, 需要将旧节点的头指针向后移动
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
    // 如果旧节点的尾节点为空, 说明该节点已经在新节点列表中找到了位置, 需要将旧节点的尾指针向前移动
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx];
      
    // 1. 旧节点的头节点与新节点的头节点进行比较
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
      oldStartVnode = oldCh[++oldStartIdx]; // 移动旧节点的头指针以及更新旧节点的头节点
      newStartVnode = newCh[++newStartIdx]; // 移动新节点的头指针以及更新新节点的头节点
      
    // 2. 旧节点的尾节点与新节点的尾节点进行比较
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
      oldEndVnode = oldCh[--oldEndIdx]; // 移动旧节点的尾指针以及更新旧节点的尾节点
      newEndVnode = newCh[--newEndIdx]; // 移动新节点的尾指针以及更新新节点的尾节点
      
    // 3. 旧节点的头节点与新节点的尾节点进行比较
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
      // 将旧节点的头节点移动到旧节点的尾节点之后
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
      oldStartVnode = oldCh[++oldStartIdx]; // 移动旧节点的头指针以及更新旧节点的头节点
      newEndVnode = newCh[--newEndIdx];     // 移动新节点的尾指针以及更新新节点的尾节点
      
    // 4. 旧节点的尾节点与新节点的头节点进行比较
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
      // 将旧节点的尾节点移动到旧节点的头节点之前
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];     // 移动旧节点的尾指针以及更新旧节点的尾节点
      newStartVnode = newCh[++newStartIdx]; // 移动新节点的头指针以及更新新节点的头节点

    // 5. 暴力对比
    } else {
      /* 生成旧节点映射表, 根据新节点的 key 查找对应的旧节点在旧节点列表中的索引 */
      if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      // 5.1 如果在映射表中找不到对应的索引, 则说明这是一个新节点, 需要创建
      if (isUndef(idxInOld)) {
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
      // 在映射表中找到了对应的旧节点, 尝试复用或者移动
      } else {
        vnodeToMove = oldCh[idxInOld];
        // 5.2.1 如果找到的旧节点和新节点是同一个节点, 则尝试复用
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldCh[idxInOld] = undefined; // 将旧节点置为 undefined, 表示已经被复用
          // 将复用的节点移动到旧节点的头节点之前
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        // 5.2.2 如果 key 相同但节点不同, 按照新节点处理, 创建新节点并插入父级节点
        } else {
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        }
      }
      newStartVnode = newCh[++newStartIdx]; // 移动新节点的头指针以及更新新节点的头节点
    }
  }
  
  if (oldStartIdx > oldEndIdx) { // 当新节点有剩余元素, 则插入
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue); // 插入 DOM元素
  } else if (newStartIdx > newEndIdx) { // 当旧节点有剩余元素, 则删除
    removeVnodes(oldCh, oldStartIdx, oldEndIdx); // 删除 DOM元素
  }
}
```

`while` 循环分别处理了以下5种情况：分别是节点的新前与旧前、新后与旧后、新后与旧前、新前与旧后以及暴力对比

`while` 循环结束的条件是当其中一个数组遍历完 `startIdx < endIdx`，则结束遍历。在循环的过程中，指针不断从两边向中间收拢

当循环结束后，还可能出现剩余节点的情况，对剩余节点的2种情况分别进行了处理

> +   新前：新节点中头指针指向的节点
> +   旧前：旧节点中头指针指向的节点
> +   新后：新节点中尾指针指向的节点
> +   旧后：旧节点中尾指针指向的节点

![图标释义.png](/images/vueAnalysis/diff-03.png)

> 最开始未处理的旧节点对应的就是真实 `DOM` 的情况

#### 新前与旧前

+   如果新旧节点相同，则不需操作真实 `DOM`。新老节点的头指针向后移动
+   如果不同，则继续进行新后与旧后的比较

![Diff新前与旧前对比.png](/images/vueAnalysis/diff-04.png)

#### 新后与旧后

+   如果新旧节点相同，则不需操作真实 `DOM`。新老节点的尾指针向前移动
+   如果不同，则继续进行新后与旧前的比较

![Diff新后与旧后对比.png](/images/vueAnalysis/diff-05.png)

#### 新后与旧前

+   如果新旧节点相同，则操作真实 `DOM`，将旧节点对应的真实 `DOM` 插入到旧节点的结束节点对应的真实 `DOM` 的后面。然后新节点的尾指针向前移动，旧节点的头指针向后移动
+   如果不同，则继续进行新前与旧后的比较

![Diff新后与旧前对比.png](/images/vueAnalysis/diff-06.png)

#### 新前与旧后

+   如果新旧节点相同，则操作真实 `DOM`，将旧节点对应的真实 `DOM` 插入到旧节点的开始节点对应的真实 `DOM` 的前面。然后新节点的头指针向后移动，旧节点的尾指针向前移动
+   如果不同，则继续进行新前与旧后的比较

![Diff新前与旧后对比.png](/images/vueAnalysis/diff-07.png)

#### 暴力对比

当以上四种对比均为成功，则进行暴力对比

![Diff暴力对比.png](/images/vueAnalysis/diff-08.png) 首先生成一个节点 `key` 值映射到节点下标 `key => index` 的映射表。然后用新节点的开始节点的 `key`，去映射表找对应映射关系，此时会出现两种情况：

```javascript
let oldCh = [{    
  tag:"div",  key: 1
},{  
  tag:"span", key: 3
},{  
  tag:"div", key: 5
}];

// 映射表 key => index
let oldKeyToIdx = {
  1: 0,
  3: 1,
  5: 2
};
```

1.  如果在映射表中找到，就把新节点对应的真实 `DOM` 插入旧节点的开始节点对应的真实 `DOM` 的前面，旧节点原来的位置用 `undefined` 占位，避免破坏映射表的位置。旧节点的头指针向后移动

![Diff暴力对比1.png](/images/vueAnalysis/diff-09.png) 2. 如果在映射表中没有找到，就为新节点创建真实 `DOM` 并插入旧节点的开始节点对应的真实 `DOM` 的前面。旧节点的头指针向后移动

![Diff暴力对比2.png](/images/vueAnalysis/diff-10.png)

#### 疑问解答

1.  对比后调用 `patchVnode` 的原因

调用 `patchVnode` 是继续处理它们的子节点，或更新文本

2.  节点是如何移动的

简化后的源码是这样的，通过插入到头指针指向的节点之前完成移动操作

```javascript
parentElm.insertBefore(
  oldStartVnode.elm,
  oldEndVnode.elm.nextSibling
)
```

#### 新节点有剩余

旧节点遍历完，新节点可能还有剩余。就为剩余新节点创建真实 `DOM` 并插入旧节点的结束节点对应的真实 `DOM` 的后面

![新节点剩余.png](/images/vueAnalysis/diff-11.png)

#### 旧节点有剩余

新节点遍历完，旧节点可能还有剩余。则遍历剩下的旧节点，删除旧节点对应的真实 `DOM`

![旧节点剩余.png](/images/vueAnalysis/diff-12.png)

## 总结

1.  **Diff 算法是什么？**

`Diff` 算法是 `Virtual DOM` 在更新过程中的核心部分，它用于比较新旧 `Virtual DOM` 树，找出变化并更新到真实 `DOM` 上

2.  **Vue 中的 Diff 算法实现原理**

`Vue` 中的 `Diff` 算法采用了双端比较的策略，将新旧节点逐个比较，以最小化操作数。同时，它通过使用 `Key` 来优化对列表的更新

3.  **Diff 算法的优化**

`Vue` 中的 `Diff` 算法经过了多次优化，包括同级比较、元素移动、新增和删除等方面的优化，以提高更新效率

4.  **性能优化和注意事项**

+   合理使用 `Key` 可以大大提高 `Diff` 算法的效率，避免出现不必要的重新渲染
+   避免过度深度的 `Virtual DOM` 可以减少 `Diff` 算法的复杂度
+   异步更新可以优化渲染性能，避免阻塞主线程

5.  **Diff 算法的重要性**

+   `Diff` 算法是 `Vue` 高效更新视图的关键，它使得 `Vue` 应用能够在数据变化时快速响应，提升了用户体验。

总的来说，`Vue` 源码中的 `Diff` 算法是 `Vue.js` 的核心特性之一，它为我们提供了一种高效的方式来管理和更新 `DOM`。了解 `Diff` 算法的原理和优化策略，对于我们更好地使用 `Vue.js` 构建应用和进行性能优化是非常有帮助的