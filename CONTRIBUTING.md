# 贡献指南

感谢您对本项目的关注！本文档将帮助您了解如何为项目做出贡献。

## 开发环境设置

1. **安装 Node.js**
   - 推荐使用 Node.js 18+（项目包含 `.nvmrc` 文件）
   - 如果使用 nvm：`nvm use`

2. **安装依赖**

   ```bash
   npm install
   ```

3. **配置 EAS（可选）**
   ```bash
   eas login
   eas build:configure
   ```

## 开发流程

### 1. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

### 2. 开发

- 遵循项目代码规范
- 编写清晰的提交信息
- 确保代码通过所有检查

### 3. 代码检查

在提交前运行：

```bash
# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 类型检查
npm run type-check

# 格式化检查
npm run format:check

# 格式化代码
npm run format
```

### 4. 提交代码

使用清晰的提交信息：

```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复bug"
git commit -m "docs: 更新文档"
```

提交信息格式遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 代码规范

### TypeScript

- 使用 TypeScript 进行类型定义
- 避免使用 `any`，优先使用具体类型
- 为函数参数和返回值添加类型注解

### 组件结构

```typescript
// 导入顺序：React/React Native -> 第三方库 -> 本地模块
import React from 'react';
import { View, Text } from 'react-native';
import { SomeComponent } from '../components';

// 类型定义
interface Props {
  title: string;
}

// 组件
export const MyComponent: React.FC<Props> = ({ title }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
```

### 文件命名

- 组件文件：PascalCase（如 `UserProfile.tsx`）
- 工具函数：camelCase（如 `formatDate.ts`）
- 常量文件：`index.ts` 或 `constants.ts`

## 项目结构

```
src/
├── components/     # 可复用组件
├── screens/        # 屏幕组件
├── navigation/     # 导航配置
├── utils/          # 工具函数
├── types/          # TypeScript 类型定义
├── hooks/          # 自定义 React Hooks
├── services/       # API 服务层
└── constants/      # 应用常量
```

## 测试

在添加新功能时，请确保：

1. 代码通过 TypeScript 类型检查
2. 代码通过 ESLint 检查
3. 代码格式符合 Prettier 规范
4. 功能在目标平台上正常工作

## 问题反馈

如果发现问题，请：

1. 检查是否已有相关 issue
2. 创建新的 issue，描述问题和复现步骤
3. 如果是 bug，请提供错误日志和系统信息

## Pull Request

提交 PR 时请确保：

- [ ] 代码通过所有检查
- [ ] 添加了必要的文档
- [ ] 提交信息清晰明确
- [ ] 没有破坏性变更（或已更新相关文档）

感谢您的贡献！
