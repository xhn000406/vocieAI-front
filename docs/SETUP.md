# 项目搭建说明

> 📖 **详细启动流程请查看 [START_GUIDE.md](./START_GUIDE.md)**

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 准备资源文件

在 `assets/` 目录下放置以下图片资源：

- `icon.png` - 应用图标 (1024x1024)
- `splash.png` - 启动页图片 (1242x2436)
- `adaptive-icon.png` - Android 自适应图标 (1024x1024)
- `favicon.png` - Web 图标 (48x48)
- `notification-icon.png` - 通知图标 (96x96)

### 3. 运行项目

```bash
# 启动开发服务器
npm start

# 在 iOS 模拟器中运行
npm run ios

# 在 Android 模拟器中运行
npm run android

# 在 Web 浏览器中运行
npm run web
```

## 项目结构说明

```
biji/
├── app/                      # Expo Router 页面目录
│   ├── (tabs)/              # 底部导航标签页
│   │   ├── _layout.tsx     # 标签导航配置
│   │   ├── home.tsx        # 主页
│   │   ├── history.tsx     # 历史记录页
│   │   └── profile.tsx     # 我的页面
│   ├── meeting-detail/      # 会议详情页（动态路由）
│   │   └── [id].tsx
│   ├── _layout.tsx         # 根布局配置
│   ├── index.tsx           # 启动页/入口页
│   ├── onboarding.tsx      # 欢迎引导页
│   ├── auth.tsx            # 登录注册页
│   └── recording.tsx       # 录音页
├── constants/              # 常量配置
│   ├── Colors.ts           # 颜色主题配置
│   └── Theme.ts            # 主题样式配置
├── contexts/               # React Context
│   ├── ThemeContext.tsx    # 主题上下文
│   └── AuthContext.tsx     # 认证上下文
├── types/                  # TypeScript 类型定义
│   └── index.ts
├── utils/                  # 工具函数
│   ├── storage.ts          # 本地存储工具
│   └── format.ts           # 格式化工具
├── assets/                 # 静态资源
├── images/                 # 设计稿图片
├── app.json                # Expo 配置文件
├── package.json            # 项目依赖配置
├── tsconfig.json           # TypeScript 配置
└── babel.config.js         # Babel 配置
```

## 功能说明

### 已实现功能

✅ 启动页和欢迎引导页
✅ 用户登录注册（模拟）
✅ 主页 - 显示最近会议和快速开始
✅ 录音页 - 实时录音和转写显示
✅ 会议详情页 - 查看完整会议记录
✅ 历史记录页 - 按日期分组显示
✅ 我的页面 - 用户信息和设置
✅ 主题切换（浅色/深色模式）
✅ 本地存储（AsyncStorage）

### 待实现功能

- [ ] 集成阿里云 NLS 流式 ASR（实际语音转写）
- [ ] 集成通义千问-Turbo（AI 总结）
- [ ] Socket.io 实时通信
- [ ] 后端 API 集成
- [ ] PDF/Markdown 导出功能
- [ ] 飞书/Notion/钉钉同步
- [ ] 会员订阅功能（RevenueCat）
- [ ] 多人识别功能
- [ ] 音频播放功能

## 注意事项

1. **录音权限**: 首次使用录音功能时，需要授予麦克风权限
2. **资源文件**: 需要准备应用图标和启动页图片
3. **模拟数据**: 当前转写和总结功能使用模拟数据，需要集成实际的 AI 服务
4. **存储**: 数据存储在本地 AsyncStorage，生产环境需要集成云端存储

## 开发建议

1. 使用 Expo Go 应用进行快速开发测试
2. 使用 TypeScript 确保类型安全
3. 遵循 React Native 最佳实践
4. 保持代码风格一致

