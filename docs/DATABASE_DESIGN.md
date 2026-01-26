# 数据库设计文档

## 概述

本项目使用 **MySQL** 作为唯一数据库，存储所有业务数据和统计数据。

## MySQL 数据库设计

### 1. 用户表 (users)

存储用户基本信息、订阅状态等。

**字段说明**:
- `id`: 主键，自增
- `email`: 邮箱（唯一索引）
- `password`: 密码（加密）
- `name`: 用户名
- `avatar`: 头像URL
- `phone`: 手机号（唯一索引）
- `subscription`: 订阅类型（free/pro）
- `subscription_expires_at`: 订阅过期时间
- `last_sync_at`: 最后同步时间
- `storage_used`: 已使用存储空间（字节）
- `storage_limit`: 存储空间限制（字节）
- `settings`: 用户设置（JSON）
- `oauth`: OAuth信息（JSON）
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `email`: 唯一索引
- `phone`: 唯一索引
- `subscription`: 普通索引

---

### 2. 会议表 (meetings)

存储会议记录、AI总结等。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键）
- `title`: 会议标题
- `description`: 会议描述
- `duration`: 会议时长（秒）
- `start_time`: 开始时间
- `end_time`: 结束时间
- `audio_url`: 音频文件URL
- `audio_size`: 音频文件大小（字节）
- `status`: 状态（recording/completed/archived）
- `summary`: AI总结（JSON）
- `tags`: 标签列表（JSON）
- `speakers`: 发言人信息（JSON）
- `participants`: 参与者信息（JSON）
- `is_archived`: 是否归档
- `is_shared`: 是否分享
- `share_token`: 分享令牌
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `user_id`: 索引
- `user_id + created_at`: 复合索引（降序）
- `user_id + status`: 复合索引
- `share_token`: 唯一索引

---

### 3. 转写内容表 (transcripts)

存储会议的转写内容。

**字段说明**:
- `id`: 主键，自增
- `meeting_id`: 会议ID（外键）
- `text`: 转写文本
- `timestamp`: 时间戳（秒）
- `speaker_id`: 发言人ID
- `speaker_name`: 发言人名称
- `is_highlighted`: 是否高亮
- `confidence`: 置信度（0-1）
- `created_at`: 创建时间

**索引**:
- `meeting_id`: 索引
- `meeting_id + timestamp`: 复合索引
- `speaker_id`: 索引

---

### 4. 标签表 (tags)

存储用户自定义标签。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键）
- `name`: 标签名称
- `color`: 标签颜色
- `icon`: 标签图标
- `usage_count`: 使用次数
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `user_id + name`: 复合唯一索引

---

### 5. 文件表 (files)

存储上传的文件信息。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键）
- `meeting_id`: 关联的会议ID（外键，可为空）
- `filename`: 文件名
- `original_name`: 原始文件名
- `mime_type`: MIME类型
- `size`: 文件大小（字节）
- `url`: 文件URL
- `storage_type`: 存储类型（minio/s3）
- `storage_key`: 存储键（唯一索引）
- `is_public`: 是否公开
- `created_at`: 创建时间

**索引**:
- `user_id`: 索引
- `meeting_id`: 索引
- `storage_key`: 唯一索引

---

### 6. 分享表 (shares)

存储会议分享信息。

**字段说明**:
- `id`: 主键，自增
- `meeting_id`: 会议ID（外键）
- `user_id`: 创建者ID（外键）
- `token`: 分享令牌（唯一索引）
- `password`: 访问密码（加密）
- `expires_at`: 过期时间
- `access_count`: 访问次数
- `max_access`: 最大访问次数
- `is_active`: 是否激活
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `token`: 唯一索引
- `meeting_id`: 索引
- `user_id`: 索引

---

### 7. 用户统计表 (user_stats)

存储用户统计数据。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键，唯一）
- `total_meetings`: 总会议数
- `total_duration`: 总录音时长（秒）
- `total_storage`: 总存储空间（字节）
- `last_meeting_at`: 最后会议时间
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `user_id`: 唯一索引
- `last_meeting_at`: 索引

---

### 8. 会议统计表 (meeting_stats)

存储会议统计数据。

**字段说明**:
- `id`: 主键，自增
- `meeting_id`: 会议ID（外键，唯一）
- `user_id`: 用户ID（外键）
- `transcript_count`: 转写条数
- `transcript_length`: 转写总长度（字符数）
- `keyword_count`: 关键词数量
- `todo_count`: 待办事项数量
- `completed_todo_count`: 已完成待办数量
- `speaker_count`: 发言人数
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `meeting_id`: 唯一索引
- `user_id`: 索引

---

### 9. 系统日志表 (system_logs)

