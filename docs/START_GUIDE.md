# 完整启动流程指南

本文档提供从零开始启动项目的完整步骤。

## 📋 前置要求

确保已安装以下软件：

- **Node.js** 18+ （推荐使用 LTS 版本）
- **npm** 或 **yarn**
- **MySQL** 8.0+
- **Redis** 6.0+
- **Git**

可选：
- **MinIO**（用于文件存储，也可使用 AWS S3）
- **Expo Go**（手机端测试，iOS/Android）

---

## 🚀 完整启动流程

### 第一步：克隆项目（如果是从 Git 仓库）

```bash
git clone <repository-url>
cd biji
```

### 第二步：初始化数据库

#### 2.1 启动 MySQL 服务

**Windows:**
```bash
# 如果 MySQL 作为服务运行，确保服务已启动
# 可以在服务管理器中检查 MySQL80 服务状态
```

**macOS:**
```bash
brew services start mysql
# 或
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
# 或
sudo service mysql start
```

#### 2.2 创建数据库

登录 MySQL：
```bash
mysql -u root -p
```

执行 SQL 脚本创建数据库和表：
```bash
# 方式1：在 MySQL 命令行中执行
mysql -u root -p < backend/src/database/mysql/schema.sql

# 方式2：使用 Node.js 脚本（需要先安装后端依赖）
cd backend
npm install
npm run init:db
```

或者手动执行：
```sql
-- 在 MySQL 命令行中
source backend/src/database/mysql/schema.sql;
```

#### 2.3 验证数据库

```bash
mysql -u root -p biji -e "SHOW TABLES;"
```

应该看到 12 个表：
- users
- meetings
- transcripts
- tags
- files
- shares
- user_stats
- meeting_stats
- system_logs
- subscriptions
- api_calls
- file_stats

### 第三步：启动 Redis

**Windows:**
```bash
# 下载 Redis for Windows
# 或使用 WSL
wsl redis-server
```

**macOS:**
```bash
brew services start redis
# 或
redis-server
```

**Linux:**
```bash
sudo systemctl start redis
# 或
redis-server
```

验证 Redis：
```bash
redis-cli ping
# 应该返回 PONG
```

### 第四步：配置后端环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，配置以下内容：

```env
# 服务器配置
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081

# MySQL 配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=biji

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# 文件存储 - MinIO（可选）
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=biji-files
MINIO_USE_SSL=false

# 阿里云 NLS（可选，用于语音转写）
ALIYUN_NLS_ACCESS_KEY_ID=
ALIYUN_NLS_ACCESS_KEY_SECRET=
ALIYUN_NLS_APP_KEY=

# 通义千问（可选，用于AI总结）
DASHSCOPE_API_KEY=

# Sentry（可选，用于错误监控）
SENTRY_DSN=
```

### 第五步：安装后端依赖

```bash
cd backend
npm install
```

如果安装过程中出现错误，可以尝试：
```bash
npm install --legacy-peer-deps
```

### 第六步：启动后端服务

```bash
# 开发模式（热重载）
npm run dev

# 或生产模式
npm run build
npm start
```

后端服务启动后，应该看到：
```
✅ MySQL 连接成功
✅ Redis 连接成功
🚀 服务器运行在端口 3000
📱 环境: development
```

测试后端 API：
```bash
curl http://localhost:3000/health
# 应该返回: {"status":"ok","timestamp":"..."}
```

### 第七步：安装前端依赖

打开新的终端窗口：

```bash
cd frontend
npm install
```

如果使用 Expo，可能需要全局安装 Expo CLI：
```bash
npm install -g expo-cli
```

### 第八步：配置前端 API 地址（可选）

如果需要连接后端 API，编辑前端配置文件：

创建或编辑 `frontend/utils/api.ts`：

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';
```

### 第九步：启动前端服务

```bash
cd frontend
npm start
```

这会启动 Expo 开发服务器，你会看到：

```
Metro waiting on exp://192.168.x.x:8081
Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

### 第十步：运行应用

#### 方式1：在手机上运行（推荐）

1. 安装 **Expo Go** 应用（iOS App Store 或 Google Play）
2. 扫描终端中显示的二维码
3. 应用会在手机上打开

#### 方式2：在模拟器中运行

**iOS 模拟器（需要 macOS）：**
```bash
npm run ios
```

**Android 模拟器：**
```bash
npm run android
```

**Web 浏览器：**
```bash
npm run web
```

