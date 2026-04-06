import { z } from 'zod'
import { ContentType } from '~/generated/prisma/client'

export const likeFeedItemSchema = z.object({
  targetId: z.string().uuid(),
  targetType: z.enum(ContentType),
  isLiked: z.boolean()
})

export type LikeFeedItemSchema = z.infer<typeof likeFeedItemSchema>
