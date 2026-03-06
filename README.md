# 薯条菌网站（Astro）

一个使用 Astro 构建的静态网站，包含三大栏目：

- 原味薯条
- 蕃茄酱
- 海鸥看过

网站已接入云端互动（点赞 + 评论）：

- 用户先登记 `用户名 + 联系邮箱`
- 点赞与评论数据写入 Supabase
- 评论区邮箱默认脱敏显示

## 本地开发

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

## 互动功能配置（Supabase）

1. 在 Supabase 新建项目。
2. 打开 SQL Editor，执行 [`supabase/engagement.sql`](./supabase/engagement.sql)。
3. 复制 `.env.example` 为 `.env`，填入：

```bash
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. 重新构建并部署。

如果未配置这两个环境变量，页面会显示“互动云端未配置”，并自动禁用点赞/评论按钮。

## 技术栈

- Astro 5
- Content Collections
- Supabase REST API（无后端服务，纯静态站可用）
