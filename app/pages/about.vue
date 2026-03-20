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
