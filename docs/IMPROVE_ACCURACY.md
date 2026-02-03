# 提高 Whisper 识别准确率指南

## 🔍 问题诊断

如果识别结果不准确（例如总是识别成"死亡"），可能的原因：

1. **模型精度太低** - tiny 模型精度较低
2. **缺少上下文提示** - 没有提供语言上下文
3. **录音质量问题** - 采样率、格式不合适
4. **环境噪音** - 背景噪音干扰

## ✅ 解决方案

### 1. 切换到更高精度的模型（最重要）

**当前配置**：`src/config/whisperModel.ts`

```typescript
// 将这行：
export const CURRENT_MODEL: ModelType = 'tiny';

// 改为：
export const CURRENT_MODEL: ModelType = 'base'; // 或 'small'
```

**模型对比**：
- **tiny**: ~75MB，速度快但精度低，容易误识别
- **base**: ~140MB，平衡速度和精度，**推荐使用**
- **small**: ~460MB，精度较高，适合高端设备

### 2. 下载并替换模型文件

1. **下载 base 模型**：
   ```
   https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin
   ```

2. **替换文件**：
   ```bash
   # 替换 assets 目录下的文件
   # 将下载的 ggml-base.bin 放到 assets/ 目录
   
   # 复制到 Android assets
   Copy-Item "assets\ggml-base.bin" -Destination "android\app\src\main\assets\ggml-base.bin" -Force
   ```

3. **重新构建**：
   ```bash
   npm run android
   ```

### 3. 优化转录选项

代码已自动添加以下优化：

- ✅ **语言提示**：明确指定 `language: 'zh'`
- ✅ **上下文提示词**：添加 `prompt: '这是一段中文语音，'`
- ✅ **降低阈值**：`wordThold: 0.01` 提高识别敏感度

### 4. 改善录音环境

- 🎤 **靠近麦克风**：距离 10-30cm
- 🔇 **减少噪音**：在安静环境中录音
- 🗣️ **清晰发音**：语速适中，发音清晰
- ⏱️ **录音时长**：建议 3-10 秒，不要太短或太长

### 5. 检查录音质量

- 确保采样率为 16kHz（已配置）
- 使用单声道（已配置）
- WAV 格式（已配置）

## 📊 模型选择建议

| 使用场景 | 推荐模型 | 原因 |
|---------|---------|------|
| 快速测试 | tiny | 速度快，但精度低 |
| **日常使用** | **base** | **平衡速度和精度，推荐** |
| 高精度需求 | small | 精度高，但速度慢 |
| 专业用途 | medium/large | 最高精度，但需要高端设备 |

## 🔧 快速修复步骤

### 立即提高准确率：

1. **切换到 base 模型**：
   ```typescript
   // src/config/whisperModel.ts
   export const CURRENT_MODEL: ModelType = 'base';
   ```

2. **下载模型文件**：
   - 访问：https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin
   - 下载并保存到 `assets/ggml-base.bin`

3. **更新 Android assets**：
   ```bash
   Copy-Item "assets\ggml-base.bin" -Destination "android\app\src\main\assets\ggml-base.bin" -Force
   ```

4. **重新构建**：
   ```bash
   npm run android
   ```

## 💡 其他优化建议

### 添加更多上下文提示

如果识别特定领域的内容，可以修改提示词：

```typescript
// src/components/WhisperRecorder.tsx
prompt: '这是一段中文语音，关于日常对话。', // 根据场景调整
```

### 使用更大的模型

如果 base 模型还不够准确，可以尝试：
- **small** 模型：精度显著提升
- **medium** 模型：最高精度（需要高端设备）

## ⚠️ 注意事项

1. **模型文件大小**：base 模型约 140MB，会增加应用体积
2. **内存要求**：base 模型需要至少 1GB 可用内存
3. **转录速度**：base 模型比 tiny 稍慢，但精度更高
4. **首次使用**：切换模型后需要重新初始化

## 🎯 预期效果

切换到 base 模型后：
- ✅ 识别准确率显著提升
- ✅ 减少误识别（如"死亡"这类错误）
- ✅ 更好地理解中文语境
- ✅ 支持更长的句子识别

