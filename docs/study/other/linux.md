---
layout: doc
---

## 1.linux 服务器指令记录

- `pwd` ---查看当前所在的目录
- `rm -f nginx-1.23.3.tar.gz` --- 删除单文件
- `rm -rf nginx-1.23.3/` --- 删除文件夹
- `echo "" > filename` ---清除文件内容而不删除文件 --- 用空字符串覆盖文件

## 2.服务器安装 nginx

##### 2.1 下载 nginx 安装包

先进入到想存放的文件目录，一般是存放到/usr/local 目录下

- 可以直接通过 wget 命令下载

  `wget -c https://nginx.org/download/nginx-1.23.3.tar.gz`

##### 2.2 配置 nginx 安装所需的环境

- 安装 PCRE pcre-deve

  > Nginx 的 Rewrite 模块和 HTTP 核心模块会使用到 PCRE 正则表达式语法。这里需要安装两个安装包 pcre 和 pcre-devel。第一个安装包提供编译版本的库，而第二个提供开发阶段的头文件和编译项目的源代码。安装指令如下：

  `yum install -y pcre pcre-devel`

- 安装 zlib

  > zlib 库提供了开发人员的压缩算法，在 Nginx 的各种模块中需要使用 gzip 压缩。安装指令如下:

  `yum install -y zlib zlib-devel`

- 安装 gcc

  > 安装 nginx 需要先将官网下载的源码进行编译，编译依赖 gcc 环境。安装指令如下：

  `yum install gcc-c++`

- 安装 Open SSL

  > nginx 不仅支持 http 协议，还支持 https（即在 ssl 协议上传输 http），如果使用了 https，需要安装 OpenSSL 库。安装指令如下:

  `yum install -y openssl openssl-devel`

##### 2.3 解压 nginx 压缩包

- 解压压缩包指令：

  `tar -zxvf nginx-1.23.3.tar.gz`

- 解压之后进入解压后的文件

  `cd nginx-1.23.3`

- 然后需要进行配置

  `./configure`

> 如果你需要使用 https 支持，则需要加上 SLL 模块，否则会出现如下报错
> `nginx: [emerg] the "ssl" parameter requires ngx_http_ssl_module in /usr/local/nginx/conf/nginx.conf:37`

> 配置指令 `./configure --with-http_ssl_module`

##### 2.4 编译安装 nginx

- 依次执行

  `make`
  `make install`

- 安装成功后，返回上级目录，然后进入新的 nginx 目录

  cd ..
  ls
  cd nginx
  ls

##### 2.5 启动 nginx

- 进入 nginx 下的 sbin 目录，输入./nginx 即可启动 nginx

  `./nginx`

- 关闭 nginx 服务

  `./nginx -s stop`

- 重启 nginx

  `./nginx -s reload`

- 查看 nginx 进程

  `ps aux|grep nginx`

- 在浏览器输入 IP,可看见 Welcome to nginx!即安装成功

  > Welcome to nginx!

##### 2.6 nginx 开启 gzip 压缩

```t
#开启gzip功能
gzip on;

#开启gzip静态压缩功能
gzip_static on;

#gzip缓存大小
gzip_buffers 4 16k;

#gzip http版本
gzip_http_version 1.1;

#gzip 压缩级别 1-10
gzip_comp_level 5;

#gzip 压缩类型
gzip_types text/plain application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;

# 是否在http header中添加Vary: Accept-Encoding，建议开启
gzip_vary on;

```

## 3.服务器安装 nodejs

##### 3.1 下载 nodejs

> 版本过高有可能会导致缺少文件

`wget https://nodejs.org/download/release/v16.15.0/node-v16.15.0-linux-x64.tar.x`

##### 3.2 解压

`tar xvf node-v16.15.0-linux-x64.tar.xz`

##### 3.3 验证是否安装成功

- 进入 /node-v16.15.0-linux-x64/bin/ 输入 `./node -v` 如果安装成功则会显示 v16.15.0

##### 3.4 配置环境变量

- 建立软连接，使其可以在全局被访问到：

  ln -s （自己存放 nodejs 的路径）+ nodejs/bin/node /usr/local/bin/
  ln -s （自己存放 nodejs 的路径）+ nodejs/bin/npm /usr/local/bin/

  例如：
  ln -s /usr/local/nodejs/bin/node /usr/local/bin/
  ln -s /usr/local/nodejs/bin/npm /usr/local/bin/

##### 3.5 检查是否配置成功

- 退出到根目录 输入 `node -v` 和 `npm -v` 验证

## 4.访问静态资源

::: tip
前提就是先装 nginx
:::

##### 4.1 方法一 (root 配置)

在 nginx.conf 中

```
location /images {
    root   /usr/local/nginx/static;
    autoindex on;
}
```

- 在浏览器的访问地址为
  `localhost/images` -> `/usr/local/nginx/static/images/`

##### 4.2 方法二 (alias 配置)

在 nginx.conf 中

```
location /images {
    alias   static/images;
    autoindex on;
}
```

- 在浏览器的访问地址为
  `localhost/images` -> `/usr/local/nginx/static/images/`

##### 4.3 两者的区别

- root 的处理结果：root 路径＋ location 路径
- alias 的处理结果：使用 alias 路径替换 location 路径
