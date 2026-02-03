# 原生代码开发工作流程

## 🔍 关键问题解答

### Q: `expo prebuild` 会上传到 EAS 吗？

**不会！** `expo prebuild` 只是**本地生成**原生目录，不会上传任何内容。

### Q: 在 Android Studio 中写的代码会被 EAS Build 使用吗？

**会的！** 当你运行 `eas build` 时，EAS 会：

1. 上传整个项目（包括 `android/` 目录）
2. 在云端运行 `expo prebuild`（如果 `android/` 目录不存在）
3. 如果 `android/` 目录已存在，**直接使用你本地的代码进行构建**

---

## 📋 工作流程说明

### 场景 1: 本地原生开发 + EAS Build

#### 步骤 1: 生成原生目录（只需一次）

```bash
npm run prebuild:android
```

这会**本地生成** `android/` 目录，不会上传任何内容。

#### 步骤 2: 在 Android Studio 中开发

1. 打开 Android Studio
2. 打开 `android/` 目录
3. 编写你的原生业务代码
4. 本地测试（可选）

#### 步骤 3: 使用 EAS Build 构建

```bash
# 运行 EAS Build
eas build --profile production --platform android
```

**重要**：EAS Build 会：

- ✅ 上传整个项目（包括你修改的 `android/` 目录）
- ✅ 使用你本地的原生代码进行构建
- ✅ 不会重新运行 `expo prebuild`（因为 `android/` 目录已存在）

---

### 场景 2: 重新生成原生目录

如果你需要重新生成原生目录（例如添加了新的 Config Plugin）：

```bash
# 清理并重新生成
npm run prebuild:clean
```

**⚠️ 警告**：这会**覆盖** `android/` 目录中的所有自定义代码！

**解决方案**：使用 Config Plugins 来保留自定义代码（见下方说明）

---

## 🎯 推荐工作流程

### 方案 A: 直接修改原生代码（简单但需注意）

```bash
# 1. 生成原生目录
npm run prebuild:android

# 2. 在 Android Studio 中修改代码
# 编辑 android/app/src/main/java/com/voiceai/app/...

# 3. 提交代码到 Git（重要！）
git add android/
git commit -m "添加自定义原生代码"

# 4. 使用 EAS Build（会使用你的本地代码）
eas build --profile production --platform android
```

**优点**：

- ✅ 简单直接
- ✅ 可以完全控制原生代码

**缺点**：

- ⚠️ 如果运行 `expo prebuild --clean` 会丢失修改
- ⚠️ 需要手动管理原生代码

---

### 方案 B: 使用 Config Plugins（推荐，更安全）

使用 Config Plugins 可以确保自定义代码在每次构建时自动应用。

#### 1. 创建 Config Plugin

创建 `plugins/withMyNativeCode.js`：

```javascript
const { withMainApplication } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withMyNativeCode = config => {
  return withMainApplication(config, config => {
    const mainApplication = config.modResults;

    // 修改 MainApplication.kt
    // 例如：添加 import
    if (!mainApplication.contents.includes('import com.voiceai.app.MyModule')) {
      mainApplication.contents = mainApplication.contents.replace(
        /import com.facebook.react.ReactPackage;/,
        `import com.facebook.react.ReactPackage;
import com.voiceai.app.MyModule;`
      );
    }

    return config;
  });
};

module.exports = withMyNativeCode;
```

#### 2. 创建原生代码模板

创建 `plugins/templates/MyModule.kt`：

```kotlin
package com.voiceai.app

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class MyModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "MyModule"
    }

    @ReactMethod
    fun myNativeMethod(promise: Promise) {
        // 你的业务逻辑
        promise.resolve("成功")
    }
}
```

#### 3. 在 Config Plugin 中复制文件

