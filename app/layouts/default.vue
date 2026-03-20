<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-[#09090f] text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
    <AppHeader />
    <main class="flex-1 max-w-3xl w-full mx-auto px-6 py-14">
      <slot />
    </main>
    <AppFooter />
    <UiBackToTop />
  </div>
</template>
