## 浏览器学习

1. 浏览器安全
    + XSS攻击： 存储型  映射型 DOM型;  过滤 CSP 
    + CSRF： 跨站请求伪造 ； CSRF token、 验证 origin referer 、 cookie sameSite
    + 中间人攻击： 劫持两端数据 ； https

2. 浏览器渲染进程
    + 渲染进程包含： GUI渲染线程、JS引擎线程（与GUI互斥）、事件触发线程、定时器触发线程、异步http请求线程

3. 浏览器缓存：
    + 强缓存
    + 协商缓存
    + 启发式缓存

    作用：
        减少服务器负担，提高网站性能；加快网页加载速度；减少网路数据传输；

4. 浏览器渲染原理
    + url -> page 
        判断缓存 -> DNS解析(缓存) -> 发起请求 -> 响应解析 -> HTML + CSS -> render tree -> 绘制 -> page

5. 浏览器本地存储
    + Cookie
    + localStorage
    + sessionStorage
    + IndexDB 异步 事务 NoSQL 对象/二进制

6. 同源策略
    + 同源策略、
    + 跨域请求：
        + Nginx 
        + CORS
        + JSONP
        + WebSocket
        + postmessage 

7. 事件模型
    + 事件循环
    + 事件模型 捕获 目标 冒泡

8. 垃圾回收
    + 新生代 老生代 标记清楚 标记压缩
    + 内存泄漏
        + 使用未定义变量
        + 未清除的 setInterval
        + 获取DOM引用
        + 不合理的闭包使用
    
9. 网络请求
    + http 1 2 3的区别
    + https
    + tcp 