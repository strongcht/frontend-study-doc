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
    + 事件循环 宏任务 微任务
    + 事件模型 捕获 目标 冒泡

8. 垃圾回收
    + 新生代 老生代 标记清除 标记压缩
    + 内存泄漏
        + 使用未定义变量
        + 未清除的 setInterval定时器
        + 获取DOM引用
        + 不合理的闭包使用
    
9. 网络请求
    + http 1 2 3的区别
    + https 证书 加密
    + tcp 

10. 响应码
HTTP 状态码是服务器在响应客户端请求时返回的状态信息，用来表示请求的结果。状态码是三位数字，分为五个类别，每个类别有不同的含义。以下是各类状态码的详细介绍及常见示例：

---

**1xx 信息性响应**
表示请求已被接收，需要进一步操作。

- **100 Continue**  
  客户端应继续发送请求的剩余部分（通常用于分块发送的请求）。
  
- **101 Switching Protocols**  
  服务器同意切换协议（如从 HTTP/1.1 切换到 WebSocket）。

---

 **2xx 成功**
表示请求已成功处理。

- **200 OK**  
  请求成功，通常用于 GET 和 POST 请求的响应。

- **201 Created**  
  请求成功且资源已被创建（通常用于 POST）。

- **202 Accepted**  
  请求已接受，但尚未处理（异步操作）。

- **204 No Content**  
  请求成功，但响应中不包含任何内容。

---

 **3xx 重定向**
表示需要进一步的操作以完成请求，通常与 URL 的变化相关。

- **301 Moved Permanently**  
  资源已被永久移动到新位置，客户端应使用新 URL 访问。

- **302 Found**  
  资源临时从不同的 URL 提供。

- **303 See Other**  
  应使用 GET 方法请求另一个 URI。

- **304 Not Modified**  
  资源未被修改，客户端可以使用缓存的副本。

- **307 Temporary Redirect**  
  临时重定向，要求请求方法保持不变。

---

**4xx 客户端错误**
表示客户端请求有问题。

- **400 Bad Request**  
  请求有误，服务器无法理解。

- **401 Unauthorized**  
  未授权，客户端需要提供身份验证信息。

- **403 Forbidden**  
  服务器拒绝请求，客户端没有权限访问资源。

- **404 Not Found**  
  资源未找到，服务器找不到客户端请求的资源。

- **405 Method Not Allowed**  
  请求方法不被支持（如使用了不允许的 HTTP 方法）。

- **409 Conflict**  
  请求与资源的当前状态冲突（如试图创建重复资源）。

- **413 Payload Too Large**  
  请求体过大，服务器无法处理。

- **429 Too Many Requests**  
  客户端发送的请求次数超出了限额（如 API 限流）。

---

**5xx 服务器错误**
表示服务器因自身问题无法完成请求。

- **500 Internal Server Error**  
  服务器遇到未知错误。

- **501 Not Implemented**  
  服务器不支持请求的功能。

- **502 Bad Gateway**  
  服务器作为网关或代理时，从上游服务器收到无效响应。

- **503 Service Unavailable**  
  服务器当前无法处理请求，可能是由于过载或维护。

- **504 Gateway Timeout**  
  服务器作为网关或代理时，上游服务器未及时响应。

- **505 HTTP Version Not Supported**  
  服务器不支持请求所使用的 HTTP 协议版本。
