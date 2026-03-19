<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
    <AppHeader />
    <main class="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
