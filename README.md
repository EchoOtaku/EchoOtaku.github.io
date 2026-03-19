# EchoOtakuBlog

> 一个基于 Nuxt 4 构建的个人博客，记录技术探索与二次元感悟。

![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)

---

## 项目介绍

EchoOtakuBlog 是一个**高度可扩展**的个人博客系统，从静态博客起步，逐步演进为完整的个人内容平台：

- **Phase 1**：纯静态博客，零服务器成本，部署于 CDN
- **Phase 2**：SEO 优化、全文搜索、RSS 订阅
- **Phase 3**：后端接入，支持在线写作、评论、数据统计

---

## 技术栈

| 层级     | 技术                                                                  | 说明                              |
|----------|-----------------------------------------------------------------------|-----------------------------------|
| 框架     | [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/)            | 全栈框架，支持 SSG / SSR          |
| 样式     | [Tailwind CSS](https://tailwindcss.com/)                             | Utility-first CSS 框架            |
| 内容     | [@nuxt/content](https://content.nuxt.com/)                           | Markdown 驱动的内容管理           |
| 图标     | [@nuxt/icon](https://icon.nuxt.com/)                                 | 基于 Iconify，按需加载            |
| 主题     | [@nuxtjs/color-mode](https://color-mode.nuxtjs.org/)                 | 暗色 / 亮色模式切换               |
| 包管理   | [pnpm](https://pnpm.io/)                                             | 高效磁盘占用，严格依赖            |
| 语言     | TypeScript                                                            | 全项目类型安全                    |

---

## 功能特性

### 已实现

- Nuxt 4 app 目录架构

### 开发中（Phase 1）

- Markdown 文章写作与渲染
- 文章列表、详情、标签筛选
- 响应式布局（移动端适配）
- 亮色 / 暗色主题切换
- 代码块语法高亮

### 计划中（Phase 2）

- SEO 优化（Open Graph、sitemap、robots.txt）
- 全文搜索
- RSS / Atom Feed
- 页面过渡动画
- 阅读进度条、代码一键复制

### 远期规划（Phase 3）

- 管理员登录与在线 CMS
- 自建评论系统
- 访问量与阅读时长统计

---

## 目录结构

```
EchoOtakuBlog/
├── app/
│   ├── assets/          # 全局样式（Tailwind 入口）
│   ├── components/      # 三层组件：ui / blog / app
│   ├── composables/     # 可复用逻辑（usePosts 等）
│   ├── layouts/         # 页面布局（default / blog）
│   └── pages/           # 路由页面（index、blog、tags、about）
├── content/             # Markdown 文章（@nuxt/content）
├── docs/                # 项目文档
├── public/              # 静态资源
└── server/              # API 路由（Phase 3）
```

详细说明见 [docs/project-structure.md](./docs/project-structure.md)。

---

## 快速开始

### 环境要求

- Node.js >= 20.x
- pnpm >= 9.x

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建

```bash
# 静态站点生成（Phase 1-2，部署至 CDN）
pnpm generate

# SSR 构建（Phase 3，需要 Node.js 服务器）
pnpm build

# 预览生产构建
pnpm preview
```

---

## 部署

### 静态部署（推荐 Phase 1-2）

运行 `pnpm generate` 后，将 `.output/public/` 部署至任意静态托管平台：

- **Vercel**：连接 GitHub 仓库，自动检测 Nuxt，零配置部署
- **Netlify**：Build command `pnpm generate`，Publish directory `.output/public`
- **GitHub Pages**：配合 GitHub Actions 自动触发生成并发布

### SSR 部署（Phase 3）

```bash
NITRO_PRESET=vercel pnpm build
```

Nitro 会生成适配目标平台的产物，支持 Vercel / Netlify / Node.js 服务器等。

---

## 开发规范

- Git commit 规范见 [docs/git-commit-convention.md](./docs/git-commit-convention.md)
- 项目架构说明见 [docs/project-structure.md](./docs/project-structure.md)

---

## License

[MIT](./LICENSE) © 2026 EchoOtaku
