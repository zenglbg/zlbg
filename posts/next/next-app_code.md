---
title: Next.js 应用程序常见代码架构
description: 本文详细介绍了 Next.js 应用程序的代码架构，包括目录结构、App Router、数据获取、状态管理等核心概念
date: 2024-01-01
tags: ['Next.js', '前端架构', 'React']
---']
---


# Next.js 应用程序常见代码架构

## 1. 基础目录结构
Next.js 应用程序的基础目录结构通常包含以下关键目录和文件：

```jsx
my-nextjs-app/
├── app/                  # App Router 目录结构
│   ├── layout.js         # 根布局组件
│   ├── page.js           # 首页组件
│   └── [...]/            # 其他路由目录
├── public/               # 静态资源目录
│   ├── images/           # 图片资源
│   └── fonts/            # 字体资源
├── components/           # 可复用组件
│   ├── ui/               # UI 组件
│   └── layout/           # 布局组件
├── lib/                  # 工具函数和库
├── styles/               # 样式文件
├── next.config.js        # Next.js 配置文件
├── package.json          # 项目依赖
└── .env.local            # 环境变量
```


## 2. App Router 架构
Next.js 13+ 引入的 App Router 架构采用了基于文件系统的路由方式，主要特点包括：

### 2.1 特殊文件
- page.js : 定义路由的 UI，并使路由可公开访问
- layout.js : 定义共享 UI，适用于多个页面
- loading.js : 创建加载 UI
- error.js : 创建错误 UI
- not-found.js : 创建 404 UI
- route.js : 创建服务器端 API 端点
### 2.2 路由分组和嵌套

Next.js App Router 支持多种路由组织方式：

#### 路由分组
使用括号命名的文件夹 (folderName) 创建路由分组，这些文件夹不会影响 URL 路径：
App Router 支持多种路由组织方式：
 路由分组
使用括号命名的文件夹 (folderName) 创建路由分组，这些文件夹不会影响 URL 路径：
## 3. 数据获取模式


### 3.1 服务器组件数据获取
### 3.1 服务器组件数据获取
### 3.2 客户端组件数据获取
## 4. 状态管理
### 4.1 使用 Context API
### 4.2 使用 Zustand
## 5. API 路由
### 5.1 Route Handlers
## 6. 认证模式
### 6.1 使用 NextAuth.js
## 7. 国际化 (i18n)
## 8. 性能优化
### 8.1 图片优化
### 8.2 字体优化
## 9. 部署策略
### 9.1 Vercel 部署
### 9.2 Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
 ```