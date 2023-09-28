## 2023 年 8 月 25 日

## 1. useState()
```react 
const [count, setCount] = useState(0)
```

## 2. useMemo() (相当于vue的computed)
```react
// 示例：
const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);

```

## 3. useEffect()
#### 1.结构
useEffect(callback: function, params?:array)
```
useEffect(() => {
    TODO: // 监听的值发生变化执行
    return () => {} // 清理（cleanup）函数  ---每次重新执行 Effect 之前，React 都会调用清理函数；组件被卸载时，也会调用清理函数。
}, []) // 依赖的响应式数据
```

#### 2.不同参数的不同效果
```
useEffect(() => {
  // 这里的代码会在每次渲染后执行
});

useEffect(() => {
  // 这里的代码只会在组件挂载后执行
}, []);

useEffect(() => {
  //这里的代码只会在每次渲染后，并且 a 或 b 的值与上次渲染不一致时执行
}, [a, b]);
```
#### 3.注意
```
1. 对非原始值类型（引用类型）监听解决方案
2. 执行逻辑中有响应式数据，而不需要被响应式监听则需要使用 const onEvent = useEffectEvent(() => {})
```

## 4.useRef()
```react
const ref = useRef(0); // 声明
ref.current // 使用

当修改ref的值 ref.current = ref.current + 1;
react 会记住这个值的修改 但修改值不会触发重新渲染
```

## 5.useContext()
可以深层传递数据的 相当于vue中的provide inject

```react
// 父组件
import { createContext } from 'react';
const ThemeContext = createContext(null);

<ThemeContext.Provider value='dark'>
<!--其他组件-->
</ThemeContext.Provider>

// 任意层子组件中
import { useContext } from 'react'; 

const theme = useContext(ThemeContext);

```

## 6.useReducer()
状态管理