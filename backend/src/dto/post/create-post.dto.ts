import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),

  content: z.string().min(10, 'Content must be at least 10 characters'),

  description: z.string().min(10, 'Content must be at least 10 characters')
})

export type CreatePostDTO = z.infer<typeof createPostSchema>
