---
title: Next.js App Router 和 Pages Router 的区别
date: 2024-03-14
desc: 深入对比 Next.js 中 App Router 和 Pages Router 的主要区别，包括文件结构、组件类型、数据获取、渲染性能、路由处理等多个方面的详细分析
---

# Next.js 中 App Router 和 Pages Router 的区别

Next.js 13 引入了全新的 App Router，它与传统的 Pages Router 有很大的区别。让我们来详细了解这两种路由方式的主要区别:

## 1. 文件夹结构

### Pages Router
- 使用 `/pages` 目录
- 文件即路由，如 `/pages/about.js` 对应 `/about` 路由
- 特殊文件: `_app.js`, `_document.js`

### App Router
- 使用 `/app` 目录
- 需要使用 `page.js` 作为路由文件
- 支持更多特殊文件: `layout.js`, `loading.js`, `error.js` 等

## 2. 组件类型

### Pages Router
- 默认所有组件都是客户端组件
- 需要手动添加 getServerSideProps/getStaticProps 实现服务端渲染

### App Router
- 默认所有组件都是服务端组件
- 使用 'use client' 指令将组件标记为客户端组件
- 更好的服务端渲染支持

## 3. 数据获取

### Pages Router
- 使用 getServerSideProps 进行服务端数据获取
- 使用 getStaticProps 进行构建时数据获取
- 数据获取方法需要导出为异步函数

### App Router
- 组件可以直接使用 async/await 获取数据
- 提供了新的数据获取函数如 fetch() 
- 支持并行数据请求
- 内置的数据缓存和重新验证机制

## 4. 渲染和性能

### Pages Router
- 页面级别的渲染
- 客户端路由跳转
- 需要手动优化性能

### App Router
- 支持局部渲染
- 支持流式渲染(Streaming)
- 自动代码分割
- 更好的性能优化默认配置

## 5. 路由处理

### Pages Router
- 基于文件系统的简单路由
- 动态路由使用 `[param]` 语法
- 通过 `next/router` 进行路由操作

### App Router
- 更灵活的路由分组
- 支持平行路由和拦截路由
- 通过 `next/navigation` 进行路由操作
- 支持路由处理器(Route Handlers)

## 6. 状态管理和中间件

### Pages Router
- 全局状态通常依赖第三方库
- 中间件功能相对有限

### App Router
- 内置的服务器组件状态管理
- 更强大的中间件支持
- 更好的缓存控制

## 7. SEO 和元数据

### Pages Router
- 使用 `next/head` 管理头部信息
- 需要手动处理元数据

### App Router
- 新的 Metadata API
- 支持动态和静态元数据
- 更简单的 SEO 优化方案

## 总结

App Router 代表了 Next.js 的未来发展方向，它提供了更现代化的开发体验和更好的性能优化。虽然 Pages Router 仍然被支持，但对于新项目，建议使用 App Router 来获得更好的开发体验和性能优势。
