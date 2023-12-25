
# 一、Nginx 简介
### **1.什么是 Nginx?**
**Nginx (engine x)** 是一个高性能的HTTP和反向代理web服务器，同时也提供了IMAP/POP3/SMTP服务。Nginx是由伊戈尔·赛索耶夫为俄罗斯访问量第二的Rambler.ru站点（俄文：Рамблер）开发的，第一个公开版本0.1.0发布于2004年10月4日。2011年6月1日，nginx 1.0.4发布。

其特点是占有内存少，并发能力强，事实上nginx的并发能力在同类型的网页服务器中表现较好，中国大陆使用nginx网站用户有：百度、京东、新浪、网易、腾讯、淘宝等。在全球活跃的网站中有12.18%的使用比率，大约为2220万个网站。![nginx.jpg](https://cdn.nlark.com/yuque/0/2023/jpeg/2989840/1701852098460-5a01d2c1-4495-4102-b559-1233d4b3825f.jpeg#averageHue=%23e0dfdc&clientId=u493019fd-cddb-4&from=drop&id=u6cc46f85&originHeight=359&originWidth=638&originalType=binary&ratio=2&rotation=0&showTitle=false&size=91427&status=done&style=none&taskId=u26fa7265-48e0-4c7c-864e-f4cdc974cfe&title=)
### 2.什么是正向、反向代理？

- 正向代理：指的是通过代理服务器 代理浏览器/客户端去重定向请求访问到目标服务器 的一种代理服务。

![20210716102811126.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701919346116-de80f090-55b0-4140-a887-5c9dbc2b3e14.png#averageHue=%23f8f8f8&clientId=u7727dd7b-1a11-4&from=drop&id=oNXVi&originHeight=358&originWidth=588&originalType=binary&ratio=2&rotation=0&showTitle=false&size=44171&status=done&style=stroke&taskId=uc21a48ee-329a-4897-a91e-5b77bcb3eab&title=)

- 反向代理（Reverse Proxy）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

![20210716102821223.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701919378296-7ae977e6-eb33-454d-83f4-0c8fa3355be5.png#averageHue=%23f8f8f8&clientId=u7727dd7b-1a11-4&from=drop&id=LTpBW&originHeight=384&originWidth=614&originalType=binary&ratio=2&rotation=0&showTitle=false&size=44244&status=done&style=stroke&taskId=u4f39f8bc-1602-4156-be9f-cdaa9602c07&title=)
###  3.安装教程
[安装教程](https://github.com/dunwu/nginx-tutorial/blob/master/docs/nginx-ops.md)
### 4.常用到的命令如下
```nginx
whereis nginx        查找nginx的位置
nginx -s stop       快速关闭Nginx，可能不保存相关信息，并迅速终止web服务。
nginx -s quit       平稳关闭Nginx，保存相关信息，有安排的结束web服务。
nginx -s reload     因改变了Nginx相关配置，需要重新加载配置而重载。
nginx -c filename   为 Nginx 指定一个配置文件，来代替缺省的。
nginx -t            不运行，仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件。
nginx -v            显示 nginx 的版本。
nginx -V            显示 nginx 的版本，编译器版本和配置参数。
ps -ax | grep nginx 获取正在运行的nginx 进程列表
kill -s quit 1628(主进程id) 让nginx平滑关闭  
```

# 二、Nginx 的基本使用
### 1.nginx的配置文件结构
Nginx的主配置文件是nginx.conf，这个配置文件一共由三部分组成，分别为**全局块、events块和http块**。在http块中，又包含http全局块、多个server块。每个server块中，可以包含server全局块和多个location块。在同一配置块中嵌套的配置块，各个之间不存在次序关系。
备注： #开头注释  `# 注释`
分号结尾；
简单指令 `名称 参数;`
```nginx
#全局块
worker_processes  1;  #进程数-指定1个工作线程，这种情况下会生成一个master进程和1个worker进程
error_log  /var/log/nginx/error.log warn; #错误日志的存放地址
#event块
events {
  worker_connections  1024; #每一个worker process同时开启的最大连接数
}

#http块
http {
  #http全局块
  include       mime.types;
  default_type  application/octet-stream;
  sendfile        on;
  keepalive_timeout  65;
  #server块-每个server相当于一台虚拟主机
  server {
    #server全局块
    listen       8000;
    server_name  localhost;
    #location块-基于nginx服务器接收到的请求字符串,对除虚拟主机名之外的字符串进行匹配,
    #对特定的请求进行处理
    location / {
      root   html;
      index  index.html index.htm;
    }
    location /api {
      proxy_pass http://webhost;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   html;
    }
  }
  #这边可以有多个server块
  server {
    ...
  }
}
```


### 2.静态内容的服务
它可以快速且高效地托管网站的静态资源，如HTML文件、图片、CSS和JavaScript文件。这是由于Nginx的事件驱动架构，使其在处理大量并发连接时非常高效。
#### 2.1 访问静态资源
[http://1.12.234.248/demo1](http://1.12.234.248/demo1)
[http://1.12.234.248/images/baidu.png](http://1.12.234.248/images/baidu.png)

- 前端打包后的代码
```nginx

location / {
  root   html; #根路径-它指的是nginx根目录下的html;后面可以加 / 也可以不加
  #root /usr/loacl/nginx/html 绝对路径
  index  index.html index.htm;
}

location /demo1/ {
    root   html;
    index  index.html index.htm;
}


# 例 http://1.12.234.248/images/baidu.png
location /images {
  root static; #将 /images 拼接在 static/后面
}

location /images {
  alias static/images/; #将 /images 替换 static/images/
}
```

#### 2.2 静态文件缓存
| 缓存机制 | 含义 | 配置方式 | 描述 |
| --- | --- | --- | --- |
| 强缓存 | 浏览器不与服务端协商直接取浏览器缓存 | http 1.0 版本 `expires 1d`；
http 1.1 版本 add_header Cache-Control `max-age=86400`; | 资源可以被缓存的最大时间，单位：秒，是一个相对时间，优先级高于 Expires |
| 协商缓存 | 浏览器会先向服务器确认资源的有效性后才决定是从缓存中取资源还是重新获取资源 | add_header Cache-Control `no-cache`; | 禁止强缓存，启用协商缓存 |
| 无缓存 | 浏览器直接向服务器重新获取资源 | add_header Cache-Control `no-store`; | 禁止缓存，客户端不存储任何值 |

[http://1.12.234.248/images/baidu.png](http://1.12.234.248/images/baidu.png)
```nginx
# 强缓存1
location /images {
  root  static;
  add_header Cache-Control max-age=86400;
}
# 强缓存2
location /images {
  root  static;
  expires 1d;
  add_header Cache-Control max-age=86400;
}
# 协商缓存
location /images {
  root  static;
  add_header Cache-Control no-cache;
}

# 禁止缓存
location /images {
  root  static;
  add_header Cache-Control no-store;
}


# 对html文件不缓存     
location ~* \.(html)$ {
    add_header  Cache-Control  no-store;
}
      
# 对其他静态文件强制缓存
location ~* \.(css|js|png|jpg|jpeg|gif|gz|svg|mp4|ogg|ogv|webm|htc|xml|woff)$ {
  add_header Cache-Control max-age=604800;
}
```

**强制缓存**:
`cache-control`的优先级高于`expires`，`expires`是http1.0的产物，而`cache-control`是http1.1的产物，两者同时存在的时候`expire`会被`cache-control`的`max-age`覆盖，在不支持http1.1的情况下可能就需要`expires`来保持兼容。

**协商缓存**: 
主要依赖的响应头包括`Last-Modified`和`ETag`，需要和服务器交互，请求资源命中协商缓存后，返回的状态码为 304。
**Last-Modified**：记录资源最后修改的时间。
**ETag**：基于资源的内容编码生成一串唯一的标识字符串, 只要内容不同, 就会生成不同的ETag。
但Last-Modified有以下两个缺点：

- 只要编辑了，不管内容是否真的有改变，都会以这最后修改的时间作为判断依据，当成新资源返回，从而导致了没必要的请求相应，而这正是缓存本来的作用即避免没必要的请求。
- 时间的精确度只能到秒，如果在一秒内的修改是检测不到更新的，仍会告知浏览器使用旧的缓存。

ETag的出现就是为了解决last-modified的上述问题。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701930385364-d9aae6d3-cf87-4bad-83dd-3e66ee8205dc.png#averageHue=%23fefbf9&clientId=u14f36c1e-9695-4&from=paste&height=600&id=u3c877f49&originHeight=600&originWidth=898&originalType=binary&ratio=1&rotation=0&showTitle=false&size=49297&status=done&style=stroke&taskId=uf955e896-d2b8-41c3-b35c-99f6c455e43&title=&width=898)

> 注： chrome 默认缓存机制 -对html不缓存，对其他的 js/css/png 强制缓存+协商缓存
> Chrome和Firefox对js、css之类的文件，在内存中的缓存时长，是：
> `（访问时间 - 该文件的最后修改时间） ÷ 10`
> 
> 假设文件 a.js 最后编辑时间是 2023年12月1号 `10点0分0秒`；
> Chrome的第一次访问时间是 2023年12月1号 `12点0分0秒`；
> 第一次访问与文件编辑时间相差2小时，即7200秒，那么缓存时长就是720秒
> 即结论如下：
> 1、在 2023年12月1号 12点0分1秒到 12点11分59秒，这12分钟内，浏览器不会发起http请求  **--强制缓存；**
> 2、在 2023年12月1号 12点12分0秒，会发起带 If-Modified-Since 的http请求  **-- 协商缓存**
> 3、如果希望浏览器每次都发起http请求，在Server返回Header Cache-Control: no-cache
> 参考：[https://blog.csdn.net/youbl/article/details/84879670](https://blog.csdn.net/youbl/article/details/84879670)


#### 2.3 gzip压缩 -减少静态资源请求响应时间
使资源体积更小
服务端配置，如nginx可配置支持gzip压缩资源传输的方式
如果浏览器支持gzip解析，服务器就会推送gzip的资源，在http的相应头里可以看到显示Content-Encoding:gzip

- 如果浏览器支持gzip解析

![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701929889210-0704d1c9-3ce8-4640-8d11-e6e7c8c1ac1e.png#averageHue=%23fef8f6&clientId=u5cb4ca85-a188-4&from=paste&height=270&id=u68a7f806&originHeight=270&originWidth=476&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15846&status=done&style=none&taskId=u0dba6017-634f-46bb-a195-5659d5096b5&title=&width=476)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701929963703-faf7091c-e52c-4f7c-900d-1789557369ff.png#averageHue=%23fefaf9&clientId=u5cb4ca85-a188-4&from=paste&height=323&id=uba07a5a2&originHeight=323&originWidth=741&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26710&status=done&style=none&taskId=u18aa71fe-5b06-4489-8f9c-e718b48ce01&title=&width=741)
```nginx
# 默认off，是否开启gzip
gzip on;
# Nginx的动态压缩是对每个请求先压缩再输出，这样造成虚拟机浪费了很多cpu，解决这个问题可以利用nginx模块Gzip Precompression，这个模块的作用是对于需要压缩的文件，直接读取已经压缩好的文件(文件名为加.gz)，而不是动态压缩，对于不支持gzip的请求则读取原文件
gzip_static on; # 需要安装 http_gzip_static_module 模块才可配置
# 要采用 gzip 压缩的 MIME 文件类型，其中 text/html 被系统强制启用；
gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

# ---- 以上两个参数开启就可以支持Gzip压缩了 ----

# 默认 off，nginx做为反向代理时启用，用于设置启用或禁用从代理服务器上收到相应内容 gzip 压缩；
gzip_proxied any;

# 用于在响应消息头中添加 Vary：Accept-Encoding，使代理服务器根据请求头中的 Accept-Encoding 识别是否启用 gzip 压缩；
gzip_vary on;

# gzip 压缩比，压缩级别是 1-9，1 压缩级别最低，9 最高，级别越高压缩率越大，压缩时间越长，建议 4-6；
gzip_comp_level 2;

# 获取多少内存用于缓存压缩结果，16 8k 表示以 8k*16 为单位获得；
gzip_buffers 16 8k;

# 允许压缩的页面最小字节数，页面字节数从header头中的 Content-Length 中进行获取。默认值是 0，不管页面多大都压缩。建议设置成大于 1k 的字节数，小于 1k 可能会越压越大；
gzip_min_length 1k;

# 默认 1.1，启用 gzip 所需的 HTTP 最低版本；
gzip_http_version 1.1;
```

1. 未开启gzip `gzip off; gzip_static off;`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701918099634-791900f0-a952-4623-91b4-5d23cf17f669.png#averageHue=%23cde3cf&clientId=u7727dd7b-1a11-4&from=paste&height=135&id=ua10b3579&originHeight=270&originWidth=865&originalType=binary&ratio=2&rotation=0&showTitle=false&size=86994&status=done&style=none&taskId=ud1c91c51-6471-4150-ab1b-f3f13abe9da&title=&width=432.5)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701919089256-db67edb3-b761-46f2-8eaa-436ce3b08e82.png#averageHue=%23fdfefd&clientId=u7727dd7b-1a11-4&from=paste&height=79&id=u3d77f6ee&originHeight=80&originWidth=723&originalType=binary&ratio=2&rotation=0&showTitle=false&size=15287&status=done&style=stroke&taskId=ubc27e9d4-dc89-4e3a-a29c-c8426e9584c&title=&width=716.5)、

2. 仅开启gzip_static 静态压缩（读取提供的.gz文件） `gzip off;gzip_static on;`

![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701918189754-ddc0db57-538d-46f8-a705-24fbb91bf9c0.png#averageHue=%23b1d8ba&clientId=u7727dd7b-1a11-4&from=paste&height=134&id=u7b59002b&originHeight=267&originWidth=865&originalType=binary&ratio=2&rotation=0&showTitle=false&size=84974&status=done&style=none&taskId=u298b1f91-1e81-4fce-adfc-533fc243867&title=&width=432.5)![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701918614719-a4166132-17d1-4560-87fd-af4299bab93f.png#averageHue=%23fefefe&clientId=u7727dd7b-1a11-4&from=paste&height=40&id=u8264919c&originHeight=38&originWidth=702&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6825&status=done&style=stroke&taskId=ub9a8d424-473a-45bb-ad96-fdbb61afe9c&title=&width=739)

3. 仅开启动态压缩 gzip on; gzip_static off;

![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701918807866-5b53164c-d2e7-4702-aee6-519666636f5b.png#averageHue=%23cee6d2&clientId=u7727dd7b-1a11-4&from=paste&height=133&id=uc37216b1&originHeight=265&originWidth=865&originalType=binary&ratio=2&rotation=0&showTitle=false&size=81841&status=done&style=stroke&taskId=ud5dfbac4-18f3-4928-bc1c-18f901bedf6&title=&width=432.5)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701919055477-6750b45a-5a3a-4096-9896-c47f3869185c.png#averageHue=%23eaebea&clientId=u7727dd7b-1a11-4&from=paste&height=79&id=u5acb6dbb&originHeight=71&originWidth=703&originalType=binary&ratio=2&rotation=0&showTitle=false&size=14120&status=done&style=stroke&taskId=u6e4f171a-0e06-4f98-af3e-eb583629f29&title=&width=778.5)

4. 开启gzip动态压缩和gzip_static静态压缩 gzip on; gzip_static on;

![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701918196797-915d3c9c-91be-4673-a3ad-b92d35345977.png#averageHue=%23c5dfc7&clientId=u7727dd7b-1a11-4&from=paste&height=133&id=u49963fb2&originHeight=265&originWidth=865&originalType=binary&ratio=2&rotation=0&showTitle=false&size=83207&status=done&style=none&taskId=u27503097-b39d-40d3-8d85-acf503a15b8&title=&width=432.5)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1701918614719-a4166132-17d1-4560-87fd-af4299bab93f.png#averageHue=%23fefefe&clientId=u7727dd7b-1a11-4&from=paste&height=40&id=KOWmx&originHeight=38&originWidth=702&originalType=binary&ratio=2&rotation=0&showTitle=false&size=6825&status=done&style=stroke&taskId=ub9a8d424-473a-45bb-ad96-fdbb61afe9c&title=&width=739)

public中的静态js、css
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1702264454790-f38659fe-e160-44f3-8447-4e0b08fb2405.png#averageHue=%23faf8f6&clientId=u4237e764-60c6-4&from=paste&height=271&id=u4aa8316f&originHeight=271&originWidth=533&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22929&status=done&style=none&taskId=ue0784fb2-3a96-433e-834c-c1cb1bf9a7c&title=&width=533)
开启gzip
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1702264505172-7cf580a9-317c-44d0-b523-7bb282983238.png#averageHue=%23cbdec7&clientId=u4237e764-60c6-4&from=paste&height=188&id=ub56b5ca7&originHeight=188&originWidth=671&originalType=binary&ratio=1&rotation=0&showTitle=false&size=22123&status=done&style=none&taskId=u2f5539c8-2786-41aa-abbf-eec469fb0f0&title=&width=671)
未开启gzip
![image.png](https://cdn.nlark.com/yuque/0/2023/png/2989840/1702264632131-23e2b43c-48b4-4c15-96d6-87decde135ee.png#averageHue=%23e8f2c7&clientId=u4237e764-60c6-4&from=paste&height=215&id=u55fdb0c0&originHeight=215&originWidth=680&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26856&status=done&style=none&taskId=u90eafe1f-5e16-4610-b9ae-ffa64d409c5&title=&width=680)
### 3. 反向代理
#### 3.1 location 优先级
当一个路径匹配多个location时究竟哪个location能匹配到时有优先级顺序的，而优先级的顺序于location值的表达式类型有关，和在配置文件中的先后顺序无关。相同类型的表达式，字符串长的会优先匹配。

| 优先级 | location表达式 | 匹配说明 |
| --- | --- | --- |
| 1 | 等号类型（=） | `location = /static/img/logo.jpg{ }` 匹配成功不在往下继续匹配 |
| 2 | 普通字符匹配（^~） | `location ^~ /static/img/ { }`匹配所有以 /static/img开头的表达式，如果匹配成功，则停止匹配查找，停止搜索 |
| 3 | 正则表达式类型:
（~ ）区分大小写
（~*）不区分大小写 | 多正则匹配命中则 匹配最上面的规则
`location ~* \\.(gif&#124;jpg&#124;jpeg&#124;png)$ {}` 匹配所有以gif、jpg结尾的请求
`location ~ /img/ {}` 路径中包含`img`
`location ~* /IMG/ {}`路径中包含`img或IMG等` |
| 4 | 字符串匹配类型 | `location /static/ {}`
`location /static/img/ {}` |
| 5 | 通用匹配 ( / ) | `location / {}` 如果没有其它匹配,任何请求都会匹配到 |

以该请求为例：http://localhost/static/img/logo.jpg 
```nginx
#路径名等于 /static/img/logo.jpg
location = /static/img/logo.jpg {

}
#路径以/static/img/开头
location ^~ /static/img/ {

}
# 以gif jpg jpeg png 结束的路径
location ~ \.(gif|jpg|jpeg|png)$ {
  
}
#路径包含/static/不区分大小写
location ~* /static/ {

}
# 路径以/static/开头
location /static/ {

}
# 路径以/static/img/开头
location /static/img/ {
  
}
#兜底如果没有其它匹配,任何请求都会匹配到
location / {
  
}


```

#### 3.2 proxy_pass
```nginx
location /api {
    proxy_pass http://webhost;
    #  proxy_redirect off;
    proxy_set_header X-Real-IP $remote_addr; #用户客户端ip
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # 多层转发 携带上每一层转发的ip
    proxy_set_header Host $host; #请求的host 如：http://www.baidu.com/images/a.png  www.baidu.com
    #  client_max_body_size 10m; #允许客户端请求的最大单文件字节数
    #  client_body_buffer_size 128k; #缓冲区代理缓冲用户端请求的最大字节数,
    #  proxy_connect_timeout 90; #nginx跟后端服务器连接超时时间(代理连接超时)
    #  proxy_send_timeout 90; #后端服务器数据回传时间(代理发送超时)
    #  proxy_read_timeout 90; #连接成功后,后端服务器响应时间(代理接收超时)
    #  proxy_buffer_size 4k; #设置代理服务器（nginx）保存用户头信息的缓冲区大小
    #  proxy_buffers 4 32k; #proxy_buffers缓冲区,网页平均在32k以下的设置
    #  proxy_busy_buffers_size 64k; #高负荷下缓冲大小（proxy_buffers*2）
    #  proxy_temp_file_write_size 64k;
  }
```

### 4.负载均衡
[http://1.12.234.248:8082/](http://1.12.234.248:8082/)
Nginx的负载均衡就是为了处理服务器端和客户端之间的请求，为最大程度地提高响应速率和容量利用率，同时确保任何服务器都没有超负荷工作的一种策略。如果单个服务器出现故障，负载均衡的方法会将流量重定向到其余的集群服务器，以保证服务的稳定性。
就是：把大量的请求按照我们指定的方式均衡的分配给集群中的每台服务器，从而不会产生集群中大量请求只请求某一台服务器，从而使该服务器宕机的情况
#### 4.1 语法：`upstream name { server address [parameters] }`
`parameters` 可选值：

- `weight=number` 权重值，默认为1；
- `max_conns=number` 上游服务器的最大并发连接数；
- `fail_timeout=time` 服务器不可用的判定时间；
- `max_fails=numer` 服务器不可用的检查次数；
- `backup` 备份服务器，仅当其他服务器都不可用时才会启用；
- `down` 标记服务器长期不可用，离线维护；
```nginx
# 反向代理配置
upstream server_list{
  server 1.12.234.248:80;
  server 139.199.191.212:8082;
  server 139.199.191.212:8083 backup;
}

server {
  listen       8082;
  server_name  localhost;

  location / {
      root   html/demo;
      proxy_pass http://server_list;
      index  index.html index.htm;
  }

  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
      root   html;
  }
}
```

#### 4.2 负载均衡策略
（1）轮询策略（默认）：将所有客户端请求轮询分配给服务端。这种策略是可以正常工作的，但是如果其中某一台服务器压力太大，出现延迟，会影响所有分配在这台服务器下的用户。
```nginx
upstream server_list {
  server 1.12.234.248:80;
  server 139.199.191.212:8082;
}
```

（2）权重策略：在轮询策略的基础上指定轮询的几率
```nginx
upstream server_list {
  server 1.12.234.248:80 weight=1;
  server 139.199.191.212:8082 weight=3;
}
```
（3）最少连接策略：把请求转发给连接数较少的后端服务器。轮询算法是把请求平均的转发给各个后端，使它们的负载大致相同；但是，有些请求占用的时间很长，会导致其所在的后端负载较高。这种情况下，least_conn这种方式就可以达到更好的负载均衡效果，适合请求处理时间长短不一造成服务器过载的情况。
```nginx
upstream server_list {
  least_conn; 
  server 1.12.234.248:80;
  server 139.199.191.212:8082;
}
```
（4）客户端 `ip` 绑定策略：来自同一个 `ip` 的请求永远只分配一台服务器，有效解决了动态网页存在的 `session` 共享问题。
```nginx
upstream server_list {
  ip_hash;
  server 1.12.234.248:80;
  server 139.199.191.212:8082;
}
```

### 5.配置https
首先配置支持 HTTPS 必须让 Nginx 开启 `http_ssl_module` 模块 ，可以使用`nginx -V`查看是否开启`TLS SNI support enabled`。

购买/生成 SSL 证书，可以使用免费的证书，比如：[Let's Encrypt，免费好用的 HTTPS 证书](https://imququ.com/post/letsencrypt-certificate.html) 。

```nginx
# 配置 HTTPS

# 配置个http的站点，用来做重定向，当然如果你不需要把 HTTP->HTTPS 可以把这个配置删了
server {
    listen       80;

    # 配置域名
    server_name www.xxoo.com xxoo.com;

    # 添加 STS, 并让所有子域支持, 开启需慎重
    add_header strict-transport-security 'max-age=31536000; includeSubDomains; preload';

    # 配置让这些 HTTP 的访问全部 301 重定向到 HTTPS 的
    rewrite ^(.*) https://www.xxoo.com$1 permanent;
}

# 配置 HTTPS
server {
    # 配置域名
    server_name www.xxoo.com xxoo.com;

    # https默认端口
    listen 443;

    # 添加STS, 并让所有子域支持, 开启需慎重
    add_header strict-transport-security 'max-age=31536000; includeSubDomains; preload';

    # https配置
    ssl on;
    ssl_certificate /xxoo/www.xxoo.com.crt;
    ssl_certificate_key /xxoo/www.xxoo.com.key;

    # 其他按正常配置处理即可...
}
```

> 注意，这里证书的格式是 `.crt` 的。


#### 5.1配置后的访问规则
| 输入链接 | 最终访问链接 |
| --- | --- |
| [http://www.xxoo.com](http://www.xxoo.com) | [https://www.xxoo.com](https://www.xxoo.com) |
| [http://www.xxoo.com/404/500](http://www.xxoo.com/404/500) | [https://www.xxoo.com/404/500](https://www.xxoo.com/404/500) |
| [http://xxoo.com](http://xxoo.com) | [https://www.xxoo.com](https://www.xxoo.com) |
| [https://www.xxoo.com](https://www.xxoo.com) | -（原链接不变） |
| [https://xxoo.com/500](https://xxoo.com/500) | [https://www.xxoo.com/500](https://www.xxoo.com/500) |




