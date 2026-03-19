<script setup lang="ts">
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
    <section class="py-10 mb-12 border-b border-zinc-100 dark:border-zinc-800">
      <p class="text-sm font-medium text-violet-600 dark:text-violet-400 mb-2">你好，我是</p>
      <h1 class="text-3xl font-bold mb-4">EchoOtaku</h1>
      <p class="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
        记录技术探索与二次元感悟的个人博客。写代码，追番，偶尔写点什么。
      </p>
    </section>

    <!-- Recent posts -->
    <section>
      <h2 class="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
        最新文章
      </h2>

      <div v-if="posts?.length" class="space-y-8">
        <article v-for="post in posts" :key="post.path">
          <NuxtLink :to="post.path" class="group block">
            <time class="text-xs text-zinc-400 dark:text-zinc-500">
              {{ new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </time>
            <h3 class="mt-1 text-lg font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {{ post.title }}
            </h3>
            <p v-if="post.description" class="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
              {{ post.description }}
            </p>
            <div v-if="post.tags?.length" class="mt-2 flex gap-2 flex-wrap">
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

      <p v-else class="text-sm text-zinc-400 dark:text-zinc-500">
        暂无文章，快去写第一篇吧 ✍️
      </p>

      <NuxtLink
        v-if="posts?.length"
        to="/blog"
        class="inline-block mt-8 text-sm text-violet-600 dark:text-violet-400 hover:underline"
      >
        查看全部文章 →
      </NuxtLink>
    </section>
  </div>
</template>
