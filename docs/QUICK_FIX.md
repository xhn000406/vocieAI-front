# 快速解决 Expo Go 版本不兼容问题

## 🎯 最简单方案：使用本地构建（无需 Expo Go）

不依赖 Expo Go，直接构建 APK 安装到手机。

### Android 快速构建：

```bash
cd frontend

# 1. 生成原生 Android 项目
npx expo prebuild --platform android

# 2. 构建 APK
cd android
./gradlew assembleDebug

# 3. 安装到手机（连接手机后）
adb install app/build/outputs/apk/debug/app-debug.apk
```

**注意：** 需要先安装 Android Studio 和配置环境变量。

---

## 📱 方案2：安装 SDK 51 的 Expo Go

### Android：

1. **卸载当前 Expo Go**
   - 设置 → 应用 → Expo Go → 卸载

2. **下载 SDK 51 版本**
   - 直接下载链接：https://d1ahtucjixef4r.cloudfront.net/Exponent-2.32.2.apk
   - 或访问：https://expo.dev/go?sdkVersion=51&platform=android&device=true

3. **安装 APK**
   - 允许"安装未知来源应用"
   - 安装下载的 APK

4. **重新扫描二维码**

---

## 🔧 方案3：临时修复资源文件问题

如果资源文件缺失导致问题，可以临时创建占位文件：

```bash
cd frontend/assets

# 创建占位图片（如果不存在）
# 可以使用任何图片文件，重命名为：
# - icon.png (1024x1024)
# - splash.png (1242x2436)
# - adaptive-icon.png (1024x1024)
```

---

## 💡 推荐操作顺序

1. **先尝试方案2**（安装 SDK 51 的 Expo Go）- 最快
2. **如果不行，使用方案1**（本地构建）- 最可靠
3. **检查资源文件**（方案3）- 确保没有其他错误

---

## 🚀 立即测试

安装 SDK 51 的 Expo Go 后：

```bash
cd frontend
npm start
# 重新扫描二维码
```

