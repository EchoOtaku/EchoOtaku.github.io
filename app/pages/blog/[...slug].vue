<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first(),
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在' })
}

useSeoMeta({
  title: computed(() => `${post.value?.title} · EchoOtakuBlog`),
  description: computed(() => post.value?.description),
  ogTitle: computed(() => post.value?.title),
  ogDescription: computed(() => post.value?.description),
  ogImage: 'https://echotaku.github.io/og-image.svg',
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: computed(() => post.value?.title),
  twitterDescription: computed(() => post.value?.description),
})

useSchemaOrg([
  defineArticle({
    headline: computed(() => post.value?.title ?? ''),
    description: computed(() => post.value?.description),
    datePublished: computed(() => post.value?.date ? new Date(post.value.date).toISOString() : undefined),
    image: 'https://echotaku.github.io/og-image.svg',
  }),
])
</script>

<template>
  <article>
    <UiReadingProgress />

    <NuxtLink
      to="/blog"
      class="inline-flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-12"
    >
      <Icon name="lucide:arrow-left" class="w-4 h-4" />
      全部文章
    </NuxtLink>

    <header class="mb-12">
      <div v-if="post?.tags?.length" class="flex gap-2 flex-wrap mb-5">
        <NuxtLink
          v-for="tag in post.tags"
          :key="tag"
          :to="`/tags/${encodeURIComponent(tag)}`"
          class="text-xs px-2.5 py-0.5 rounded-full border border-violet-200 dark:border-violet-800/60 text-violet-600/80 dark:text-violet-400/80 hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          #{{ tag }}
        </NuxtLink>
      </div>

      <h1 class="font-display text-3xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50">
        {{ post?.title }}
      </h1>

      <time
        v-if="post?.date"
        class="mt-4 block text-sm text-zinc-400 dark:text-zinc-500"
        :datetime="String(post.date)"
      >
        {{ new Date(post.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      </time>
    </header>

    <ContentRenderer
      v-if="post"
      :value="post"
      class="prose prose-zinc dark:prose-invert max-w-none prose-a:text-violet-600 dark:prose-a:text-violet-400 prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight"
    />
  </article>
</template>
