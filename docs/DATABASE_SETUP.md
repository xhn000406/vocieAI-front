# 数据库初始化指南

## MongoDB 初始化

MongoDB 数据库会在应用启动时自动创建。确保 MongoDB 服务已启动，并在 `.env` 文件中配置了正确的连接字符串。

```bash
MONGODB_URI=mongodb://localhost:27017/biji
```

## MySQL 初始化

### 方法1: 使用 SQL 脚本（推荐）

1. 登录 MySQL：

```bash
mysql -u root -p
```

2. 执行初始化脚本：

```bash
mysql -u root -p < src/database/mysql/schema.sql
```

或者：

```bash
mysql -u root -p biji < src/database/mysql/schema.sql
```

### 方法2: 使用 Node.js 脚本

```bash
npm run init:db
```

（需要在 package.json 中添加脚本）

### 方法3: 手动执行

复制 `src/database/mysql/schema.sql` 中的 SQL 语句，在 MySQL 客户端中执行。

## 验证数据库

### MongoDB

```bash
# 连接到 MongoDB
mongo

# 切换到数据库
use biji

# 查看集合
show collections

# 查看用户集合
db.users.find().pretty()
```

### MySQL

```bash
# 连接到 MySQL
mysql -u root -p biji

# 查看所有表
SHOW TABLES;

# 查看表结构
DESCRIBE user_stats;
DESCRIBE meeting_stats;
```

## 数据库结构

### MongoDB 集合

- `users` - 用户表
- `meetings` - 会议表
- `tags` - 标签表
- `files` - 文件表
- `shares` - 分享表

### MySQL 表

- `user_stats` - 用户统计表
- `meeting_stats` - 会议统计表
- `system_logs` - 系统日志表
- `subscriptions` - 订阅记录表
- `api_calls` - API调用记录表
- `file_stats` - 文件统计表

## 索引说明

### MongoDB 索引

所有索引会在模型定义时自动创建。主要索引包括：

- `users.email`: 唯一索引
- `meetings.userId + createdAt`: 复合索引（降序）
- `meetings.shareToken`: 唯一索引

### MySQL 索引

所有索引在创建表时已定义。主要索引包括：

- `user_stats.user_id`: 唯一索引
- `meeting_stats.meeting_id`: 唯一索引
- `system_logs.user_id`: 普通索引
- `subscriptions.user_id`: 普通索引

## 数据迁移

如果需要迁移数据，可以使用 MongoDB 的 `mongodump` 和 `mongorestore` 工具，以及 MySQL 的 `mysqldump` 工具。

## 备份建议

1. **MongoDB**: 定期使用 `mongodump` 备份
2. **MySQL**: 定期使用 `mysqldump` 备份
3. **Redis**: 配置持久化（AOF + RDB）

