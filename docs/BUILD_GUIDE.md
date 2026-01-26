# Android/iOS 打包和真机调试指南

本文档提供将应用打包到 Android 和 iOS 设备进行真机调试的完整步骤。

## 📱 方式一：使用 Expo Go（最简单，推荐用于开发测试）

这是最快的真机调试方式，无需打包，直接运行。

### 步骤：

1. **在手机上安装 Expo Go**
   - iOS: 从 App Store 下载 "Expo Go"
   - Android: 从 Google Play 下载 "Expo Go"

2. **确保手机和电脑在同一 WiFi 网络**

3. **启动开发服务器**
   ```bash
   cd frontend
   npm start
   ```

4. **扫描二维码**
   - iOS: 使用相机应用扫描终端中的二维码
   - Android: 使用 Expo Go 应用扫描二维码

5. **应用会自动加载**

**优点：**
- ✅ 无需配置，最快上手
- ✅ 支持热重载
- ✅ 无需 Apple Developer 账号或 Google Play 账号

**缺点：**
- ❌ 某些原生模块可能不可用
- ❌ 无法测试应用商店发布流程

---

## 📦 方式二：使用 EAS Build（推荐用于生产打包）

EAS (Expo Application Services) 是 Expo 官方的云构建服务，可以生成原生应用。

### 前置要求

1. **安装 EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **登录 Expo 账号**
   ```bash
   # 推荐使用浏览器登录（更稳定）
   eas login --web
   
   # 或使用命令行登录
   eas login
   ```
   如果没有账号，访问 https://expo.dev 注册
   
   **注意：** 如果登录时输入密码后没有反应：
   - 密码输入时不会显示（这是正常的安全行为）
   - 输入完密码后按 Enter 键
   - 如果卡住，使用 `eas login --web` 浏览器登录
   - 或查看 [LOGIN_TROUBLESHOOTING.md](./LOGIN_TROUBLESHOOTING.md) 排查问题

### Android 打包步骤

#### 1. 配置项目

```bash
cd frontend
eas build:configure
```

这会创建 `eas.json` 配置文件。

#### 2. 修改 eas.json（如果需要）

编辑 `eas.json`，确保 Android 配置正确：

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### 3. 构建 APK（用于 Android 真机安装）

```bash
eas build --platform android --profile preview
```

或者构建 AAB（用于 Google Play 发布）：
```bash
eas build --platform android --profile production
```

#### 4. 下载并安装

构建完成后：
- 访问 https://expo.dev 查看构建状态
- 下载 APK 文件
- 传输到 Android 手机
- 在手机上启用"允许安装未知来源应用"
- 安装 APK

### iOS 打包步骤

#### 1. 配置项目

```bash
cd frontend
eas build:configure
```

#### 2. 修改 eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {}
  }
}
```

#### 3. 构建 iOS（需要 Apple Developer 账号）

```bash
eas build --platform ios --profile preview
```

**注意：** iOS 构建需要：
- Apple Developer 账号（$99/年）
- 在 Apple Developer 中配置证书和配置文件

#### 4. 安装到设备

构建完成后：
- 访问 https://expo.dev 下载 IPA
- 使用 TestFlight 或直接安装（需要配置设备 UDID）

---

## 🔧 方式三：本地构建（需要 Android Studio / Xcode）

### Android 本地构建

#### 前置要求

1. **安装 Android Studio**
   - 下载：https://developer.android.com/studio
   - 安装 Android SDK、Android SDK Platform、Android Virtual Device

2. **配置环境变量**

**Windows:**
```powershell
# 添加到系统环境变量
ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
Path=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

**macOS/Linux:**
```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

#### 构建步骤

1. **生成原生项目**
   ```bash
   cd frontend
   npx expo prebuild
   ```

2. **使用 Android Studio 打开**
   ```bash
   # 打开 Android Studio
   # File -> Open -> 选择 frontend/android 目录
   ```

3. **连接 Android 设备**
   - 启用开发者选项和 USB 调试
   - 用 USB 连接手机到电脑
   - 在 Android Studio 中选择设备

4. **构建并运行**
   ```bash
   cd android
   ./gradlew assembleDebug
   # 或使用 Android Studio 的 Run 按钮
   ```

5. **安装 APK**
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### iOS 本地构建（仅 macOS）

#### 前置要求

1. **安装 Xcode**
   - 从 App Store 安装 Xcode
   - 安装 Command Line Tools: `xcode-select --install`

2. **安装 CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

#### 构建步骤

1. **生成原生项目**
   ```bash
   cd frontend
   npx expo prebuild
   ```

2. **安装 iOS 依赖**
   ```bash
   cd ios
   pod install
   ```

3. **使用 Xcode 打开**
   ```bash
   open ios/YourApp.xcworkspace
   ```

4. **配置签名**
   - 在 Xcode 中选择项目
   - 选择 "Signing & Capabilities"
   - 选择你的 Team（需要 Apple Developer 账号）

5. **连接 iOS 设备**
   - 用 USB 连接 iPhone 到 Mac
   - 在 Xcode 中选择设备

6. **构建并运行**
   - 点击 Xcode 的 Run 按钮（▶️）
   - 或在终端运行：`npx expo run:ios --device`

---

## 🐛 真机调试配置

### Android 调试

#### 1. 启用开发者选项

1. 打开"设置" -> "关于手机"
2. 连续点击"版本号"7次
3. 返回设置，找到"开发者选项"
4. 启用"USB 调试"

#### 2. 连接设备

```bash
# 检查设备是否连接
adb devices

