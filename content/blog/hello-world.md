---
title: '你好，世界'
description: '这是 EchoOtakuBlog 的第一篇文章，记录博客从零开始的故事。'
date: 2026-03-19
tags: ['随笔', 'Nuxt', '开始']
draft: false
---

## 博客诞生

终于，EchoOtakuBlog 上线了。

这个博客使用 [Nuxt 4](https://nuxt.com/) 构建，搭配 `@nuxt/content` 用 Markdown 写文章，从一个完全静态的站点起步，后续会逐步加入更多功能。

## 为什么要写博客？

写博客是一种很好的学习方式。把自己理解的东西写出来，才知道自己真正懂了多少。

> 费曼技巧：用简单的话解释复杂的概念，是检验理解深度的最好方式。

输出倒逼输入，这是我开始写博客最主要的原因。

## 技术选型

这个博客的核心是 Nuxt 4 + Nuxt Content。选择它们的原因：

- **文件路由**：基于文件系统，不需要手动配置路由
- **Markdown 支持**：直接用 `.md` 文件写文章，简单直接
- **全栈能力**：从静态站点到 SSR，切换成本极低
- **TypeScript 原生**：类型安全贯穿整个项目

## 代码示例

用 `queryCollection` 查询最新文章只需几行：

```typescript
const posts = await queryCollection('blog')
  .where('draft', '=', false)
  .order('date', 'DESC')
  .limit(5)
  .all()
```

## 下一步计划

- [ ] 添加标签筛选页
- [ ] 优化文章页排版（目录、阅读进度）
- [ ] SEO 配置
- [ ] 部署到 Vercel

希望这个博客能持续更新 🎉
