import { z } from 'zod'

export const profileContentQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 12)),
  cursor: z.string().optional(),
  type: z.enum(['all', 'post', 'reel']).default('all')
})

export type ProfileContentQuery = z.infer<typeof profileContentQuerySchema>