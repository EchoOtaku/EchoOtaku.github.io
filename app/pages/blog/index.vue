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
