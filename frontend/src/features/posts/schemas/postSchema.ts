import { z } from 'zod'

export const createPostSchema = z.object({
  images: z.array(z.string()).min(1, 'At least 1 image required').max(10, 'Max 10 images'),
  caption: z.string().max(2200, 'Caption too long').optional(),
  location: z.string().max(255).optional(),
  hashtags: z.string().optional(),
  musicId: z.string().optional()
})

export type CreatePostInput = z.infer<typeof createPostSchema>