存储系统操作日志。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键，可为空）
- `action`: 操作类型
- `resource_type`: 资源类型
- `resource_id`: 资源ID
- `ip_address`: IP地址
- `user_agent`: 用户代理
- `details`: 详细信息（JSON）
- `created_at`: 创建时间

**索引**:
- `user_id`: 索引
- `action`: 索引
- `resource_type`: 索引
- `created_at`: 索引

---

### 10. 订阅记录表 (subscriptions)

存储订阅和支付记录。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键）
- `plan_type`: 计划类型（free/pro）
- `provider`: 支付提供商
- `transaction_id`: 交易ID
- `amount`: 金额
- `currency`: 货币
- `status`: 状态（pending/success/failed/refunded）
- `start_date`: 开始时间
- `end_date`: 结束时间
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `user_id`: 索引
- `status`: 索引
- `end_date`: 索引
- `transaction_id`: 索引

---

### 11. API调用记录表 (api_calls)

存储第三方API调用记录（用于限流和统计）。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键，可为空）
- `api_type`: API类型（nls/dashscope）
- `endpoint`: API端点
- `method`: HTTP方法
- `status_code`: 状态码
- `response_time`: 响应时间（毫秒）
- `cost`: 调用成本
- `error_message`: 错误信息
- `created_at`: 创建时间

**索引**:
- `user_id`: 索引
- `api_type`: 索引
- `status_code`: 索引
- `created_at`: 索引

---

### 12. 文件统计表 (file_stats)

存储文件统计数据。

**字段说明**:
- `id`: 主键，自增
- `user_id`: 用户ID（外键，唯一）
- `total_files`: 总文件数
- `total_size`: 总文件大小（字节）
- `audio_files`: 音频文件数
- `audio_size`: 音频文件大小（字节）
- `created_at`: 创建时间
- `updated_at`: 更新时间

**索引**:
- `user_id`: 唯一索引

---

## Redis 数据结构设计

### 1. 用户会话 (Session)

```
Key: session:{token}
Value: { userId, expiresAt }
TTL: 7天
```

### 2. Token黑名单 (Token Blacklist)

```
Key: blacklist:{token}
Value: "1"
TTL: 根据token过期时间设置
```

### 3. 会议实时数据 (Meeting Real-time Data)

```
Key: meeting:{meetingId}:transcript
Type: List
存储最新的转写内容（最多100条）
```

### 4. 用户限流 (Rate Limiting)

```
Key: rate_limit:{userId}:{action}
Value: 调用次数
TTL: 1小时
```

### 5. 缓存会议数据 (Cached Meeting Data)

```
Key: cache:meeting:{meetingId}
Value: JSON格式的会议数据
TTL: 1小时
```

---

## 数据库关系图

```
users
  ├── meetings (1:N)
  │   └── transcripts (1:N)
  ├── tags (1:N)
  ├── files (1:N)
  └── shares (1:N)

user_stats (1:1 with users)
meeting_stats (1:1 with meetings)
subscriptions (1:N with users)
system_logs (N:1 with users)
api_calls (N:1 with users)
file_stats (1:1 with users)
```

---

## 索引优化建议

### MySQL 索引

1. **用户表**:
   - `email`: 唯一索引（用于登录查询）
   - `phone`: 唯一索引（用于手机号登录）
   - `subscription`: 普通索引（用于查询Pro用户）

2. **会议表**:
   - `user_id + created_at`: 复合索引（降序，用于列表查询）
   - `user_id + status`: 复合索引（用于状态筛选）
   - `share_token`: 唯一索引（用于分享链接查询）

3. **转写表**:
   - `meeting_id + timestamp`: 复合索引（用于按时间排序）

4. **文件表**:
   - `user_id`: 索引（用于查询用户文件）
   - `meeting_id`: 索引（用于查询会议文件）

---

## 数据备份策略

1. **MySQL**: 每日全量备份 + 每小时增量备份
2. **Redis**: 持久化配置（AOF + RDB）
3. **文件存储**: MinIO/S3 自动版本控制

---

## JSON字段说明

### users.settings
```json
{
  "language": "zh-CN",
  "theme": "auto",
  "notifications": true
}
```

### meetings.summary
```json
{
  "keywords": ["关键词1", "关键词2"],
  "summary": "会议摘要",
  "todos": [
    {
      "text": "待办事项",
      "assignee": "负责人",
      "dueDate": "2024-01-01",
      "completed": false,
      "priority": "medium"
    }
  ],
  "actionItems": ["行动项1", "行动项2"],
  "decisions": ["决策1", "决策2"],
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

### meetings.tags
```json
["标签1", "标签2", "标签3"]
```

### meetings.speakers
```json
[
  {
    "id": "speaker1",
    "name": "发言人1",
    "color": "#6366f1",
    "avatar": "头像URL"
  }
]
```

### meetings.participants
```json
[
  {
    "userId": "123",
    "name": "参与者1",
    "role": "主持人"
  }
]
```
