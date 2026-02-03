# Voice AI App

基于 Expo + EAS 构建的工程化 React Native 应用项目。

## 🚀 快速开始

### 前置要求

- Node.js >= 18
- npm 或 yarn
- Expo CLI
- EAS CLI（已全局安装）

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
# 启动开发服务器
npm start

# 在 Android 设备/模拟器上运行
npm run android

# 在 iOS 设备/模拟器上运行（需要 macOS）
npm run ios

# 在 Web 浏览器中运行
npm run web
```

## 📁 项目结构

```
.
├── src/
│   ├── components/      # 可复用组件
│   ├── screens/         # 屏幕组件
│   ├── navigation/      # 导航配置
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript 类型定义
│   ├── hooks/           # 自定义 React Hooks
│   ├── services/        # API 服务层
│   └── constants/       # 应用常量
├── assets/              # 静态资源
├── App.tsx              # 应用入口
├── app.json             # Expo 配置
├── eas.json             # EAS 构建配置
├── tsconfig.json        # TypeScript 配置
├── .eslintrc.js         # ESLint 配置
└── .prettierrc          # Prettier 配置
```

## 🛠️ 开发工具

### 代码检查

```bash
# 运行 ESLint
npm run lint

# 自动修复 ESLint 错误
npm run lint:fix

# TypeScript 类型检查
npm run type-check
```

### 代码格式化

```bash
# 格式化所有文件
npm run format

# 检查格式（不修改文件）
npm run format:check
```

## 📦 EAS Build

### 配置 EAS

首次使用需要登录 EAS：

```bash
eas login
```

然后初始化项目：

```bash
eas build:configure
```

### 构建应用

```bash
# 开发版本构建
npm run build:dev

# 预览版本构建
npm run build:preview

# 生产版本构建
npm run build:prod
```

### 提交到应用商店

```bash
# 提交 iOS 版本
npm run submit:ios

# 提交 Android 版本
npm run submit:android
```

## 🔧 配置说明

### EAS 配置 (eas.json)

- **development**: 开发版本，包含开发工具
- **preview**: 预览版本，用于内部测试
- **production**: 生产版本，用于应用商店发布

### Expo 配置 (app.json)

主要配置项：

- `name`: 应用显示名称
- `slug`: Expo 项目标识符
- `version`: 应用版本号
- `ios.bundleIdentifier`: iOS Bundle ID
- `android.package`: Android 包名

## 📝 代码规范

项目使用以下工具保证代码质量：

- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **TypeScript**: 类型安全

提交代码前请确保：

1. 通过 `npm run lint` 检查
2. 通过 `npm run type-check` 类型检查
3. 通过 `npm run format` 格式化代码

## 🚢 部署流程

1. **开发阶段**
   - 使用 `npm start` 进行本地开发
   - 使用 Expo Go 应用进行快速预览

2. **测试阶段**
   - 运行 `npm run build:preview` 构建预览版本
   - 通过 EAS 分发链接进行内部测试

3. **发布阶段**
   - 更新 `app.json` 中的版本号
   - 运行 `npm run build:prod` 构建生产版本
   - 使用 `npm run submit:ios` 或 `npm run submit:android` 提交到应用商店

## 📚 相关文档

- [Expo 文档](https://docs.expo.dev/)
- [EAS Build 文档](https://docs.expo.dev/build/introduction/)
- [React Native 文档](https://reactnative.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## 📄 许可证

MIT
