import { z } from 'zod'

export const getAllPostSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().positive('Page must be greater than 0.')),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().positive().max(50, 'The maximum limit is 50.'))
})

export const getPostSchema = z.object({
  id: z.string().uuid('ID không hợp lệ')
})

export const createPostSchema = z.object({
  caption: z.string().max(2200, 'Caption maximum 2200 characters').optional(),
  location: z.string().max(255, 'Location maximum 255 characters').optional(),
  comments_disabled: z.boolean().default(false),
  media_ids: z
    .array(z.string().uuid('Invalid Media ID'))
    .min(1, 'At least one photo or video is required.')
    .max(10, 'Maximum 10 photos or videos')
})

export const updatePostSchema = z.object({
  caption: z.string().max(2200, 'Caption maximum 2200 characters').optional(),
  location: z.string().max(255, 'Location maximum 255 characters').optional(),
  comments_disabled: z.boolean().optional()
})

export type GetAllPostDto = z.infer<typeof getAllPostSchema>
export type GetPostDto = z.infer<typeof getPostSchema>
export type CreatePostDto = z.infer<typeof createPostSchema>
export type UpdatePostDto = z.infer<typeof updatePostSchema>
