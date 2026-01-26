# 本地构建 Android APK 完整指南

## ⚠️ 重要：必须在 frontend 目录下运行命令

所有 Expo 命令都必须在 `frontend` 目录下执行！

---

## 📋 前置要求

### 1. 安装 Android Studio

1. 下载：https://developer.android.com/studio
2. 安装 Android SDK、Android SDK Platform、Android Virtual Device
3. 安装完成后，打开 Android Studio，进入 SDK Manager，确保安装了：
   - Android SDK Platform 34（或最新版本）
   - Android SDK Build-Tools
   - Android SDK Platform-Tools

### 2. 配置环境变量

**Windows:**

1. 打开"系统属性" → "环境变量"
2. 新建系统变量：
   - 变量名：`ANDROID_HOME`
   - 变量值：`C:\Users\YourName\AppData\Local\Android\Sdk`（根据实际路径修改）

3. 编辑 `Path` 变量，添加：
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

4. 验证配置：
   ```powershell
   adb version
   # 应该显示 adb 版本信息
   ```

---

## 🚀 构建步骤

### 步骤1：进入 frontend 目录

```bash
cd F:\angelalign\biji\frontend
```

**重要：** 必须在 frontend 目录下运行所有命令！

### 步骤2：生成原生 Android 项目

```bash
npx expo prebuild --platform android
```

这会创建 `android` 文件夹。

### 步骤3：构建 APK

```bash
cd android
.\gradlew assembleDebug
```

**注意：** Windows 使用 `.\gradlew`，Linux/macOS 使用 `./gradlew`

### 步骤4：安装到手机

1. **连接手机**
   - 启用 USB 调试（设置 → 开发者选项 → USB 调试）
   - 用 USB 连接手机到电脑

2. **检查设备连接**
   ```bash
   adb devices
   # 应该显示你的设备
   ```

3. **安装 APK**
   ```bash
   adb install app\build\outputs\apk\debug\app-debug.apk
   ```

---

## 🔍 常见问题

### 问题1：找不到 package.json

**错误：** `The expected package.json path: F:\angelalign\biji\package.json does not exist`

**解决：** 确保在 `frontend` 目录下运行命令：
```bash
cd F:\angelalign\biji\frontend
npx expo prebuild --platform android
```

### 问题2：找不到 adb 命令

**解决：** 
1. 检查环境变量配置
2. 重启终端/PowerShell
3. 或使用完整路径：`C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools\adb.exe`

### 问题3：Gradle 构建失败

**解决：**
```bash
cd android
.\gradlew clean
.\gradlew assembleDebug
```

### 问题4：找不到 Java/JDK

**解决：**
1. 安装 JDK 17 或更高版本
2. 配置 JAVA_HOME 环境变量
3. Android Studio 自带 JDK，可以使用其路径

---

## 📝 完整命令序列

```bash
# 1. 进入 frontend 目录
cd F:\angelalign\biji\frontend

# 2. 生成原生项目
npx expo prebuild --platform android

# 3. 进入 android 目录
cd android

# 4. 构建 APK
.\gradlew assembleDebug

# 5. 检查设备
adb devices

# 6. 安装 APK
adb install app\build\outputs\apk\debug\app-debug.apk
```

---

## 💡 提示

- APK 文件位置：`frontend/android/app/build/outputs/apk/debug/app-debug.apk`
- 可以将 APK 文件复制到手机，手动安装
- 每次修改代码后，需要重新构建 APK