```javascript
const { withDangerousMod } = require('@expo/config-plugins');

const withMyNativeCode = config => {
  // ... MainApplication 修改

  // 复制原生文件
  config = withDangerousMod(config, [
    'android',
    async config => {
      const androidRoot = config.modRequest.platformProjectRoot;
      const targetDir = path.join(
        androidRoot,
        'app/src/main/java/com/voiceai/app'
      );

      // 确保目录存在
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 复制模板文件
      const templatePath = path.join(__dirname, 'templates/MyModule.kt');
      const targetPath = path.join(targetDir, 'MyModule.kt');
      fs.copyFileSync(templatePath, targetPath);

      return config;
    },
  ]);

  return config;
};
```

#### 4. 在 app.json 中使用

```json
{
  "expo": {
    "plugins": ["./plugins/withMyNativeCode.js"]
  }
}
```

**优点**：

- ✅ 代码会被版本控制
- ✅ 每次构建自动应用
- ✅ 可以安全地运行 `expo prebuild --clean`

**缺点**：

- ⚠️ 需要学习 Config Plugins
- ⚠️ 稍微复杂一些

---

## 🔄 EAS Build 的工作流程

当你运行 `eas build` 时，EAS 会：

1. **检查 `android/` 目录是否存在**
   - 如果**存在**：直接使用你的本地代码
   - 如果**不存在**：运行 `expo prebuild` 生成

2. **上传项目**
   - 上传整个项目目录（包括 `android/`）
   - 不包括 `node_modules/`、`.git/` 等（根据 `.gitignore`）

3. **在云端构建**
   - 使用你上传的原生代码
   - 运行 Gradle 构建
   - 生成 APK/AAB

---

## ⚠️ 重要注意事项

### 1. Git 版本控制

**强烈建议**将 `android/` 目录提交到 Git：

```bash
# 检查 .gitignore 确保 android/ 没有被忽略
# 只有构建产物应该被忽略（build/, .gradle/ 等）

# 提交原生代码
git add android/
git commit -m "添加自定义原生代码"
```

### 2. 不要运行 `expo prebuild` 在已有自定义代码时

如果你已经修改了 `android/` 目录中的代码：

```bash
# ❌ 不要这样做（会覆盖你的修改）
npm run prebuild:clean

# ✅ 如果需要重新生成，先备份或使用 Config Plugins
```

### 3. EAS Build 使用本地代码

运行 `eas build` 时：

- ✅ 会使用你本地的 `android/` 目录
- ✅ 包括你所有的自定义修改
- ✅ 不需要担心代码丢失

---

## 📝 实际示例

### 示例：添加自定义原生模块

#### 1. 生成原生目录

```bash
npm run prebuild:android
```

#### 2. 在 Android Studio 中创建模块

创建 `android/app/src/main/java/com/voiceai/app/VoiceModule.kt`：

```kotlin
package com.voiceai.app

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class VoiceModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "VoiceModule"
    }

    @ReactMethod
    fun startRecording(promise: Promise) {
        // 你的业务逻辑
        promise.resolve("录音已开始")
    }
}
```

#### 3. 提交到 Git

```bash
git add android/
git commit -m "添加 VoiceModule 原生模块"
```

#### 4. 使用 EAS Build

```bash
eas build --profile production --platform android
```

EAS 会使用你的 `VoiceModule.kt` 进行构建！

---

## 🎯 总结

| 操作                         | 是否上传到 EAS | 说明                                  |
| ---------------------------- | -------------- | ------------------------------------- |
| `expo prebuild`              | ❌ 不上传      | 只是本地生成目录                      |
| `eas build`                  | ✅ 会上传      | 上传整个项目（包括 `android/`）       |
| 修改 `android/` 代码         | -              | 本地修改，运行 `eas build` 时会被使用 |
| 运行 `expo prebuild --clean` | ❌ 不上传      | 会覆盖本地修改                        |

**核心要点**：

- ✅ `expo prebuild` = 本地生成，不上传
- ✅ `eas build` = 上传并使用你的本地代码
- ✅ 在 Android Studio 中写的代码会被 EAS Build 使用
- ⚠️ 建议使用 Config Plugins 来保留自定义代码
