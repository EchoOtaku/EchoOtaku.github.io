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

    <div v-if="posts?.length" class="space-y-10">
      <article
        v-for="post in posts"
        :key="post.path"
        class="pb-10 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
      >
        <NuxtLink :to="post.path" class="group block">
          <time class="text-xs text-zinc-400 dark:text-zinc-500">
            {{ new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </time>
          <h2 class="mt-1 text-xl font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {{ post.description }}
          </p>
          <div v-if="post.tags?.length" class="mt-3 flex gap-2 flex-wrap">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400"
            >
              {{ tag }}
            </span>
          </div>
        </NuxtLink>
      </article>
    </div>

    <p v-else class="text-sm text-zinc-400 dark:text-zinc-500">暂无文章。</p>
  </div>
</template>
