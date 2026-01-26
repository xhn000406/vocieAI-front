# 快速真机调试指南

## 🚀 最快方式：使用 Expo Go（5分钟上手）

### 步骤：

1. **在手机上安装 Expo Go**
   - iOS: App Store 搜索 "Expo Go"
   - Android: Google Play 搜索 "Expo Go"

2. **启动项目**
   ```bash
   cd frontend
   npm start
   ```

3. **扫描二维码**
   - iOS: 用相机扫描终端中的二维码
   - Android: 用 Expo Go 应用扫描

4. **完成！** 应用会自动加载

---

## 📦 打包 APK（Android 真机安装）

### 使用 EAS Build（推荐）

1. **安装 EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **登录 Expo**
   ```bash
   eas login
   ```

3. **构建 APK**
   ```bash
   cd frontend
   eas build --platform android --profile preview
   ```

4. **下载并安装**
   - 访问 https://expo.dev
   - 下载 APK 文件
   - 传输到手机安装

### 本地构建（需要 Android Studio）

1. **生成原生项目**
   ```bash
   cd frontend
   npx expo prebuild
   ```

2. **构建 APK**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. **安装到设备**
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 📱 打包 iOS（需要 macOS + Apple Developer）

1. **生成原生项目**
   ```bash
   cd frontend
   npx expo prebuild
   ```

2. **安装依赖**
   ```bash
   cd ios
   pod install
   ```

3. **用 Xcode 打开**
   ```bash
   open ios/YourApp.xcworkspace
   ```

4. **配置签名并运行**

---

详细说明请查看 [BUILD_GUIDE.md](./BUILD_GUIDE.md)

