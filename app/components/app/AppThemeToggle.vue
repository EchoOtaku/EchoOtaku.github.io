<script setup lang="ts">
const colorMode = useColorMode()
const isDark = useIsDark()

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    @click="toggle"
    class="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    :aria-label="isDark ? '切换亮色模式' : '切换暗色模式'"
  >
    <Icon v-if="isDark" name="lucide:sun" class="w-5 h-5" />
    <Icon v-else name="lucide:moon" class="w-5 h-5" />
  </button>
</template>
