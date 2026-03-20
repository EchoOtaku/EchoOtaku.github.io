<script setup lang="ts">
const { progress } = useLoadingIndicator()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <div
    class="fixed top-0 left-0 right-0 z-[9998] h-[2px] transition-opacity duration-150"
    :class="progress > 0 ? 'opacity-100' : 'opacity-0'"
  >
    <div
      class="h-full transition-[width] duration-300 ease-out"
      :class="isDark
        ? 'bg-gradient-to-r from-[#4af5ff] via-[#a78bfa] to-[#f472b6]'
        : 'bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]'"
      :style="{ width: `${Math.max(progress, 2)}%` }"
    />
  </div>
</template>
