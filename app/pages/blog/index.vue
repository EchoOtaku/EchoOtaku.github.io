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
    <h1 class="text-2xl font-bold mb-10">全部文章</h1>

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

    <p v-else class="text-sm text-zinc-400 dark:text-zinc-500">暂无文章。</p>
  </div>
</template>
