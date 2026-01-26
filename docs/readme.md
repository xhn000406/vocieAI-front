# 笔记 - AI实时语音转写应用

基于 React Native 和 Expo 打造的多端实时语音协同应用，支持会议、课堂等多人讨论环境的实时录音、AI转写和智能总结。

## 📁 项目结构

```
biji/
├── frontend/          # 前端项目（Expo + React Native）
│   ├── app/          # Expo Router 页面路由
│   ├── constants/    # 常量配置
│   ├── contexts/     # React Context
│   ├── types/        # TypeScript 类型定义
│   ├── utils/        # 工具函数
│   └── assets/       # 静态资源
│
├── backend/          # 后端服务（Node.js + Express）
│   ├── src/
│   │   ├── config/   # 配置文件（数据库、Redis等）
│   │   ├── models/   # 数据模型（MySQL）
│   │   ├── routes/   # API 路由
│   │   ├── services/ # 业务逻辑服务
│   │   ├── middleware/ # 中间件
│   │   ├── socket/   # Socket.io 实时通信
│   │   └── server.ts # 服务器入口
│   └── .env.example  # 环境变量示例
│
└── images/           # 设计稿图片
```

## 🛠 技术栈

### 前端
- **框架**: Expo SDK 51 + React Native 0.74
- **导航**: Expo Router
- **录音**: expo-av + expo-task-manager
- **存储**: AsyncStorage
- **UI**: React Native + Expo Linear Gradient

### 后端
- **运行时**: Node.js 18+
- **框架**: Express + TypeScript
- **数据库**: MySQL
- **缓存**: Redis
- **实时通信**: Socket.io
- **文件存储**: MinIO / AWS S3
- **认证**: JWT + OAuth (Google/Apple/微信)
- **监控**: Sentry + Winston

## 🚀 快速开始

> 📖 **完整启动流程请查看 [START_GUIDE.md](./START_GUIDE.md)**

### 前置要求

- Node.js 18+
- MySQL 8.0+
- Redis 6.0+
- MinIO（可选，用于文件存储）

### 快速启动步骤

1. **初始化数据库**
   ```bash
   mysql -u root -p < backend/src/database/mysql/schema.sql
   ```

2. **启动后端**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # 配置环境变量
   npm run dev
   ```

3. **启动前端**
   ```bash
   cd frontend
   npm install
   npm start
   ```

详细步骤和故障排查请查看 [START_GUIDE.md](./START_GUIDE.md)

## ✨ 功能特性

- ✅ **实时录音** - 高质量录音，支持后台运行
- ✅ **AI 实时转写** - 录音转文字，支持中文、英文、方言等
- ✅ **AI 实时总结** - 自动生成关键词、摘要和待办事项
- ✅ **多人识别** - 区分不同发言人（可选）
- ✅ **笔记输出** - 实时生成结构化笔记（时间线、关键词、摘要、待办）
- ✅ **导出分享** - 支持导出为 PDF、Markdown
- ✅ **历史记录** - 云端存储历史会议，支持搜索、标签
- ✅ **用户账户** - 支持云端同步、多端登录、会员订阅

## 📖 API 文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出

### 会议相关
- `GET /api/meetings` - 获取会议列表
- `GET /api/meetings/:id` - 获取单个会议
- `POST /api/meetings` - 创建会议
- `PUT /api/meetings/:id` - 更新会议
- `DELETE /api/meetings/:id` - 删除会议

详细 API 文档请查看 [backend/README.md](./backend/README.md)

## 🔧 开发计划

- [ ] 集成阿里云 NLS 流式 ASR
- [ ] 集成通义千问-Turbo 进行 AI 总结
- [ ] 实现 OAuth 登录（Google/Apple/微信）
- [ ] 实现会员订阅功能（RevenueCat）
- [ ] 实现 PDF/Markdown 导出功能
- [ ] 实现飞书/Notion/钉钉同步
- [ ] 实现多人识别功能

## 📝 更多文档

- [完整启动指南](./START_GUIDE.md) ⭐ **推荐先看这个**
- [打包和真机调试指南](./frontend/BUILD_GUIDE.md) 📱 **真机调试必看**
- [前端文档](./frontend/README.md)
- [后端文档](./backend/README.md)
- [项目结构说明](./PROJECT_STRUCTURE.md)
- [数据库设计](./backend/docs/DATABASE_DESIGN.md)

## 📄 许可证

MIT
