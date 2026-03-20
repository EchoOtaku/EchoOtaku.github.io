# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EchoOtakuBlog is a Nuxt 4 personal blog built with a **static-first, backend-extensible** architecture. Content is Markdown-driven via `@nuxt/content` v3. The project evolves in phases: Phase 1 (static blog, current), Phase 2 (SEO/UX), Phase 3 (backend with Drizzle ORM, auth, comments). UI text and commit messages are in Chinese.

## Commands

```bash
pnpm dev          # Start dev server (http://localhost:3000)
pnpm generate     # Static site generation → .output/public/
pnpm build        # SSR build (for Phase 3 backend features)
pnpm preview      # Preview production build locally
```

The user manages Node.js with **fnm** (installed via WinGet).

## Architecture

### App Directory (Nuxt 4 convention)

All application code lives under `app/`. Content and server code are peer directories at root level.

### Three-Layer Component Architecture

| Layer | Directory | Prefix | Purpose |
|-------|-----------|--------|---------|
| Atomic | `app/components/ui/` | `Ui*` | Pure presentational, no business logic |
| Business | `app/components/blog/` | `Blog*` | Blog-specific logic |
| Application | `app/components/app/` | `App*` | Global singletons (header, footer, splash) |

All components are auto-imported by Nuxt — no manual imports needed.

### Content System

- Articles: `content/blog/*.md` with frontmatter (`date`, `tags`, `cover`, `draft`)
- Schema defined in `content.config.ts` using `defineCollection` + `z` from `@nuxt/content` (NOT from `zod` directly)
- Query API: `queryCollection('blog')` — this is v3 API, not v2's `queryContent()`

### Routing

- `pages/blog/[...slug].vue` — catch-all for article detail (throws 404 via `createError`)
- `pages/tags/[tag].vue` — Chinese tags require `encodeURIComponent` in links and `decodeURIComponent` when reading `route.params.tag`

### Dark Mode

Class-based via `@nuxtjs/color-mode` with `classSuffix: ''`. Use Tailwind `dark:` prefix. Toggle via `useColorMode()` composable.

### Splash Screen

`AppSplash.vue` renders a canvas-based hexagon animation on initial page load (2.2s). `loading.vue` is a minimal progress bar for between-page transitions. The splash was moved out of `loading.vue` because SSG loads data instantly, so `useLoadingIndicator` never triggers meaningfully.

## Deployment

Currently deploys to **GitHub Pages** via `.github/workflows/deploy.yml`:
- Static generation (`pnpm generate`)
- SPA fallback: copies `200.html` → `404.html` for client-side routing
- `nitro.prerender.failOnError: false` handles Chinese URL encoding issues during SSG

Phase 3 backend features require switching to a Node.js host (Vercel/Railway).

## Git Conventions

Conventional Commits format: `<type>(<scope>): <emoji> <subject>`

**Types**: `feat` ✨, `fix` 🐛, `docs` 📝, `style` 🎨, `refactor` ♻️, `perf` ⚡️, `test` ✅, `build` 📦, `ci` 🔧, `chore` 🔨

**Scopes**: `content`, `ui`, `config`, `router`, `api`, `auth`, `layout`, `seo`, `blog`

Emoji is optional but recommended. Subject in Chinese is fine. See `docs/git-commit-convention.md` for full details.

## Key Decisions

- `@nuxt/content` v3 uses `z` re-exported from `@nuxt/content`, not a direct `zod` import
- `better-sqlite3` is a dev dependency for content's SQLite adapter; allowed in `pnpm-workspace.yaml` `onlyBuiltDependencies`
- No Pinia/Vuex — state managed via Vue 3 Composition API + `useAsyncData`
- Violet (`violet-600` / `violet-400`) is the primary accent color throughout
