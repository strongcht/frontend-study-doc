---
layout: doc
---

## 服务器安装 mysql

#### 1. 下载 mysql 安装包

> 在腾讯云服务器中安装 mysql 8.0

- 可通过官网下载[mysql](https://downloads.mysql.com/archives/community/) 也可以直接通过 wget 命令下载

  `wget  http://dev.mysql.com/get/mysql80-community-release-el7-7.noarch.rpm`

#### 2. 安装

1. rpm 安装源信息

`rpm -ivh mysql80-community-release-el7-7.noarch.rpm`

2. 使用 yum 安装 MySQL

`yum install mysql-community-server`

安装过程中，会提示让我们确认，一律输入 `y` 按回车即可

安装完成后，`yum` 会自动覆盖自带的 `mariaDB`，所以不需要我们手动卸载它

#### 3. 检查是否安装成功

1. 检查一下刚才的安装是否成功

`rpm -qa | grep mysql`

输出

```
  mysql-community-libs-compat-8.0.33-1.el7.x86_64
  mysql-community-icu-data-files-8.0.33-1.el7.x86_64
  mysql80-community-release-el7-7.noarch
  mysql-community-common-8.0.33-1.el7.x86_64
  mysql-community-libs-8.0.33-1.el7.x86_64
  mysql-community-server-8.0.33-1.el7.x86_64
  mysql-community-client-8.0.33-1.el7.x86_64
  mysql-community-client-plugins-8.0.33-1.el7.x86_64
```

输出类似以上内容，表示安装完成

2. 检查 mariaDB 是否被覆盖

`rpm -qa | grep mariadb`

输出空，表示 mariaDB 已经被成功覆盖。

#### 4. 登录和修改密码

我们安装的时候，并没有设置初始密码

所以 mysql 在第一次启动的时候，会自动初始化一个密码

通过以下这行代码，我们可以查看 mysql 自动初始化的密码：

```sh
# 第一次启动后，可以查看mysql初始化密码
grep 'temporary password' /var/log/mysqld.log

输出（root@localhost: 后面的是密码）：
2023-04-21T06:03:27.071550Z 6 [Note] [MY-010454] [Server] A temporary password
is generated for root@localhost: r2to%yZ%a)%s

```

1. 登录

```sh
# 登录mysql，一定要注意：-p和'密码'之间是没有空格的
mysql -u root -p'r2to%yZ%a)%s'
```

2. 修改 root 密码
   注意了，默认的密码策略，需要：大写英文 + 特殊字符 + 数字

```sh
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root_123';
```

#### 5. 端口开放

必须在腾讯云控制台 - 服务器 - 防火墙，添加 mysql3306 端口。

#### 6. 开放 root 账户远程登录

```sh
# 登录
mysql -u root -p'密码'

# 如果你的数据库是 mysql 8 及以上
# 1、进入数据库
use mysql
# 2、修改user表
update user set host='%' where user='root';


# 重载授权表
FLUSH PRIVILEGES;

# 退出
exit

# 重启
systemctl restart mysqld

```

##### 7. 在连接服务器中的 mysql 数据库可能存的问题

- 问题：`2059 - Authentication plugin“caching_sha2_password” cannot be loaded:'****`

- 解决方案：
  > 使用 root 用户新建一个用户

```sh
# 1、进入数据库
use mysql;

# 2、创建用户
CREATE USER 'abc'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Abcd_123';

# 3、修改user表并分配权限
update user set host='%' where user='cht';

GRANT ALL PRIVILEGES ON *.* TO 'cht'@'%';

# 4、重载授权表
FLUSH PRIVILEGES;

# 5、退出
exit

# 6、重启
systemctl restart mysqld

```

在使用远程工具连接数据库就可以了

## 常用 mysql 指令

```sh
# 启动
systemctl start mysqld

# 第一次启动后，可以查看mysql初始化密码
grep 'temporary password' /var/log/mysqld.log

# 重启
systemctl restart mysqld

# 停止
systemctl stop mysqld

#查看状态
systemctl status mysqld

#开机启动
systemctl enable mysqld
systemctl daemon-reload

# 查看进程、版本信息
ps -ef | grep mysql
或
netstat -atp

# 登录
mysql -u root -p'密码内容'

# 查看所有表
show databases;

# 进入数据库
use 表名

# 查看所有表
show tables

# 查看某张表信息
desc 表名

# 新建表
CREATE TABLE `online_car_data` (
  `id` INT AUTO_INCREMENT,
  `quarter` varchar(255) DEFAULT NULL,
  `platform` varchar(255) DEFAULT NULL,
  `active_vehicles` int(11) DEFAULT NULL,
  `operating_vehicles` int(11) DEFAULT NULL,
  `waiting_time` BIGINT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 查
select * from 表名

#插入
INSERT INTO `online_car_data` (`id`, `quarter`, `platform`, `active_vehicles`, `operating_vehicles`,`waiting_time`) VALUES
('1f5d7a5c-9aa3-4f80-bcee-e00f16dd1e6b', '202301', 'AAAAA', 32, 1121, 0),
('2ed376e1-f8cc-4ff2-a12d-7be207dbd8b6', '202301', 'BBBBB', 227, 744, 761127),
('3f3e3075-f470-4a7e-92cd-8da69b85ee51', '202301', 'CCCCCC', 24729, 47021, 043249);

# 删
delete from 表名 where field=xx
# 改
update 表名 set field='xxx' where field='xxx';

```
