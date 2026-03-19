<script setup lang="ts">
const links = [
  { label: '首页', to: '/' },
  { label: '文章', to: '/blog' },
  { label: '关于', to: '/about' },
]
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
    <div class="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="font-bold text-lg text-violet-600 dark:text-violet-400 hover:opacity-80 transition-opacity"
      >
        EchoOtaku
      </NuxtLink>

      <nav class="flex items-center gap-1">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="px-3 py-1.5 rounded-md text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          active-class="text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50"
        >
          {{ link.label }}
        </NuxtLink>

        <div class="ml-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <AppThemeToggle />
        </div>
      </nav>
    </div>
  </header>
</template>
