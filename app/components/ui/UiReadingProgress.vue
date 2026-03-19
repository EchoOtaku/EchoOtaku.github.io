<script setup lang="ts">
const progress = ref(0)

function update() {
  const el = document.documentElement
  const scrollable = el.scrollHeight - el.clientHeight
  progress.value = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0
}

onMounted(() => window.addEventListener('scroll', update, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', update))
</script>

<template>
  <div class="fixed top-0 left-0 right-0 h-0.5 z-50 pointer-events-none">
    <div
      class="h-full bg-gradient-to-r from-violet-500 via-purple-400 to-violet-500 transition-[width] duration-100 ease-out"
      :style="{ width: `${progress}%` }"
    />
  </div>
</template>
