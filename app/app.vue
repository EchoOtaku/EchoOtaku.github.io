<script setup lang="ts">
const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => { showSplash.value = false }, 2200)
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <Transition
    name="splash"
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <AppSplash v-if="showSplash" />
  </Transition>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