---

## 🔍 验证安装

### 1. 检查后端服务

访问：http://localhost:3000/health

应该返回：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 检查前端服务

访问：http://localhost:8081

应该看到 Expo 开发工具界面。

### 3. 测试用户注册

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "name": "测试用户"
  }'
```

应该返回用户信息和 token。

---

## 🐛 常见问题排查

### 问题1：MySQL 连接失败

**错误信息：** `❌ MySQL 连接失败`

**解决方案：**
1. 检查 MySQL 服务是否运行
2. 检查 `.env` 文件中的 MySQL 配置是否正确
3. 检查 MySQL 用户权限：
   ```sql
   GRANT ALL PRIVILEGES ON biji.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

### 问题2：Redis 连接失败

**错误信息：** `❌ Redis 连接失败`

**解决方案：**
1. 检查 Redis 服务是否运行：`redis-cli ping`
2. 检查 `.env` 文件中的 Redis 配置
3. 如果 Redis 设置了密码，确保在 `.env` 中配置了 `REDIS_PASSWORD`

### 问题3：端口被占用

**错误信息：** `EADDRINUSE: address already in use`

**解决方案：**
1. 查找占用端口的进程：
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # macOS/Linux
   lsof -i :3000
   ```
2. 杀死进程或更改端口号

### 问题4：前端无法连接后端

**解决方案：**
1. 确保后端服务正在运行
2. 检查 `FRONTEND_URL` 配置
3. 如果使用手机测试，确保手机和电脑在同一网络
4. 检查防火墙设置

### 问题5：数据库表不存在

**解决方案：**
1. 重新执行 SQL 脚本：
   ```bash
   mysql -u root -p biji < backend/src/database/mysql/schema.sql
   ```
2. 检查数据库名称是否正确

---

## 📝 开发工作流

### 日常开发流程

1. **启动数据库服务**
   ```bash
   # MySQL
   mysql.server start  # macOS
   
   # Redis
   redis-server
   ```

2. **启动后端**（终端1）
   ```bash
   cd backend
   npm run dev
   ```

3. **启动前端**（终端2）
   ```bash
   cd frontend
   npm start
   ```

4. **开发调试**
   - 前端代码修改会自动热重载
   - 后端代码修改会自动重启（使用 tsx watch）

### 停止服务

- **前端：** 在终端按 `Ctrl + C`
- **后端：** 在终端按 `Ctrl + C`
- **Redis：** `redis-cli shutdown` 或 `Ctrl + C`
- **MySQL：** `mysql.server stop`（macOS）或停止服务

---

## 🎯 快速启动脚本（可选）

创建 `start.sh`（Linux/macOS）：

```bash
#!/bin/bash

echo "🚀 启动笔记应用..."

# 启动 MySQL
echo "📊 启动 MySQL..."
mysql.server start

# 启动 Redis
echo "💾 启动 Redis..."
redis-server --daemonize yes

# 等待服务启动
sleep 2

# 启动后端
echo "🔧 启动后端服务..."
cd backend
npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端
echo "📱 启动前端服务..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ 所有服务已启动！"
echo "后端 PID: $BACKEND_PID"
echo "前端 PID: $FRONTEND_PID"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待中断信号
trap "kill $BACKEND_PID $FRONTEND_PID; mysql.server stop; redis-cli shutdown; exit" INT
wait
```

创建 `start.bat`（Windows）：

```batch
@echo off
echo 🚀 启动笔记应用...

echo 📊 启动 MySQL...
net start MySQL80

echo 💾 启动 Redis...
start /B redis-server

timeout /t 2

echo 🔧 启动后端服务...
cd backend
start "后端服务" cmd /k "npm run dev"

timeout /t 3

echo 📱 启动前端服务...
cd ..\frontend
start "前端服务" cmd /k "npm start"

echo ✅ 所有服务已启动！
pause
```

---

## 📚 下一步

- 查看 [API 文档](./backend/README.md) 了解后端 API
- 查看 [数据库设计](./backend/docs/DATABASE_DESIGN.md) 了解数据结构
- 查看 [前端文档](./frontend/README.md) 了解前端结构

---

## 💡 提示

- 开发时建议使用 `npm run dev` 启动后端，支持热重载
- 使用 Expo Go 在真机上测试可以获得最佳体验
- 定期备份数据库：`mysqldump -u root -p biji > backup.sql`
- 生产环境部署前记得修改 `.env` 中的敏感信息

