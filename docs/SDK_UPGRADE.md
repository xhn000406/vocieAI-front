# Expo SDK 升级指南

## 问题：Expo Go 版本不兼容

**错误信息：**
- 安装的 Expo Go 是 SDK 54 版本
- 项目使用的是 SDK 51 版本

---

## 🚀 解决方案1：升级项目到 SDK 54（推荐）

这是最好的长期解决方案，可以使用最新版本的 Expo Go。

### 步骤：

1. **使用 Expo 升级工具**
   ```bash
   cd frontend
   npx expo install --fix
   npx expo-doctor
   ```

2. **升级 Expo SDK**
   ```bash
   npx expo upgrade 54
   ```

3. **更新依赖**
   ```bash
   npm install
   ```

4. **检查并修复问题**
   ```bash
   npx expo-doctor
   ```

5. **重新启动**
   ```bash
   npm start
   ```

---

## 📱 解决方案2：安装兼容 SDK 51 的 Expo Go

如果不想升级项目，可以安装旧版本的 Expo Go。

### Android:

1. 访问：https://expo.dev/go?sdkVersion=51&platform=android&device=true
2. 下载 SDK 51 版本的 Expo Go APK
3. 卸载当前版本的 Expo Go
4. 安装下载的 APK

### iOS:

1. 访问：https://expo.dev/go?sdkVersion=51&platform=ios&device=true
2. 按照说明安装兼容版本

---

## ⚠️ 注意事项

- SDK 54 包含最新的功能和修复
- 升级后可能需要更新一些代码
- 建议先备份项目

---

## 🔍 如果升级遇到问题

运行诊断工具：
```bash
npx expo-doctor
```

这会检查并提示需要修复的问题。

