// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
  },

  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
    },
  },
})
