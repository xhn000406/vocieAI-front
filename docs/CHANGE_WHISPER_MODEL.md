# 如何更换 Whisper 模型

## 📋 概述

本项目支持切换不同的 Whisper 模型。模型越大，精度越高，但速度越慢，占用内存越多。

## 🔄 快速切换模型

### 方法 1: 修改配置文件（推荐）

1. **打开配置文件**
   ```
   src/config/whisperModel.ts
   ```

2. **修改当前模型**
   ```typescript
   // 将这行：
   export const CURRENT_MODEL: ModelType = 'tiny';
   
   // 改为你想要的模型，例如：
   export const CURRENT_MODEL: ModelType = 'base';  // 或 'small', 'medium', 'large'
   ```

3. **保存文件**，模型会自动切换

### 方法 2: 手动指定模型路径

在 `src/screens/WhisperDemoScreen.tsx` 中直接修改：

```typescript
const modelPath = 'ggml-base.bin'; // 改为你想要的模型文件名
```

## 📥 下载模型文件

### 可用的模型

| 模型 | 大小 | 速度 | 精度 | 推荐设备 |
|------|------|------|------|----------|
| tiny | ~75 MB | 最快 | 较低 | 低端设备 |
| base | ~140 MB | 快 | 中等 | 推荐使用 |
| small | ~460 MB | 中等 | 较高 | 高端设备 |
| medium | ~1.4 GB | 慢 | 高 | 高端设备 |
| large | ~2.9 GB | 最慢 | 最高 | 高端设备 |

### 下载地址

1. **Hugging Face**（推荐）:
   ```
   https://huggingface.co/ggerganov/whisper.cpp/tree/main
   ```

2. **GitHub**:
   ```
   https://github.com/ggerganov/whisper.cpp/tree/master/models
   ```

### 下载步骤

1. 访问上述链接
2. 下载对应的 `.bin` 文件（例如 `ggml-base.bin`）
3. 将文件保存到项目的 `assets` 目录

## 📁 放置模型文件

### 1. 放置到 assets 目录

将下载的模型文件（如 `ggml-base.bin`）放到：
```
assets/ggml-base.bin
```

### 2. 复制到 Android assets（必需）

对于 Android，还需要将文件复制到原生 assets 目录：

```bash
# Windows PowerShell
Copy-Item "assets\ggml-base.bin" -Destination "android\app\src\main\assets\ggml-base.bin" -Force

# Linux/Mac
cp assets/ggml-base.bin android/app/src/main/assets/ggml-base.bin
```

### 3. iOS（自动处理）

iOS 会自动从 bundle 中加载 assets 目录下的文件，无需额外操作。

## 🔧 更新代码

### 步骤 1: 修改模型配置

编辑 `src/config/whisperModel.ts`：

```typescript
export const CURRENT_MODEL: ModelType = 'base'; // 改为你想要的模型
```

### 步骤 2: 更新 Android assets

确保新模型文件已复制到 `android/app/src/main/assets/` 目录。

### 步骤 3: 重新构建应用

```bash
# Android
npm run android

# iOS
npm run ios
```

## 📝 完整示例

### 切换到 base 模型

1. **下载模型**
   - 从 Hugging Face 下载 `ggml-base.bin`
   - 保存到 `assets/ggml-base.bin`

2. **复制到 Android**
   ```bash
   Copy-Item "assets\ggml-base.bin" -Destination "android\app\src\main\assets\ggml-base.bin" -Force
   ```

3. **修改配置**
   ```typescript
   // src/config/whisperModel.ts
   export const CURRENT_MODEL: ModelType = 'base';
   ```

4. **重新构建**
   ```bash
   npm run android
   ```

## ⚠️ 注意事项

1. **文件大小限制**
   - 较大的模型（medium、large）会增加应用体积
   - 考虑使用动态下载而不是打包到应用中

2. **内存要求**
   - tiny/base: 适合大多数设备
   - small: 需要至少 2GB RAM
   - medium: 需要至少 4GB RAM
   - large: 需要至少 6GB RAM

3. **性能考虑**
   - 模型越大，转录速度越慢
   - 但精度会显著提高

4. **Android assets 目录**
   - 每次切换模型都需要更新 `android/app/src/main/assets/` 目录
   - 或者重新运行 `npm run prebuild:android`

## 🔍 验证模型切换

切换模型后，运行应用并查看控制台日志：

```
[WhisperDemoScreen] 当前模型: base 文件: ggml-base.bin 平台: android
```

如果看到新的模型名称，说明切换成功。

## 🐛 常见问题

### Q: 模型文件找不到？
A: 确保文件已放在 `assets` 目录，并且 Android 版本已复制到 `android/app/src/main/assets/`。

### Q: 切换模型后应用崩溃？
A: 可能是内存不足。尝试使用更小的模型（tiny 或 base）。

### Q: 如何动态切换模型？
A: 可以修改代码，让用户选择模型，然后重新初始化 Whisper 服务。

