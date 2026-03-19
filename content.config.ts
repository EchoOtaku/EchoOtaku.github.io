import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        date: z.date(),
        tags: z.array(z.string()).optional(),
        cover: z.string().optional(),
        draft: z.boolean().default(false),
      }),
    }),
  },
})
