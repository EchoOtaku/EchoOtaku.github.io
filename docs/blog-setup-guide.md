# EchoOtakuBlog 自动化搭建指南

> 本文档记录了从 `pnpm create nuxt` 到 GitHub Pages 部署的完整流程。
> 目标读者：AI Agent / 开发者，按步骤执行即可复刻整个博客。

---

## 目录

1. [环境要求](#1-环境要求)
2. [项目初始化](#2-项目初始化)
3. [安装依赖](#3-安装依赖)
4. [项目结构搭建](#4-项目结构搭建)
5. [配置文件](#5-配置文件)
6. [样式系统](#6-样式系统tailwind-css-v4)
7. [布局与根组件](#7-布局与根组件)
8. [应用组件](#8-应用组件app-层)
9. [UI 组件](#9-ui-组件)
10. [业务组件](#10-业务组件blog-层)
11. [Composables](#11-composables)
12. [页面](#12-页面)
13. [内容系统](#13-内容系统)
14. [公共资源](#14-公共资源public)
15. [SEO 配置](#15-seo-配置)
16. [GitHub Actions 部署](#16-github-actions-部署)
17. [Git 提交规范](#17-git-提交规范)
18. [构建与验证](#18-构建与验证)
19. [已知问题与解决方案](#19-已知问题与解决方案)

---

## 1. 环境要求

| 工具   | 版本要求  | 用途             |
| ------ | --------- | ---------------- |
| Node.js | >= 20.x  | 运行时           |
| pnpm   | >= 9.x    | 包管理器         |
| Git    | 任意      | 版本控制         |

```bash
# 验证环境
node --version   # v20+ / v22+ / v24+
pnpm --version   # 9+ / 10+
```

---

## 2. 项目初始化

```bash
pnpm create nuxt EchoOtakuBlog
cd EchoOtakuBlog
git init
```

> Nuxt 4 脚手架会生成默认的 `app.vue`、`nuxt.config.ts`、`tsconfig.json`、`package.json`、`.gitignore`。
> 后续步骤会替换大部分默认内容。

---

## 3. 安装依赖

### 3.1 核心依赖

```bash
pnpm add @nuxt/content @nuxt/icon @nuxtjs/color-mode @nuxtjs/seo
```

### 3.2 开发依赖（Tailwind CSS v4 + 代码高亮 + SQLite）

```bash
pnpm add -D tailwindcss@^4 @tailwindcss/vite@^4 @tailwindcss/typography better-sqlite3 @types/better-sqlite3 @iconify-json/lucide
```

### 3.3 pnpm-workspace.yaml

创建 `pnpm-workspace.yaml`，允许原生编译依赖：

```yaml
onlyBuiltDependencies:
  - '@parcel/watcher'
  - better-sqlite3
  - esbuild
```

> **关键**：`better-sqlite3` 是 `@nuxt/content` v3 的 SQLite 适配器所需，必须加入 `onlyBuiltDependencies`。

### 3.4 最终 package.json

```json
{
  "name": "EchoOtakuBlog",
  "type": "module",
  "private": true,
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@nuxt/content": "3.12.0",
    "@nuxt/icon": "2.2.1",
    "@nuxtjs/color-mode": "4.0.0",
    "@nuxtjs/seo": "^4.0.2",
    "nuxt": "^4.4.2",
    "vue": "^3.5.30",
    "vue-router": "^5.0.3"
  },
  "devDependencies": {
    "@iconify-json/lucide": "^1.2.98",
    "@tailwindcss/typography": "^0.5.19",
    "@tailwindcss/vite": "^4.2.2",
    "@types/better-sqlite3": "^7.6.13",
    "better-sqlite3": "^12.8.0",
    "tailwindcss": "^4.2.2"
  }
}
```

---

## 4. 项目结构搭建

创建以下目录结构（Nuxt 4 `app/` 约定）：

```
EchoOtakuBlog/
├── .github/workflows/         # CI/CD
├── app/
│   ├── assets/css/            # 全局样式
│   ├── components/
│   │   ├── app/               # 应用级组件（Header、Footer、Splash、ThemeToggle）
│   │   ├── blog/              # 博客业务组件（PostCard）
│   │   └── ui/                # 原子 UI 组件（BackToTop、ReadingProgress）
│   ├── composables/           # 可复用逻辑
│   ├── layouts/               # 页面布局
│   └── pages/                 # 路由页面
│       ├── blog/              # 文章列表 + 详情
│       └── tags/              # 标签筛选
├── content/
│   └── blog/                  # Markdown 文章
├── docs/                      # 项目文档
├── public/                    # 静态资源
├── content.config.ts          # 内容集合定义
├── nuxt.config.ts             # Nuxt 配置
├── pnpm-workspace.yaml
└── tsconfig.json
```

### 三层组件架构

| 层级     | 目录                      | 前缀    | 职责               |
| -------- | ------------------------- | ------- | ------------------ |
| Atomic   | `app/components/ui/`      | `Ui*`   | 纯展示，无业务逻辑 |
| Business | `app/components/blog/`    | `Blog*` | 博客特定逻辑       |
| App      | `app/components/app/`     | `App*`  | 全局单例（页头、页脚、闪屏） |

> 所有组件由 Nuxt 自动导入，无需手动 import。

---

## 5. 配置文件

### 5.1 nuxt.config.ts

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/seo',      // 必须在 @nuxt/content 之前
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  // ——— 站点基础信息 ———
  site: {
    url: 'https://echotaku.github.io',
    name: 'EchoOtakuBlog',
    description: '记录技术探索与二次元感悟的个人博客',
    defaultLocale: 'zh-CN',
  },

  // ——— Schema.org 个人身份 ———
  schemaOrg: {
    identity: {
      '@type': 'Person',
      name: 'EchoOtaku',
      url: 'https://echotaku.github.io',
      sameAs: ['https://github.com/EchoOtaku'],
    },
  },

  // ——— Robots.txt ———
  robots: {
    blockAiBots: true,
  },

  // ——— Sitemap（静态站点模式）———
  sitemap: {
    zeroRuntime: true,
  },

  // ——— OG Image ———
  ogImage: {
    enabled: true,
    zeroRuntime: true,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap',
        },
      ],
    },
  },

  nitro: {
    prerender: {
      failOnError: false,   // 中文 URL 编码问题兜底
    },
  },

  colorMode: {
    classSuffix: '',        // 类名直接用 .dark，不加后缀
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },
})
```

**关键配置说明**：

- `@nuxtjs/seo` 必须在 `@nuxt/content` 之前加载（modules 数组顺序）
- Tailwind CSS v4 不使用 `@nuxtjs/tailwindcss` 模块，改用 `@tailwindcss/vite` 插件
- `colorMode.classSuffix: ''` 让暗色模式类名为 `.dark` 而非 `.dark-mode`
- `nitro.prerender.failOnError: false` 防止中文标签 URL 预渲染时报 500 导致整体构建失败
- `ogImage.zeroRuntime: true` + `sitemap.zeroRuntime: true` 适用于纯静态站点

### 5.2 content.config.ts

```typescript
import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection(asSeoCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()).optional(),
        cover: z.string().optional(),
        draft: z.boolean().default(false),
      }),
    })),
  },
})
```

**注意**：

- `z` 必须从 `@nuxt/content` 导入，不能直接用 `zod`
- `asSeoCollection()` 包装后自动为 sitemap、og-image、schema-org 提供数据
- `type: 'page'` 使文章路径直接映射路由（`/blog/hello-world`）

### 5.3 tsconfig.json

```json
{
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" }
  ]
}
```

### 5.4 .gitignore

```gitignore
# Nuxt dev/build outputs
.output
.data
.nuxt
.nitro
.cache
dist

# Node dependencies
node_modules

# Logs
logs
*.log

# Misc
.DS_Store
.fleet
.idea

# Local env files
.env
.env.*
!.env.example

# AI files
.agents
.claude
skills-lock.json
```

---

## 6. 样式系统（Tailwind CSS v4）

### 6.1 app/assets/css/main.css

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* ===== Dark mode（class-based，匹配 @nuxtjs/color-mode）===== */
@custom-variant dark (&:where(.dark, .dark *));

/* ===== 设计 Token ===== */
@theme {
  /* 字体 */
  --font-display: 'Syne', system-ui, sans-serif;
  --font-sans: 'Noto Sans SC', system-ui, sans-serif;

  /* 主色调：violet（OKLCH 色彩空间）*/
  --color-violet-50:  oklch(97%   0.02  290);
  --color-violet-100: oklch(93%   0.05  290);
  --color-violet-200: oklch(87%   0.09  290);
  --color-violet-300: oklch(79%   0.13  290);
  --color-violet-400: oklch(70%   0.17  290);
  --color-violet-500: oklch(61%   0.22  290);
  --color-violet-600: oklch(52%   0.24  290);
  --color-violet-700: oklch(44%   0.22  290);
  --color-violet-800: oklch(36%   0.18  290);
  --color-violet-900: oklch(28%   0.14  290);
  --color-violet-950: oklch(19%   0.10  290);

  /* 动画 */
  --animate-fade-up: fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  --animate-fade-in: fade-in 0.3s ease-out both;

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}

/* ===== 基础样式 ===== */
@layer base {
  :root {
    --color-bg:      255 255 255;
    --color-surface: 250 250 250;
  }

  .dark {
    --color-bg:      9  9  15;
    --color-surface: 15 15 23;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    font-family: var(--font-sans);
  }

  /* 选中文字颜色 */
  ::selection {
    background-color: oklch(52% 0.24 290 / 20%);
    color: oklch(52% 0.24 290);
  }
  .dark ::selection {
    background-color: oklch(70% 0.17 290 / 25%);
    color: oklch(87% 0.09 290);
  }

  /* 滚动条（webkit）*/
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: oklch(70% 0 0 / 25%);
    border-radius: 3px;
  }
  .dark ::-webkit-scrollbar-thumb {
    background: oklch(40% 0 0 / 40%);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: oklch(52% 0.24 290 / 50%);
  }
}

/* ===== Page Transitions ===== */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* ===== Splash fade-out ===== */
.splash-leave-active  { transition: opacity 0.5s ease; }
.splash-leave-to      { opacity: 0; }
.splash-enter-active  { transition: opacity 0.3s ease; }
.splash-enter-from    { opacity: 0; }

/* ===== Prose 自定义 ===== */
@layer utilities {
  .prose-blog {
    --tw-prose-links: oklch(52% 0.24 290);
    --tw-prose-headings: oklch(15% 0.02 290);
  }
  .dark .prose-blog {
    --tw-prose-links: oklch(70% 0.17 290);
    --tw-prose-headings: oklch(96% 0.01 290);
  }
}
```

**Tailwind v4 关键差异**（对比 v3）：

| v3 做法                           | v4 做法                                          |
| --------------------------------- | ------------------------------------------------ |
| `tailwind.config.ts`              | CSS `@theme` 块                                  |
| `@tailwind base/components/utilities` | `@import "tailwindcss"`                      |
| `darkMode: "class"`              | `@custom-variant dark (&:where(.dark, .dark *))` |
| `require("@tailwindcss/typography")` | `@plugin "@tailwindcss/typography"`           |
| `theme.extend.colors`            | `@theme { --color-*: value }`                    |
| HSL 色值                          | OKLCH 色彩空间（更好的感知均匀性）               |

**不要**创建 `tailwind.config.ts`——v4 完全用 CSS 配置。

---

## 7. 布局与根组件

### 7.1 app/app.vue

```vue
<script setup lang="ts">
const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => { showSplash.value = false }, 2200)
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <Transition
    name="splash"
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <AppSplash v-if="showSplash" />
  </Transition>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

**说明**：
- 首次加载显示 2.2 秒的 Canvas 闪屏动画（`AppSplash`）
- `<NuxtRouteAnnouncer />` 为屏幕阅读器播报路由变化
- 闪屏消失后渲染 `<NuxtLayout>` + `<NuxtPage />`

### 7.2 app/loading.vue

```vue
<script setup lang="ts">
const { progress } = useLoadingIndicator()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-[9998] h-[2px] transition-opacity duration-150"
    :class="progress > 0 ? 'opacity-100' : 'opacity-0'"
  >
    <div
      class="h-full transition-[width] duration-300 ease-out"
      :class="isDark
        ? 'bg-gradient-to-r from-[#4af5ff] via-[#a78bfa] to-[#f472b6]'
        : 'bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]'"
      :style="{ width: `${Math.max(progress, 2)}%` }"
    />
  </div>
</template>
```

**说明**：页面导航时显示的极简渐变进度条，暗色/亮色模式有不同配色。`progress === 0` 时完全隐藏。

### 7.3 app/layouts/default.vue

```vue
<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#09090f] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
    <AppHeader />
    <main class="flex-1 max-w-3xl w-full mx-auto px-6 py-14">
      <slot />
    </main>
    <AppFooter />
    <UiBackToTop />
  </div>
</template>
```

---

## 8. 应用组件（App 层）

### 8.1 app/components/app/AppHeader.vue

```vue
<script setup lang="ts">
const links = [
  { label: '首页', to: '/' },
  { label: '文章', to: '/blog' },
  { label: '关于', to: '/about' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-zinc-100 dark:border-zinc-800/80 bg-white/85 dark:bg-[#09090f]/85 backdrop-blur-md">
    <div class="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="font-display font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        Echo<span class="text-violet-600 dark:text-violet-400">Otaku</span>
      </NuxtLink>

      <nav class="flex items-center gap-0.5">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="relative px-3 py-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          active-class="!text-violet-600 dark:!text-violet-400"
        >
          {{ link.label }}
        </NuxtLink>

        <div class="ml-1 pl-3 border-l border-zinc-100 dark:border-zinc-800">
          <AppThemeToggle />
        </div>
      </nav>
    </div>
  </header>
</template>
```

### 8.2 app/components/app/AppFooter.vue

```vue
<template>
  <footer class="border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
    <div class="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
      <span>© {{ new Date().getFullYear() }} EchoOtaku</span>
      <a
        href="https://github.com/EchoOtaku"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        aria-label="GitHub"
      >
        <Icon name="lucide:github" class="w-3.5 h-3.5" />
        <span>GitHub</span>
      </a>
    </div>
  </footer>
</template>
```

### 8.3 app/components/app/AppThemeToggle.vue

```vue
<script setup lang="ts">
const colorMode = useColorMode()
const isDark = useIsDark()

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    @click="toggle"
    class="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    :aria-label="isDark ? '切换亮色模式' : '切换暗色模式'"
  >
    <Icon v-if="isDark" name="lucide:sun" class="w-5 h-5" />
    <Icon v-else name="lucide:moon" class="w-5 h-5" />
  </button>
</template>
```

### 8.4 app/components/app/AppSplash.vue

这是一个 Canvas 渲染的六角网格闪屏动画，代码较长。核心逻辑：

- 使用 `<canvas>` 绘制全屏六角形网格、流光动画、粒子系统、中心旋转图标
- 亮色/暗色两套配色方案
- 2.2 秒后由 `app.vue` 的 `Transition` 淡出
- 检查 `prefers-reduced-motion` 尊重用户偏好
- 使用 `computed(() => getTheme(isDark.value))` 缓存主题对象，避免每帧重算

```vue
<script setup lang="ts">
const isDark = useIsDark()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const theme = computed(() => getTheme(isDark.value))

// ======= TYPES =======
type Point = { x: number; y: number }
type Edge = { p1: Point; p2: Point; adj: Edge[] }
type Hex = { cx: number; cy: number; pts: Point[]; dist: number }
type Particle = { x: number; y: number; vx: number; vy: number; r: number; maxLife: number; born: number }
type Stream = { hueOff: number; path: Edge[]; t: number; speed: number; streamLen: number }
type RConf = { R: number; GAP: number; STREAMS: number; STREAM_LEN: number; PARTICLE_COUNT: number; ORBITAL_R: number; EMBLEM_R: number }
type Scene = { vw: number; vh: number; cx0: number; cy0: number; hexes: Hex[]; maxDist: number; edges: Edge[]; particles: Particle[]; streams: Stream[]; conf: RConf }
type Theme = {
  gridStroke: string; gridFill: string
  hueBase: number; hueRange: number
  streamSat: number; streamLit: number; coreLit: number; coreSat: number
  ambientC1: [number, number, number]; ambientC2: [number, number, number]
  ambientA1: number; ambientA2: number
  particleHue: number; particleAlpha: number; pulseAlpha: number
  logoColor: [number, number, number]; logoAlpha: number; logoGlowAlpha: number
}

function getTheme(dark: boolean): Theme {
  return dark ? {
    gridStroke: 'rgba(74,245,255,0.07)', gridFill: 'rgba(10,14,28,0.4)',
    hueBase: 175, hueRange: 60, streamSat: 95, streamLit: 65, coreLit: 92, coreSat: 70,
    ambientC1: [74, 245, 255], ambientC2: [139, 92, 246], ambientA1: 0.05, ambientA2: 0.035,
    particleHue: 185, particleAlpha: 0.7, pulseAlpha: 0.35,
    logoColor: [74, 245, 255], logoAlpha: 0.06, logoGlowAlpha: 0.12,
  } : {
    gridStroke: 'rgba(59,130,246,0.1)', gridFill: 'rgba(255,255,255,0.45)',
    hueBase: 220, hueRange: 50, streamSat: 80, streamLit: 52, coreLit: 96, coreSat: 40,
    ambientC1: [59, 130, 246], ambientC2: [168, 85, 247], ambientA1: 0.07, ambientA2: 0.045,
    particleHue: 225, particleAlpha: 0.5, pulseAlpha: 0.18,
    logoColor: [59, 130, 246], logoAlpha: 0.07, logoGlowAlpha: 0.10,
  }
}

// ... （完整绘制函数见源码 app/components/app/AppSplash.vue）
// 包含：getRConf, buildScene, createParticle, resetParticle, updateParticle,
//       drawParticle, createStream, growStream, updateStream, drawStream,
//       drawGrid, drawAmbient, drawOrbital, drawEmblem, drawBgLogo,
//       handleResize, frame

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const canvas = canvasRef.value
  if (!canvas) return
  _ctx = canvas.getContext('2d')!
  _sc = buildScene(canvas, _ctx)
  prevT = performance.now()
  animFrame = requestAnimationFrame(frame)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animFrame !== null) cancelAnimationFrame(animFrame)
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    class="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-end pb-[8%]"
    :style="{ background: isDark ? '#060a14' : '#f0f2f5' }"
  >
    <canvas ref="canvasRef" class="absolute inset-0" />

    <div
      class="relative flex flex-col items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-md border"
      :class="isDark
        ? 'bg-[rgba(6,10,20,0.55)] border-[rgba(74,245,255,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
        : 'bg-[rgba(255,255,255,0.6)] border-[rgba(59,130,246,0.18)] shadow-[0_8px_32px_rgba(0,0,0,0.08)]'"
    >
      <span
        class="text-xs font-medium tracking-[5px] uppercase"
        :class="isDark ? 'text-[rgba(74,245,255,0.8)]' : 'text-[rgba(59,130,246,0.9)]'"
      >Loading</span>

      <div
        class="w-44 h-[2px] rounded overflow-hidden"
        :class="isDark ? 'bg-[rgba(74,245,255,0.06)]' : 'bg-[rgba(59,130,246,0.1)]'"
      >
        <div
          class="h-full rounded animate-[loading_1.8s_ease-in-out_infinite]"
          :class="isDark
            ? 'bg-gradient-to-r from-[#4af5ff] via-[#a78bfa] to-[#f472b6]'
            : 'bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes loading {
  0% { width: 0%; margin-left: 0; }
  50% { width: 70%; margin-left: 15%; }
  100% { width: 0%; margin-left: 100%; }
}
</style>
```

> **简化替代方案**：如果不需要 Canvas 动画，可以用一个简单的 loading spinner 替代 AppSplash.vue，并将 `app.vue` 中的 `setTimeout` 时间缩短。

---

## 9. UI 组件

### 9.1 app/components/ui/UiBackToTop.vue

```vue
<script setup lang="ts">
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="back-top">
    <button
      v-if="visible"
      class="fixed bottom-8 right-8 z-50 p-2.5 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-500 transition-colors"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <Icon name="lucide:arrow-up" class="w-4 h-4" />
    </button>
  </Transition>
</template>

<style scoped>
.back-top-enter-active,
.back-top-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
```

### 9.2 app/components/ui/UiReadingProgress.vue

```vue
<script setup lang="ts">
const progress = ref(0)

function update() {
  const el = document.documentElement
  const scrollable = el.scrollHeight - el.clientHeight
  progress.value = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0
}

onMounted(() => window.addEventListener('scroll', update, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', update))
</script>

<template>
  <div class="fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none">
    <div
      class="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-violet-500 transition-[width] duration-100 ease-out"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>
```

---

## 10. 业务组件（Blog 层）

### 10.1 app/components/blog/BlogPostCard.vue

```vue
<script setup lang="ts">
defineProps<{
  title: string
  path: string
  date: Date | string
  tags?: string[]
  description?: string
  compact?: boolean
}>()
</script>

<template>
  <NuxtLink :to="path" class="group block">
    <article
      class="py-5 border-b border-zinc-100 dark:border-zinc-800/60 transition-colors duration-200"
      :class="compact ? '' : 'hover:border-violet-200 dark:hover:border-violet-800/60'"
    >
      <div class="flex items-start justify-between gap-6">
        <div class="min-w-0 space-y-1.5">
          <h2
            class="font-medium leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200"
            :class="compact ? 'text-sm' : 'text-base'"
          >
            {{ title }}
          </h2>
          <p
            v-if="description && !compact"
            class="text-sm text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed"
          >
            {{ description }}
          </p>
          <div v-if="tags?.length && !compact" class="flex gap-1.5 flex-wrap pt-0.5">
            <NuxtLink
              v-for="tag in tags"
              :key="tag"
              :to="`/tags/${encodeURIComponent(tag)}`"
              class="text-xs px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800/60 text-violet-600/80 dark:text-violet-400/80 hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              @click.stop
            >
              #{{ tag }}
            </NuxtLink>
          </div>
        </div>
        <time
          class="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums mt-0.5"
          :datetime="String(date)"
        >
          {{ new Date(date).toLocaleDateString('zh-CN', compact
            ? { month: '2-digit', day: '2-digit' }
            : { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
        </time>
      </div>
    </article>
  </NuxtLink>
</template>
```

**注意**：
- 中文标签必须用 `encodeURIComponent(tag)` 编码 URL
- `@click.stop` 防止标签链接冒泡触发卡片整体跳转
- `compact` 模式用于标签筛选页的紧凑列表

---

## 11. Composables

### 11.1 app/composables/useIsDark.ts

```typescript
export function useIsDark() {
  const colorMode = useColorMode()
  return computed(() => colorMode.value === 'dark')
}
```

> 多个组件需要判断暗色模式（AppSplash、AppThemeToggle、loading.vue），提取为 composable 避免重复。
> `useColorMode()` 由 `@nuxtjs/color-mode` 自动导入。

---

## 12. 页面

### 12.1 app/pages/index.vue（首页）

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'EchoOtakuBlog',
  description: '记录技术探索与二次元感悟的个人博客。写代码，追番，偶尔写点什么。',
  ogTitle: 'EchoOtakuBlog',
  ogDescription: '记录技术探索与二次元感悟的个人博客。写代码，追番，偶尔写点什么。',
  ogImage: 'https://echotaku.github.io/og-image.svg',
  twitterCard: 'summary_large_image',
})

const { data: posts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(5)
    .select('title', 'description', 'date', 'tags', 'path')
    .all(),
)
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="pt-2 pb-14 mb-2">
      <p class="text-xs font-medium tracking-widest uppercase text-violet-500 dark:text-violet-400 mb-4 opacity-80">
        你好，欢迎来到
      </p>
      <h1 class="font-display text-4xl font-bold tracking-tight mb-5 text-zinc-900 dark:text-zinc-50">
        Echo<span class="text-violet-600 dark:text-violet-400">Otaku</span><span class="text-zinc-300 dark:text-zinc-600">Blog</span>
      </h1>
      <p class="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
        记录技术探索与二次元感悟。写代码，追番，偶尔写点什么。
      </p>
    </section>

    <!-- Recent posts -->
    <section>
      <h2 class="text-xs font-medium tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-6">
        最新文章
      </h2>

      <div v-if="posts?.length">
        <BlogPostCard
          v-for="post in posts"
          :key="post.path"
          :title="post.title"
          :path="post.path"
          :date="post.date"
          :tags="post.tags"
          :description="post.description"
        />
      </div>

      <p v-else class="text-sm text-zinc-400 dark:text-zinc-500 py-4">
        暂无文章，快去写第一篇吧 ✍️
      </p>

      <NuxtLink
        v-if="posts?.length"
        to="/blog"
        class="inline-flex items-center gap-1.5 mt-10 text-sm text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        查看全部文章
        <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
      </NuxtLink>
    </section>
  </div>
</template>
```

### 12.2 app/pages/blog/index.vue（文章列表）

```vue
<script setup lang="ts">
useSeoMeta({ title: '文章列表 · EchoOtakuBlog' })

const { data: posts } = await useAsyncData('all-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('title', 'description', 'date', 'tags', 'path')
    .all(),
)
</script>

<template>
  <div>
    <header class="mb-10">
      <p class="text-xs font-medium tracking-widest uppercase text-violet-500 dark:text-violet-400 mb-3 opacity-80">
        归档
      </p>
      <h1 class="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        全部文章
      </h1>
      <p v-if="posts?.length" class="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
        共 {{ posts.length }} 篇
      </p>
    </header>

    <div v-if="posts?.length">
      <BlogPostCard
        v-for="post in posts"
        :key="post.path"
        :title="post.title"
        :path="post.path"
        :date="post.date"
        :tags="post.tags"
        :description="post.description"
      />
    </div>

    <p v-else class="text-sm text-zinc-400 dark:text-zinc-500 py-4">暂无文章。</p>
  </div>
</template>
```

### 12.3 app/pages/blog/[...slug].vue（文章详情）

```vue
<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

useSeoMeta({
  title: computed(() => `${post.value?.title} · EchoOtakuBlog`),
  description: computed(() => post.value?.description),
  ogTitle: computed(() => post.value?.title),
  ogDescription: computed(() => post.value?.description),
  ogImage: 'https://echotaku.github.io/og-image.svg',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => post.value?.title),
  twitterDescription: computed(() => post.value?.description),
})

useSchemaOrg([
  defineArticle({
    headline: computed(() => post.value?.title ?? ''),
    description: computed(() => post.value?.description),
    datePublished: computed(() => post.value?.date ? new Date(post.value.date).toISOString() : undefined),
    image: 'https://echotaku.github.io/og-image.svg',
  }),
])
</script>

<template>
  <article>
    <UiReadingProgress />

    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-12"
    >
      <Icon name="lucide:arrow-left" class="w-4 h-4" />
      全部文章
    </NuxtLink>

    <header class="mb-12">
      <div v-if="post?.tags?.length" class="flex gap-2 flex-wrap mb-5">
        <NuxtLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/tags/${encodeURIComponent(tag)}`"
          class="text-xs px-2.5 py-0.5 rounded-full border border-violet-200 dark:border-violet-800/60 text-violet-600/80 dark:text-violet-400/80 hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          #{{ tag }}
        </NuxtLink>
      </div>

      <h1 class="font-display text-3xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ post?.title }}
      </h1>

      <time
        v-if="post?.date"
        class="mt-4 block text-sm text-zinc-400 dark:text-zinc-500"
        :datetime="String(post.date)"
      >
        {{ new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      </time>
    </header>

    <ContentRenderer
      v-if="post"
      :value="post"
      class="prose prose-zinc dark:prose-invert max-w-none prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight"
    />
  </article>
</template>
```

**关键 API**：
- `queryCollection('blog').path(route.path).first()` — v3 查询 API
- `<ContentRenderer :value="post" />` — 渲染 Markdown 为 HTML
- `useSchemaOrg([defineArticle()])` — JSON-LD 结构化数据（`@nuxtjs/seo` 自动导入）
- `useSeoMeta()` — 社交分享 meta 标签

### 12.4 app/pages/tags/[tag].vue（标签筛选）

```vue
<script setup lang="ts">
const route = useRoute()
const tag = decodeURIComponent(String(route.params.tag ?? ''))

useSeoMeta({ title: `#${tag} · EchoOtakuBlog` })

const { data: posts } = await useAsyncData(`tag-${tag}`, async () => {
  const all = await queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('title', 'path', 'date', 'tags')
    .all()
  return all.filter(p => p.tags?.includes(tag))
})
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-10">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
        全部文章
      </NuxtLink>
      <span class="text-zinc-200 dark:text-zinc-700">/</span>
      <span class="text-sm px-2.5 py-0.5 rounded-full border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-400">
        #{{ tag }}
      </span>
      <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ posts?.length ?? 0 }} 篇</span>
    </div>

    <ul v-if="posts?.length">
      <li v-for="post in posts" :key="post.path" class="group">
        <NuxtLink
          :to="post.path"
          class="flex items-start justify-between gap-6 py-5 border-b border-zinc-100 dark:border-zinc-800/60 hover:border-violet-200 dark:hover:border-violet-800/60 transition-colors"
        >
          <div class="space-y-1.5">
            <span class="text-base font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {{ post.title }}
            </span>
            <div v-if="post.tags?.length" class="flex gap-1.5 flex-wrap">
              <span
                v-for="t in post.tags"
                :key="t"
                class="text-xs px-2 py-0.5 rounded-full border transition-colors"
                :class="t === tag
                  ? 'border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'"
              >{{ t }}</span>
            </div>
          </div>
          <time
            class="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums mt-0.5"
            :datetime="String(post.date)"
          >
            {{ new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
          </time>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="text-sm text-zinc-400 dark:text-zinc-500 py-4">该标签下暂无文章。</p>
  </div>
</template>
```

**注意**：中文标签必须 `decodeURIComponent` 读取，`encodeURIComponent` 生成链接。

### 12.5 app/pages/about.vue

```vue
<script setup lang="ts">
useSeoMeta({ title: '关于 · EchoOtakuBlog' })
</script>

<template>
  <div>
    <header class="mb-10">
      <p class="text-xs font-medium tracking-widest uppercase text-violet-500 dark:text-violet-400 mb-3 opacity-80">
        关于
      </p>
      <h1 class="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        EchoOtaku
      </h1>
    </header>

    <div class="prose prose-zinc dark:prose-invert max-w-none prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-headings:font-display prose-headings:font-bold">
      <p>你好！我是 EchoOtaku，一名热爱技术与二次元的开发者。</p>
      <p>这个博客是我记录学习笔记、技术探索和生活感悟的地方。</p>
      <h2>技术栈</h2>
      <ul>
        <li>前端：Vue 3、Nuxt 4、TypeScript</li>
        <li>样式：Tailwind CSS v4</li>
        <li>内容：Markdown + Nuxt Content v3</li>
      </ul>
      <h2>联系我</h2>
      <p>
        有任何问题欢迎通过
        <a href="https://github.com/EchoOtaku" target="_blank" rel="noopener noreferrer">GitHub</a>
        联系。
      </p>
    </div>
  </div>
</template>
```

---

## 13. 内容系统

### 13.1 文章 Frontmatter 格式

```yaml
---
title: '你好，世界'
description: '这是 EchoOtakuBlog 的第一篇文章'
date: 2026-03-19
tags: ['随笔', 'Nuxt', '开始']
draft: false
---
```

| 字段          | 类型       | 必填 | 说明                        |
| ------------- | ---------- | ---- | --------------------------- |
| `title`       | string     | 是   | 由 `asSeoCollection` 提供   |
| `description` | string     | 是   | 由 `asSeoCollection` 提供   |
| `date`        | date       | 是   | 发布日期 YYYY-MM-DD         |
| `tags`        | string[]   | 否   | 标签数组                    |
| `cover`       | string     | 否   | 封面图 URL（预留）          |
| `draft`       | boolean    | 否   | 默认 false，true 则不在列表显示 |

### 13.2 示例文章

创建 `content/blog/hello-world.md`：

```markdown
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

\`\`\`typescript
const posts = await queryCollection('blog')
  .where('draft', '=', false)
  .order('date', 'DESC')
  .limit(5)
  .all()
\`\`\`

希望这个博客能持续更新 🎉
```

---

## 14. 公共资源（public/）

### 14.1 public/.nojekyll

空文件，告诉 GitHub Pages 不要用 Jekyll 处理。

```bash
touch public/.nojekyll
```

### 14.2 public/_robots.txt

```
User-Agent: *
Disallow:
```

> 文件名是 `_robots.txt`（前缀下划线），因为 `@nuxtjs/robots` 模块会自动生成 `/robots.txt`，此文件的内容会被追加到生成的 robots.txt 中。

### 14.3 public/favicon.ico

放置一个 favicon 图标文件。

### 14.4 public/og-image.svg

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0f0a1e"/>
  <rect x="0" y="0" width="1200" height="4" fill="#7c3aed"/>
  <!-- Hex grid background (decorative) -->
  <g opacity="0.06" fill="none" stroke="#4af5ff" stroke-width="0.8">
    <polygon points="100,80 131,60 163,80 163,120 131,140 100,120"/>
    <polygon points="163,80 194,60 226,80 226,120 194,140 163,120"/>
    <polygon points="226,80 257,60 289,80 289,120 257,140 226,120"/>
    <polygon points="131,140 163,120 194,140 194,180 163,200 131,180"/>
    <polygon points="1037,80 1068,60 1100,80 1100,120 1068,140 1037,120"/>
    <polygon points="1068,140 1100,120 1131,140 1131,180 1100,200 1068,180"/>
  </g>
  <!-- Logo area -->
  <rect x="80" y="80" width="6" height="40" fill="#7c3aed" rx="3"/>
  <text x="96" y="108" font-family="'Segoe UI', sans-serif" font-size="22" font-weight="700" fill="#a78bfa">EchoOtakuBlog</text>
  <!-- Main text -->
  <text x="80" y="340" font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" font-size="72" font-weight="800" fill="#f8fafc">EchoOtaku</text>
  <text x="80" y="420" font-family="'Segoe UI', 'Microsoft YaHei', sans-serif" font-size="28" fill="#94a3b8">记录技术探索与二次元感悟的个人博客</text>
  <!-- Bottom decoration -->
  <text x="80" y="560" font-family="'Segoe UI', sans-serif" font-size="18" fill="#475569">技术 · 二次元 · 生活</text>
  <text x="1120" y="560" font-family="'Segoe UI', sans-serif" font-size="18" fill="#475569" text-anchor="end">echotaku.github.io</text>
</svg>
```

---

## 15. SEO 配置

`@nuxtjs/seo` 是一个元模块，集成了以下子模块：

| 子模块            | 功能           | 配置位置                   |
| ----------------- | -------------- | -------------------------- |
| nuxt-site-config  | 站点元信息     | `nuxt.config.ts` → `site`  |
| @nuxtjs/robots    | robots.txt     | `nuxt.config.ts` → `robots` |
| @nuxtjs/sitemap   | sitemap.xml    | `nuxt.config.ts` → `sitemap` |
| nuxt-og-image     | OG 图片生成    | `nuxt.config.ts` → `ogImage` |
| nuxt-schema-org   | JSON-LD 结构化数据 | `nuxt.config.ts` → `schemaOrg` |
| nuxt-seo-utils    | Meta 工具      | 自动生效                   |
| nuxt-link-checker | 链接检查       | 构建时自动检查             |

### 在页面中使用

```typescript
// 任意页面的 <script setup> 中：

// 1. 设置 SEO meta（所有页面）
useSeoMeta({
  title: '页面标题',
  description: '页面描述',
  ogTitle: '分享标题',
  ogDescription: '分享描述',
  ogImage: 'https://echotaku.github.io/og-image.svg',
  twitterCard: 'summary_large_image',
})

// 2. 文章页添加结构化数据
useSchemaOrg([
  defineArticle({
    headline: '文章标题',
    description: '文章描述',
    datePublished: new Date().toISOString(),
    image: 'https://echotaku.github.io/og-image.svg',
  }),
])
```

### Content 集合 SEO 集成

`content.config.ts` 中用 `asSeoCollection()` 包装后，Markdown frontmatter 中的字段会自动用于 sitemap、og-image 和 schema-org：

```typescript
blog: defineCollection(asSeoCollection({
  // ...
}))
```

---

## 16. GitHub Actions 部署

### 16.1 前置条件

1. GitHub 仓库的 **Settings → Pages → Source** 设为 **GitHub Actions**
2. 仓库名如果是 `<用户名>.github.io`，则自动部署到 `https://<用户名>.github.io`

### 16.2 .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Generate static site
        run: pnpm generate

      - name: Create SPA fallback for GitHub Pages
        run: cp .output/public/200.html .output/public/404.html

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .output/public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**关键步骤说明**：

- `cp .output/public/200.html .output/public/404.html` — GitHub Pages 对未知路径返回 404.html，复制 200.html 作为 SPA fallback，确保客户端路由正常
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` — 强制 GitHub Actions 使用 Node.js 24 运行时
- `cancel-in-progress: false` — 不取消进行中的部署

---

## 17. Git 提交规范

### 格式

```
<type>(<scope>): <emoji> <subject>
```

### Type 类型

| Type       | Emoji | 说明               |
| ---------- | ----- | ------------------ |
| `feat`     | ✨     | 新功能             |
| `fix`      | 🐛     | Bug 修复           |
| `docs`     | 📝     | 文档变更           |
| `style`    | 🎨     | 代码格式调整       |
| `refactor` | ♻️     | 重构               |
| `perf`     | ⚡️     | 性能优化           |
| `test`     | ✅     | 测试用例           |
| `build`    | 📦     | 构建/依赖变更      |
| `ci`       | 🔧     | CI/CD 配置         |
| `chore`    | 🔨     | 杂项维护           |

### Scope 作用域

`content`, `ui`, `config`, `router`, `api`, `auth`, `layout`, `seo`, `blog`

### 示例

```bash
feat(blog): ✨ 新增文章归档页面
fix(router): 🐛 修复文章详情页刷新后 404
build(config): 📦 迁移至 Tailwind CSS v4
style(ui): 🎨 全面美化界面设计
docs: 📝 添加搭建指南文档
```

---

## 18. 构建与验证

### 开发模式

```bash
pnpm dev
# 访问 http://localhost:3000
```

首次运行 `pnpm dev` 会生成 `.nuxt/types`，解决 IDE 中 `useSchemaOrg`、`defineArticle` 等自动导入的类型提示。

### 静态生成

```bash
pnpm generate
# 输出到 .output/public/
```

### 预览生产构建

```bash
npx serve .output/public
```

### 验证清单

- [ ] 首页正常渲染，Hero 区域显示 Syne 字体
- [ ] 暗色/亮色模式切换正常
- [ ] 文章列表页显示所有非 draft 文章
- [ ] 文章详情页渲染 Markdown 内容，代码块有语法高亮
- [ ] 标签链接可点击，标签筛选页正确过滤
- [ ] 阅读进度条在文章页随滚动更新
- [ ] 返回顶部按钮在滚动超过 300px 后出现
- [ ] 闪屏动画 2.2 秒后淡出
- [ ] `pnpm generate` 构建成功（中文标签 500 警告可忽略）
- [ ] `/robots.txt` 和 `/sitemap.xml` 可访问

---

## 19. 已知问题与解决方案

### 中文标签预渲染 500 错误

**现象**：`pnpm generate` 时，`/tags/随笔` 等中文 URL 报 500

**原因**：Nitro 预渲染引擎对 URL 编码处理不完善

**解决**：
- `nitro.prerender.failOnError: false` — 允许构建继续
- 中文标签页在客户端正常工作，仅预渲染阶段报错
- link-checker 会报为 error/warning，可忽略

### better-sqlite3 Node.js 版本不匹配

**现象**：`NODE_MODULE_VERSION 137 vs 141` 错误

**原因**：`better-sqlite3` 是原生模块，切换 Node.js 版本后需要重新编译

**解决**：

```bash
pnpm rebuild better-sqlite3
```

### IDE 类型提示找不到自动导入

**现象**：IDE 报 `找不到名称 "useSchemaOrg"` 等错误

**原因**：Nuxt 自动导入的类型声明在 `.nuxt/types` 中，首次需运行 `pnpm dev` 生成

**解决**：

```bash
pnpm dev   # 启动一次开发服务器，自动生成类型
```

### nuxt-og-image 需要 Tailwind v4

**现象**：`nuxt-og-image v6` 安装时报 peer dependency 不满足

**原因**：v6 明确要求 `tailwindcss@^4.0.0`

**解决**：使用 Tailwind CSS v4 + `@tailwindcss/vite`，不用 `@nuxtjs/tailwindcss` 模块

---

## 附录：推荐的提交顺序

按以下顺序提交，每步构建成功后再进入下一步：

```bash
# 1. 项目初始化
feat: ✨ 初始化 Nuxt 4 项目

# 2. 文档
docs: 📝 添加项目文档（README、提交规范、架构设计）

# 3. 基础配置 + 布局 + 第一篇文章
feat(blog): ✨ 搭建博客基础框架（布局、页面、组件、第一篇文章）

# 4. 体验增强
feat(ui): ✨ 添加闪屏动画、loading 进度条、回到顶部按钮

# 5. SEO 集成
feat(seo): ✨ 集成 @nuxtjs/seo（robots、sitemap、schema.org、OG meta）

# 6. Tailwind v4 升级
build(config): 📦 迁移至 Tailwind CSS v4

# 7. UI 美化
style(ui): 🎨 全面美化界面设计

# 8. CI/CD 部署
ci: 🔧 添加 GitHub Pages 自动部署 workflow

# 9. 推送
git push origin main
```
