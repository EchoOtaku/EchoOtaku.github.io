// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/seo',        // 必须在 @nuxt/content 之前
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],

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

  // ——— OG Image：暂禁用（nuxt-og-image v6 需要 Tailwind v4）———
  ogImage: {
    enabled: false,
  },

  css: ['~/assets/css/main.css'],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  nitro: {
    prerender: {
      // 预渲染路由失败时不中断构建（中文路由兜底）
      failOnError: false,
    },
  },

  colorMode: {
    classSuffix: '',
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
