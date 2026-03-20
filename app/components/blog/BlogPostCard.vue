<script setup lang="ts">
defineProps<{
  title: string
  path: string
  date: Date | string
  tags?: string[]
  description?: string
  compact?: boolean
}>()
</script>

<template>
  <NuxtLink :to="path" class="group block">
    <article
      class="py-5 border-b border-zinc-100 dark:border-zinc-800/60 transition-colors duration-200"
      :class="compact ? '' : 'hover:border-violet-200 dark:hover:border-violet-800/60'"
    >
      <div class="flex items-start justify-between gap-6">
        <div class="min-w-0 space-y-1.5">
          <h2
            class="font-medium leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-200"
            :class="compact ? 'text-sm' : 'text-base'"
          >
            {{ title }}
          </h2>
          <p
            v-if="description && !compact"
            class="text-sm text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed"
          >
            {{ description }}
          </p>
          <div v-if="tags?.length && !compact" class="flex gap-1.5 flex-wrap pt-0.5">
            <NuxtLink
              v-for="tag in tags"
              :key="tag"
              :to="`/tags/${encodeURIComponent(tag)}`"
              class="text-xs px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800/60 text-violet-600/80 dark:text-violet-400/80 hover:border-violet-400 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              @click.stop
            >
              #{{ tag }}
            </NuxtLink>
          </div>
        </div>
        <time
          class="shrink-0 text-xs text-zinc-400 dark:text-zinc-500 tabular-nums mt-0.5"
          :datetime="String(date)"
        >
          {{ new Date(date).toLocaleDateString('zh-CN', compact
            ? { month: '2-digit', day: '2-digit' }
            : { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
        </time>
      </div>
    </article>
  </NuxtLink>
</template>
