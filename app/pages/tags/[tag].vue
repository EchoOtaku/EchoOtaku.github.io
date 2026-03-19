<script setup lang="ts">
const route = useRoute('/tags/[tag]')
const tag = route.params.tag

useSeoMeta({ title: () => `#${tag} · EchoOtakuBlog` })

const { data: posts } = await useAsyncData(`tag-${tag}`, async () => {
  const all = await queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
  return all.filter(p => p.tags?.includes(tag))
})
</script>

<template>
  <div>
    <div class="flex items-center gap-3 mb-10">
      <NuxtLink
        to="/blog"
        class="text-sm text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      >
        ← 全部文章
      </NuxtLink>
      <span class="text-zinc-300 dark:text-zinc-700">/</span>
      <span class="text-sm px-2.5 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 font-medium">
        #{{ tag }}
      </span>
      <span class="text-sm text-zinc-400 dark:text-zinc-500">{{ posts?.length ?? 0 }} 篇</span>
    </div>

    <ul v-if="posts?.length" class="space-y-1">
      <li v-for="post in posts" :key="post.path" class="group">
        <NuxtLink
          :to="post.path"
          class="flex items-start justify-between gap-4 py-3 border-b border-zinc-100 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
        >
          <div class="space-y-1">
            <span class="font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {{ post.title }}
            </span>
            <div v-if="post.tags?.length" class="flex gap-1.5 flex-wrap">
              <span
                v-for="t in post.tags"
                :key="t"
                class="text-xs px-1.5 py-0.5 rounded"
                :class="t === tag
                  ? 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'"
              >{{ t }}</span>
            </div>
          </div>
          <time
            class="shrink-0 text-sm text-zinc-400 dark:text-zinc-500 tabular-nums"
            :datetime="String(post.date)"
          >
            {{ new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
          </time>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="text-sm text-zinc-400 dark:text-zinc-500">该标签下暂无文章。</p>
  </div>
</template>
