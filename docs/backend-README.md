# 后端服务

基于 Node.js + Express + TypeScript 的后端 API 服务。

## 技术栈

- **运行时**: Node.js 18+
- **框架**: Express
- **数据库**: MySQL
- **缓存**: Redis
- **实时通信**: Socket.io
- **文件存储**: MinIO / AWS S3
- **认证**: JWT + OAuth
- **监控**: Sentry + Winston

## 安装和运行

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

### 3. 初始化数据库

执行 SQL 脚本初始化数据库：

```bash
mysql -u root -p < src/database/mysql/schema.sql
```

或者使用 Node.js 脚本：

```bash
npm run init:db
```

### 4. 启动数据库服务

确保以下服务已启动：
- MySQL (默认端口 3306)
- Redis (默认端口 6379)
- MinIO (可选，默认端口 9000)

### 5. 运行项目

```bash
# 开发模式（热重载）
npm run dev

# 生产模式
npm run build
npm start
```

## API 文档

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `POST /api/auth/oauth/google` - Google OAuth 登录
- `POST /api/auth/oauth/apple` - Apple OAuth 登录
- `POST /api/auth/oauth/wechat` - 微信 OAuth 登录

### 用户相关

- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户信息

### 会议相关

- `GET /api/meetings` - 获取会议列表
- `GET /api/meetings/:id` - 获取单个会议（包含转写内容）
- `POST /api/meetings` - 创建会议
- `PUT /api/meetings/:id` - 更新会议
- `DELETE /api/meetings/:id` - 删除会议

### 转写相关

- `POST /api/transcripts/:meetingId` - 添加转写内容
- `PUT /api/transcripts/:meetingId/:transcriptId` - 更新转写内容

### 文件相关

- `POST /api/files/upload` - 上传文件
- `GET /api/files/:fileId` - 获取文件URL
- `DELETE /api/files/:fileId` - 删除文件

## Socket.io 事件

### 客户端发送

- `join-meeting` - 加入会议房间
- `leave-meeting` - 离开会议房间
- `transcript` - 发送转写内容
- `summary` - 发送AI总结

### 服务器发送

- `joined-meeting` - 成功加入会议
- `transcript-update` - 转写内容更新
- `summary-update` - AI总结更新
- `error` - 错误信息

## 项目结构

```
backend/
├── src/
│   ├── config/          # 配置文件
│   │   ├── mysql.ts     # MySQL 连接
│   │   ├── redis.ts     # Redis 连接
│   │   ├── sentry.ts    # Sentry 配置
│   │   └── logger.ts    # Winston 日志
│   ├── models/          # 数据模型（MySQL）
│   │   ├── User.ts      # 用户模型
│   │   ├── Meeting.ts   # 会议模型
│   │   ├── Transcript.ts # 转写模型
│   │   ├── Tag.ts       # 标签模型
│   │   ├── File.ts      # 文件模型
│   │   └── Share.ts     # 分享模型
│   ├── routes/          # 路由
│   │   ├── auth.ts      # 认证路由
│   │   ├── user.ts      # 用户路由
│   │   ├── meeting.ts   # 会议路由
│   │   ├── transcript.ts # 转写路由
│   │   └── file.ts      # 文件路由
│   ├── services/        # 业务逻辑
│   │   └── storage.ts   # 文件存储服务
│   ├── middleware/      # 中间件
│   │   ├── auth.ts      # 认证中间件
│   │   └── errorHandler.ts # 错误处理
│   ├── socket/          # Socket.io
│   │   └── index.ts     # Socket 处理
│   ├── database/        # 数据库相关
│   │   ├── mysql/       # MySQL 相关
│   │   │   ├── schema.sql # 数据库结构
│   │   │   └── models.ts  # 统计模型
│   │   └── init.ts      # 初始化脚本
│   └── server.ts        # 服务器入口
├── docs/                # 文档
│   ├── DATABASE_DESIGN.md # 数据库设计
│   └── DATABASE_SETUP.md  # 数据库初始化指南
├── .env.example         # 环境变量示例
├── package.json         # 依赖配置
└── tsconfig.json        # TypeScript 配置
```

## 数据库设计

项目使用 **MySQL** 作为唯一数据库，包含以下表：

- `users` - 用户表
- `meetings` - 会议表
- `transcripts` - 转写内容表
- `tags` - 标签表
- `files` - 文件表
- `shares` - 分享表
- `user_stats` - 用户统计表
- `meeting_stats` - 会议统计表
- `system_logs` - 系统日志表
- `subscriptions` - 订阅记录表
- `api_calls` - API调用记录表
- `file_stats` - 文件统计表

详细设计请查看 [docs/DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md)

## 开发计划

- [ ] 集成阿里云 NLS 流式 ASR
- [ ] 集成通义千问-Turbo 进行 AI 总结
- [ ] 实现 OAuth 登录（Google/Apple/微信）
- [ ] 实现会员订阅功能（RevenueCat）
- [ ] 实现 PDF/Markdown 导出
- [ ] 实现飞书/Notion/钉钉同步
