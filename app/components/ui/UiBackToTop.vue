<script setup lang="ts">
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="back-top">
    <button
      v-if="visible"
      class="fixed bottom-8 right-8 z-50 p-2.5 rounded-full bg-violet-600 text-white shadow-lg hover:bg-violet-500 transition-colors"
      aria-label="返回顶部"
      @click="scrollToTop"
    >
      <Icon name="lucide:arrow-up" class="w-4 h-4" />
    </button>
  </Transition>
</template>

<style scoped>
.back-top-enter-active,
.back-top-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.back-top-enter-from,
.back-top-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
