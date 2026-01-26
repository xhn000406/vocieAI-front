# 项目结构说明

## 目录结构

```
biji/
├── frontend/              # 前端项目（Expo + React Native）
│   ├── app/              # Expo Router 页面
│   ├── constants/        # 常量配置
│   ├── contexts/         # React Context
│   ├── types/            # TypeScript 类型
│   ├── utils/           # 工具函数
│   ├── assets/          # 静态资源
│   ├── package.json      # 前端依赖
│   ├── app.json          # Expo 配置
│   └── tsconfig.json     # TypeScript 配置
│
├── backend/              # 后端服务（Node.js + Express）
│   ├── src/
│   │   ├── config/       # 配置文件（数据库、Redis等）
│   │   ├── models/       # 数据模型（MongoDB）
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 业务逻辑服务
│   │   ├── middleware/   # 中间件
│   │   ├── socket/       # Socket.io 实时通信
│   │   └── server.ts     # 服务器入口
│   ├── package.json      # 后端依赖
│   ├── tsconfig.json     # TypeScript 配置
│   └── .env.example      # 环境变量示例
│
└── images/               # 设计稿图片
```

## 前端文件迁移

由于文件可能正在使用中，请手动将以下文件/文件夹移动到 `frontend/` 目录：

1. `app/` → `frontend/app/`
2. `constants/` → `frontend/constants/`
3. `contexts/` → `frontend/contexts/`
4. `types/` → `frontend/types/`
5. `utils/` → `frontend/utils/`
6. `assets/` → `frontend/assets/`
7. `app.json` → `frontend/app.json`
8. `package.json` → `frontend/package.json`（前端版本）
9. `tsconfig.json` → `frontend/tsconfig.json`
10. `babel.config.js` → `frontend/babel.config.js`
11. `expo-env.d.ts` → `frontend/expo-env.d.ts`

## 快速开始

### 1. 前端

```bash
cd frontend
npm install
npm start
```

### 2. 后端

```bash
cd backend
npm install
cp .env.example .env  # 编辑 .env 文件配置数据库等
npm run dev
```

## 环境要求

### 前端
- Node.js 18+
- Expo CLI

### 后端
- Node.js 18+
- MongoDB
- MySQL
- Redis
- MinIO（可选，用于文件存储）

