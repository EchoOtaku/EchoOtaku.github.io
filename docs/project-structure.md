# 项目结构说明

## 概览

EchoOtakuBlog 基于 Nuxt 4 构建，采用 **app 目录模式**（Nuxt 4 默认将应用代码置于 `app/` 下），与服务端代码和内容目录彻底分离，职责清晰，便于未来扩展。

---

## 目标目录结构

```
EchoOtakuBlog/
├── app/                            # 应用核心代码（Nuxt 4 app 目录）
│   ├── assets/                     # 静态资源（会被 Vite 处理）
│   │   └── css/
│   │       └── main.css            # 全局样式 / Tailwind 入口
│   ├── components/                 # Vue 组件（三层架构）
│   │   ├── ui/                     # 原子层：无业务逻辑，纯展示
│   │   │   ├── UiButton.vue
│   │   │   ├── UiTag.vue
│   │   │   └── UiCard.vue
│   │   ├── blog/                   # 业务层：博客相关组件
│   │   │   ├── BlogPostCard.vue
│   │   │   ├── BlogPostList.vue
│   │   │   └── BlogToc.vue         # 文章目录（Table of Contents）
│   │   └── app/                    # 应用层：全局顶层组件
│   │       ├── AppHeader.vue
│   │       ├── AppFooter.vue
│   │       └── AppThemeToggle.vue
│   ├── composables/                # 可复用 Composition API 逻辑
│   │   ├── usePosts.ts             # 文章查询、筛选、分页
│   │   └── useTheme.ts             # 主题控制（配合 @nuxtjs/color-mode）
│   ├── layouts/                    # 页面布局
│   │   ├── default.vue             # 通用布局（含 Header / Footer）
│   │   └── blog.vue                # 文章详情布局（含侧边 TOC）
│   ├── pages/                      # 路由页面（基于文件系统自动路由）
│   │   ├── index.vue               # 首页
│   │   ├── blog/
│   │   │   ├── index.vue           # 文章列表页
│   │   │   └── [...slug].vue       # 文章详情页（动态路由）
│   │   ├── tags/
│   │   │   └── [tag].vue           # 标签筛选页
│   │   └── about.vue               # 关于页
│   ├── plugins/                    # Nuxt 插件（按需添加）
│   └── app.vue                     # 根组件
├── content/                        # @nuxt/content 内容目录
│   ├── blog/                       # 博客文章（Markdown）
│   │   └── hello-world.md
│   └── about.md                    # 关于页内容
├── docs/                           # 项目文档（不会被打包进站点）
│   ├── git-commit-convention.md
│   └── project-structure.md
├── public/                         # 纯静态文件（直接映射到根路径）
│   ├── favicon.ico
│   └── images/                     # 文章配图等静态图片
├── server/                         # 服务端代码（Phase 3 启用）
│   └── api/                        # API 路由（自动注册）
├── nuxt.config.ts                  # Nuxt 配置
├── tailwind.config.ts              # Tailwind 自定义配置（按需创建）
├── tsconfig.json                   # TypeScript 配置
├── package.json
└── pnpm-workspace.yaml
```

---

## 目录职责说明

### `app/components/` — 三层组件架构

采用分层设计，避免组件职责混乱，方便维护：

| 层级   | 目录                  | 原则                                 |
|--------|-----------------------|--------------------------------------|
| 原子层 | `components/ui/`      | 无业务逻辑，纯展示，可跨项目复用     |
| 业务层 | `components/blog/`    | 包含博客业务逻辑，不跨域复用         |
| 应用层 | `components/app/`     | 全局唯一的顶层组件，如导航栏、页脚   |

组件命名采用**多词前缀**（`UiButton`、`BlogPostCard`、`AppHeader`），避免与 HTML 原生标签冲突，符合 Vue 官方风格指南。

Nuxt 会自动扫描 `components/` 下所有子目录，无需手动 `import`。

### `app/composables/` — 逻辑复用

所有跨组件共享的状态和逻辑抽取到 composable，文件名以 `use` 开头。Nuxt 自动导入 `composables/` 下所有文件，无需手动 `import`。

### `content/` — Markdown 内容

由 `@nuxt/content` 管理。每篇文章在文件顶部使用 **Frontmatter** 定义元数据：

```md
---
title: '文章标题'
description: '文章描述（用于 SEO meta）'
date: 2026-03-19
tags: ['Vue', 'Nuxt', '前端']
cover: '/images/cover.jpg'
draft: false
---

正文内容从这里开始...
```

`@nuxt/content` 会自动解析这些字段，并提供 `queryCollection()` API 进行查询。

### `server/` — 服务端（Phase 3）

