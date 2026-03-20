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
      <h1 class="font-display text-4xl font-bold tracking-tight leading-normal mb-5 text-zinc-900 dark:text-zinc-50">
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
