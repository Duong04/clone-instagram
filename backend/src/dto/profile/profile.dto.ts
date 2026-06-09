import { z } from 'zod'

export const profileContentQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 12)),
  cursor: z.string().optional(),
  type: z.enum(['all', 'post', 'reel']).default('all')
})

export const updateProfileBodySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9._]+$/)
    .optional(),
  bio: z.string().max(150).nullable().optional(),
  website: z.string().url().nullable().optional(),
  is_private: z.boolean().optional()
})

export type ProfileContentQuery = z.infer<typeof profileContentQuerySchema>
export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>