# 应该看到你的设备
# List of devices attached
# ABC123XYZ    device
```

#### 3. 查看日志

```bash
# 查看所有日志
adb logcat

# 只查看 React Native 日志
adb logcat *:S ReactNative:V ReactNativeJS:V

# 清除日志
adb logcat -c
```

#### 4. 远程调试

在应用中摇动设备，选择"Debug"：
- Chrome DevTools: http://localhost:8081/debugger-ui
- React Native Debugger: 下载独立应用

### iOS 调试

#### 1. 配置设备

1. 在 Xcode 中：Window -> Devices and Simulators
2. 连接 iPhone
3. 点击"Use for Development"

#### 2. 查看日志

在 Xcode 中：
- 打开底部控制台（View -> Debug Area -> Show Debug Area）
- 运行应用后查看日志

#### 3. 远程调试

在应用中摇动设备，选择"Debug"：
- Safari Web Inspector: 开发 -> [你的设备] -> [应用名]

---

## 📝 配置文件说明

### app.json 配置

确保 `app.json` 包含正确的配置：

```json
{
  "expo": {
    "name": "笔记",
    "slug": "biji",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6366f1"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.biji.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSMicrophoneUsageDescription": "需要访问麦克风以进行录音和语音转写",
        "NSSpeechRecognitionUsageDescription": "需要语音识别权限以进行实时转写"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6366f1"
      },
      "package": "com.biji.app",
      "versionCode": 1,
      "permissions": [
        "RECORD_AUDIO",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

### eas.json 配置（EAS Build）

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🚀 快速开始（推荐流程）

### 开发阶段（使用 Expo Go）

1. 安装 Expo Go 到手机
2. 启动开发服务器：`npm start`
3. 扫描二维码即可

### 测试阶段（使用 EAS Build）

1. 安装 EAS CLI：`npm install -g eas-cli`
2. 登录：`eas login`
3. 配置：`eas build:configure`
4. 构建预览版：`eas build --platform android --profile preview`
5. 下载并安装 APK

### 发布阶段

1. 构建生产版：`eas build --platform android --profile production`
2. 提交到商店：`eas submit --platform android`

---

## ⚠️ 常见问题

### 问题1：Android 设备未识别

**解决方案：**
```bash
# 检查 USB 驱动
# Windows: 安装手机厂商的 USB 驱动
# macOS/Linux: 通常自动识别

# 重启 adb
adb kill-server
adb start-server
adb devices
```

### 问题2：iOS 构建失败（证书问题）

**解决方案：**
1. 确保有 Apple Developer 账号
2. 在 Xcode 中配置正确的 Team
3. 或使用 EAS Build，它会自动处理证书

### 问题3：应用无法连接到后端

**解决方案：**
1. 确保手机和电脑在同一网络
2. 修改 API 地址为电脑的局域网 IP：
   ```typescript
   // frontend/utils/api.ts
   export const API_BASE_URL = 'http://192.168.1.100:3000/api';
   ```
3. 检查防火墙设置

### 问题4：权限被拒绝

**解决方案：**
- Android: 在设置中手动授予权限
- iOS: 在首次使用时允许权限

---

## 📚 相关资源

- [Expo 文档](https://docs.expo.dev/)
- [EAS Build 文档](https://docs.expo.dev/build/introduction/)
- [React Native 调试指南](https://reactnative.dev/docs/debugging)
- [Android 开发者指南](https://developer.android.com/studio/run/device)
- [iOS 开发者指南](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device)

---

## 💡 推荐方案

- **开发调试**: 使用 Expo Go（最快最简单）
- **内部测试**: 使用 EAS Build Preview（生成 APK/IPA）
- **生产发布**: 使用 EAS Build Production（生成 AAB/IPA 用于商店）

