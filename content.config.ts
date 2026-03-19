import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

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
