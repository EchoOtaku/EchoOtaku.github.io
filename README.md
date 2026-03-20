# EchoOtakuBlog

> 一个基于 Nuxt 4 构建的个人博客，记录技术探索与二次元感悟。

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-10-F69220?style=flat-square&logo=pnpm&logoColor=white)

**在线访问**：[echotaku.github.io](https://echotaku.github.io)

---

## 项目介绍

EchoOtakuBlog 是一个**静态优先、可扩展**的个人博客，从纯静态站点起步，逐步演进为完整的内容平台：

| 阶段 | 状态 | 内容 |
|------|------|------|
| Phase 1 | ✅ 已完成 | 静态博客：布局、文章、标签、暗色模式、闪屏动画 |
| Phase 2 | ✅ 已完成 | SEO（robots、sitemap、Schema.org、OG meta）、UI 美化 |
| Phase 3 | 🔜 计划中 | 后端接入（Drizzle ORM、评论、CMS、统计） |

---

## 技术栈

| 层级   | 技术                                                              | 说明                          |
| ------ | ----------------------------------------------------------------- | ----------------------------- |
| 框架   | [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/)        | 全栈框架，支持 SSG / SSR     |
| 样式   | [Tailwind CSS v4](https://tailwindcss.com/) + OKLCH 色彩          | CSS-first 配置，`@theme` token |
| 字体   | [Syne](https://fonts.google.com/specimen/Syne) + [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) | Display + 中文正文 |
| 内容   | [@nuxt/content v3](https://content.nuxt.com/)                    | Markdown 驱动，SQLite 查询    |
| SEO    | [@nuxtjs/seo](https://nuxtseo.com/)                              | robots、sitemap、OG image、Schema.org |
| 图标   | [@nuxt/icon](https://icon.nuxt.com/)                             | Iconify Lucide 图标集         |
| 主题   | [@nuxtjs/color-mode](https://color-mode.nuxtjs.org/)             | Class-based 暗色模式          |
| 包管理 | [pnpm](https://pnpm.io/)                                         | 严格依赖管理                  |
| 部署   | [GitHub Pages](https://pages.github.com/) + GitHub Actions        | 自动 SSG 部署                 |

---

## 功能特性

### 已实现

- Nuxt 4 `app/` 目录架构 + 三层组件体系（ui / blog / app）
- Markdown 文章写作与渲染（代码语法高亮 github-light / github-dark）
- 文章列表、详情、标签筛选（支持中文标签）
- 亮色 / 暗色主题切换
- Canvas 六角网格闪屏动画（支持 `prefers-reduced-motion`）
- 渐变 Loading 进度条
- 阅读进度条 + 返回顶部按钮
- 页面过渡动画（`out-in` 模式）
- SEO：robots.txt、sitemap.xml、Schema.org JSON-LD、Open Graph meta
- Tailwind CSS v4：CSS-first `@theme` token、OKLCH 色彩、自定义滚动条
- GitHub Pages 自动部署（push to main 触发）

### 计划中（Phase 3）

- 后端接入（Drizzle ORM + SQLite/PostgreSQL）
- 管理员登录与在线 CMS
- 评论系统
- 访问量与阅读时长统计
- RSS / Atom Feed
- 全文搜索

---

## 目录结构

```
EchoOtakuBlog/
├── app/
│   ├── assets/css/        # Tailwind v4 入口 + 设计 token
│   ├── components/
│   │   ├── app/           # 全局组件：Header、Footer、Splash、ThemeToggle
│   │   ├── blog/          # 博客组件：PostCard
│   │   └── ui/            # 原子组件：BackToTop、ReadingProgress
│   ├── composables/       # 可复用逻辑：useIsDark
│   ├── layouts/           # 页面布局：default
│   └── pages/             # 路由页面：index、blog、tags、about
├── content/blog/          # Markdown 文章
├── docs/                  # 项目文档
├── public/                # 静态资源（favicon、OG image）
├── .github/workflows/     # GitHub Actions 部署
├── content.config.ts      # 内容集合定义
└── nuxt.config.ts         # Nuxt 配置
```

详细说明见 [docs/project-structure.md](./docs/project-structure.md)。

---

## 快速开始

### 环境要求

- Node.js >= 20.x
- pnpm >= 9.x

### 安装与运行

```bash
pnpm install
pnpm dev          # 开发服务器 → http://localhost:3000
pnpm generate     # 静态站点生成 → .output/public/
pnpm preview      # 预览生产构建
```

---

## 部署

当前使用 **GitHub Pages + GitHub Actions** 自动部署：

- 推送到 `main` 分支自动触发 `pnpm generate` → 部署到 GitHub Pages
- SPA fallback：复制 `200.html` → `404.html` 确保客户端路由正常
- 配置详见 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

Phase 3 后端功能需切换至 Node.js 宿主（Vercel / Railway）。

---

## 文档

| 文档 | 说明 |
|------|------|
| [docs/blog-setup-guide.md](./docs/blog-setup-guide.md) | 从零搭建完整流程（可供 Agent 自动化复刻） |
| [docs/project-structure.md](./docs/project-structure.md) | 项目架构与路线图 |
| [docs/git-commit-convention.md](./docs/git-commit-convention.md) | Git 提交规范 |

---

## License

[MIT](./LICENSE) © 2026 EchoOtaku
