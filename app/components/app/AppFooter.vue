<template>
  <footer class="border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
    <div class="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
      <span>© {{ new Date().getFullYear() }} EchoOtaku</span>
      <a
        href="https://github.com/EchoOtaku"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        aria-label="GitHub"
      >
        <Icon name="lucide:github" class="w-3.5 h-3.5" />
        <span>GitHub</span>
      </a>
    </div>
  </footer>
</template>
