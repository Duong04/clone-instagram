import { z } from 'zod'
import { ContentType } from '~/generated/prisma/enums'

export const getCommentsQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10))
    .refine((val) => val > 0 && val <= 50, {
      message: 'limit must be between 1 and 50'
    }),
  cursor: z.string().optional(),
  targetType: z.enum(ContentType)
})

export const getCommentRepliesQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10))
    .refine((val) => val > 0 && val <= 50, {
      message: 'limit must be between 1 and 50'
    }),
  cursor: z.string().optional()
})

export const createCommentBodySchema = z.object({
  content: z.string().min(1).max(500),
  target_id: z.string(),
  target_type: z.enum(ContentType),
  parent_id: z.string().optional()
})

export const updateCommentBodySchema = z.object({
  content: z.string().min(1).max(500)
})

export type GetCommentsQuery = z.infer<typeof getCommentsQuerySchema>
export type CreateCommentBody = z.infer<typeof createCommentBodySchema>
export type UpdateCommentBody = z.infer<typeof updateCommentBodySchema>

export interface CreateCommentDTO extends CreateCommentBody {
  user_id: string
}
