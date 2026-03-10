import { z } from 'zod'

export const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  description: z.string().min(10).optional()
})

export type UpdatePostDTO = z.infer<typeof updatePostSchema>
