import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/seo',
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

  // ——— OG Image（Tailwind v4 升级后启用）———
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
