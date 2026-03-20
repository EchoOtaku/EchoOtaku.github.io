<script setup lang="ts">
const route = useRoute()
const tag = decodeURIComponent(String(route.params.tag ?? ''))

useSeoMeta({ title: `#${tag} · EchoOtakuBlog` })

const { data: posts } = await useAsyncData(`tag-${tag}`, async () => {
  const all = await queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('title', 'path', 'date', 'tags')
    .all()
  return all.filter(p => p.tags?.includes(tag))
})
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-10">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
        全部文章
      </NuxtLink>
      <span class="text-zinc-200 dark:text-zinc-700">/</span>
      <span class="text-sm px-2.5 py-0.5 rounded-full border border-violet-200 dark:border-violet-800/60 text-violet-600 dark:text-violet-400">
        #{{ tag }}
      </span>
      <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ posts?.length ?? 0 }} 篇</span>
    </div>

    <ul v-if="posts?.length">
      <li v-for="post in posts" :key="post.path" class="group">
        <NuxtLink
          :to="post.path"
          class="flex items-start justify-between gap-6 py-5 border-b border-zinc-100 dark:border-zinc-800/60 hover:border-violet-200 dark:hover:border-violet-800/60 transition-colors"
        >
          <div class="space-y-1.5">
            <span class="text-base font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {{ post.title }}
            </span>
            <div v-if="post.tags?.length" class="flex gap-1.5 flex-wrap">
              <span
                v-for="t in post.tags"
                :key="t"
                class="text-xs px-2 py-0.5 rounded-full border transition-colors"
                :class="t === tag
                  ? 'border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500'"
              >{{ t }}</span>
            </div>
          </div>
          <time
            class="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums mt-0.5"
            :datetime="String(post.date)"
          >
            {{ new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
          </time>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="text-sm text-zinc-400 dark:text-zinc-500 py-4">该标签下暂无文章。</p>
  </div>
</template>
