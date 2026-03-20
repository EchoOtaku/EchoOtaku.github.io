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
