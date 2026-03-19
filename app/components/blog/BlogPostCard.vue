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
    <article class="py-3 border-b border-zinc-100 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 space-y-1">
          <h2
            class="font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate"
            :class="compact ? 'text-base' : 'text-lg'"
          >
            {{ title }}
          </h2>
          <p v-if="description && !compact" class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {{ description }}
          </p>
          <div v-if="tags?.length" class="flex gap-1.5 flex-wrap">
            <NuxtLink
              v-for="tag in tags"
              :key="tag"
              :to="`/tags/${encodeURIComponent(tag)}`"
              class="text-xs px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
              @click.stop
            >
              #{{ tag }}
            </NuxtLink>
          </div>
        </div>
        <time
          class="shrink-0 text-sm text-zinc-400 dark:text-zinc-500 tabular-nums"
          :datetime="String(date)"
        >
          {{ new Date(date).toLocaleDateString('zh-CN', compact
            ? { month: 'short', day: 'numeric' }
            : { year: 'numeric', month: '2-digit', day: '2-digit' }) }}
        </time>
      </div>
    </article>
  </NuxtLink>
</template>
