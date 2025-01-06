`useCallback` 和 `useMemo` 都是 React 中的 Hook，用来优化性能，避免不必要的重新渲染和计算。虽然它们有些相似，但它们有不同的用途和工作原理。

### 1. `useCallback`

`useCallback` 用来记住一个函数的引用，以防止在每次组件渲染时都重新创建该函数，特别是当函数作为 props 传递给子组件时，能够避免子组件的不必要重新渲染。

**适用场景：**
- 需要将函数作为 props 传递给子组件，并且避免在父组件重新渲染时，子组件不必要的重新渲染。
- 需要优化性能，避免在每次渲染时创建新函数的引用。

**代码示例：**

```jsx
import React, { useState, useCallback } from 'react';

function Child({ handleClick }) {
  console.log('Child re-rendered');
  return <button onClick={handleClick}>Click me</button>;
}

function Parent() {
  const [count, setCount] = useState(0);

  // 使用 useCallback 来避免在每次 Parent 组件渲染时都重新创建 handleClick 函数
  const handleClick = useCallback(() => {
    alert('Button clicked');
  }, []); // 依赖为空数组，意味着函数只会在首次渲染时创建一次

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child handleClick={handleClick} />
    </div>
  );
}

export default Parent;
```

在上面的例子中，如果不使用 `useCallback`，`handleClick` 函数会在每次 `Parent` 组件渲染时被重新创建，这样 `Child` 组件会重新渲染，因为它接收了新的 `handleClick` 函数。使用 `useCallback` 后，`handleClick` 只会在组件首次渲染时创建，避免了不必要的渲染。

### 2. `useMemo`

`useMemo` 用来记住某个计算结果，只有在依赖项发生变化时才重新计算。它的主要目的是避免在每次渲染时进行昂贵的计算，优化性能。

**适用场景：**
- 需要在组件中进行昂贵的计算时，避免每次渲染都重新计算。
- 需要优化渲染过程中的数据计算或生成，并且这些计算依赖于某些变量。

**代码示例：**

```jsx
import React, { useState, useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const expensiveComputation = useMemo(() => {
    console.log('Expensive computation running...');
    return data.reduce((acc, item) => acc + item, 0);
  }, [data]); // 只有当 data 改变时才会重新计算

  return <div>Total: {expensiveComputation}</div>;
}

function Parent() {
  const [data, setData] = useState([1, 2, 3]);
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <ExpensiveComponent data={data} />
      <button onClick={() => setData([1, 2, 3, 4])}>Change Data</button>
    </div>
  );
}

export default Parent;
```

在上面的例子中，`useMemo` 会缓存 `expensiveComputation` 计算结果，只有当 `data` 改变时，才会重新计算。如果没有 `useMemo`，每次父组件渲染时，`ExpensiveComponent` 中的计算就会重复进行，造成性能浪费。

### 总结：

- `useCallback` 用于**记住函数引用**，避免每次渲染时都创建新函数引用，常用于优化子组件的渲染。
- `useMemo` 用于**记住计算结果**，避免每次渲染时都进行昂贵的计算，常用于优化数据计算。

这两者都能提高组件的性能，尤其是在渲染频繁的情况下。