Nuxt 内置 [Nitro](https://nitro.build/) 服务器。`server/api/` 下的文件自动成为 API 路由：

```
server/api/comments.get.ts  →  GET /api/comments
server/api/comments.post.ts →  POST /api/comments
```

Phase 3 接入后端时启用，无需引入额外框架。

---

## 开发路线图

### Phase 1 — 静态博客（当前阶段）

**目标**：用最简单的方式让博客完整跑起来。

- [ ] 配置 `nuxt.config.ts`：注册所有已安装 modules，开启代码高亮
- [ ] 创建 `app/assets/css/main.css`：引入 Tailwind，定义 CSS 变量
- [ ] 实现 `app/layouts/default.vue`：Header（导航 + 主题切换）+ Footer
- [ ] 将 `app/app.vue` 改为使用 `<NuxtLayout>` 和 `<NuxtPage>`
- [ ] 实现首页 `app/pages/index.vue`：最新文章列表 + 个人简介
- [ ] 实现文章列表页 `app/pages/blog/index.vue`：支持分页
- [ ] 实现文章详情页 `app/pages/blog/[...slug].vue`：Markdown 渲染 + TOC
- [ ] 实现标签筛选页 `app/pages/tags/[tag].vue`
- [ ] 实现关于页 `app/pages/about.vue`
- [ ] 在 `content/blog/` 写第一篇文章 🎉

**技术选型**：

| 需求         | 方案                       | 说明                                   |
|--------------|----------------------------|----------------------------------------|
| 样式         | Tailwind CSS               | utility-first，无需维护大量 CSS 文件   |
| 暗色模式     | `@nuxtjs/color-mode`       | 自动检测系统偏好，持久化到 localStorage |
| 内容管理     | `@nuxt/content` v3         | 基于 SQLite，构建时生成静态数据        |
| 图标         | `@nuxt/icon`               | 按需加载，支持 Iconify 所有图标集      |

### Phase 2 — 体验增强

**目标**：提升 SEO 和用户体验，让博客「看起来像回事」。

- [ ] SEO：配置 `useSeoMeta` / `useHead`，添加 Open Graph 和 Twitter Card
- [ ] SEO：启用 `@nuxtjs/sitemap` 自动生成 sitemap.xml
- [ ] 搜索：基于 `@nuxt/content` 的全文检索
- [ ] RSS：生成 RSS / Atom feed
- [ ] 阅读体验：代码块一键复制、阅读进度条、返回顶部按钮
- [ ] 动画：页面切换过渡动画（Vue `<Transition>`）
- [ ] 性能：图片懒加载，关键 CSS 内联

### Phase 3 — 后端接入

**目标**：将静态博客升级为支持动态功能的个人系统。

- [ ] 数据库：集成 Drizzle ORM + SQLite（开发）/ PostgreSQL（生产）
- [ ] 鉴权：实现管理员登录（JWT 或 `nuxt-auth-utils`）
- [ ] 评论系统：自建评论 API，替代第三方（Disqus、Giscus）
- [ ] CMS：在线编辑文章（Markdown 编辑器 + 草稿/发布工作流）
- [ ] 统计：访问量、阅读时长统计（自建，保护用户隐私）
- [ ] 邮件订阅：新文章通知

---

## 关键架构决策

### 为什么使用 Nuxt 4 的 `app/` 目录？

Nuxt 4 将所有应用代码迁移至 `app/`，与服务端代码（`server/`）和内容（`content/`）彻底分离，职责更清晰。这是官方推荐的新项目结构，面向未来。

### 静态生成 vs 服务端渲染

| 阶段         | 命令              | 部署方式                          | 成本     |
|--------------|-------------------|-----------------------------------|----------|
| Phase 1–2    | `pnpm generate`   | CDN / GitHub Pages / Vercel       | 零成本   |
| Phase 3      | `pnpm build`      | Node.js 服务器 / Vercel Functions | 按需付费 |

### `@nuxt/content` v3 查询 API

v3 使用 `queryCollection()` API（**注意**：已替代 v2 的 `queryContent()`）：

```ts
// composables/usePosts.ts
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(10)
    .all()
)
```

构建时生成静态 JSON，运行时直接读取，性能与纯静态方案相当。

---

## 立即可以做的 5 件事

1. **配置 `nuxt.config.ts`**：注册 `@nuxt/content`、`@nuxtjs/tailwindcss`、`@nuxtjs/color-mode`、`@nuxt/icon`
2. **创建 `app/assets/css/main.css`**：完成 Tailwind 初始化，定义主题 CSS 变量
3. **修改 `app/app.vue`**：替换 `<NuxtWelcome />` 为 `<NuxtLayout><NuxtPage /></NuxtLayout>`
4. **实现 `app/layouts/default.vue`**：搭建基础视觉骨架（Header + Footer）
5. **在 `content/blog/` 创建第一篇文章**：验证 `@nuxt/content` 工作正常，然后实现文章详情页
