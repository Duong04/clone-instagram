import { z } from 'zod'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']
const ALLOWED_MEDIA_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

export const uploadMediaSchema = z
  .object({
    mimetype: z.string().refine((type) => ALLOWED_MEDIA_TYPES.includes(type), {
      message: `Chỉ chấp nhận: ${ALLOWED_MEDIA_TYPES.join(', ')}`
    }),
    size: z.number(),
    buffer: z.instanceof(Buffer, { message: 'File không hợp lệ' })
  })
  .refine(
    ({ mimetype, size }) => {
      if (ALLOWED_IMAGE_TYPES.includes(mimetype)) return size <= MAX_IMAGE_SIZE
      return size <= MAX_VIDEO_SIZE
    },
    {
      message: 'File vượt quá dung lượng cho phép (ảnh: 10MB, video: 100MB)',
      path: ['size']
    }
  )

export const confirmUploadSchema = z.object({
  public_id: z.string().min(1, 'public_id không được để trống'),
  url: z.string().url('URL không hợp lệ'),
  media_type: z.string().refine((type) => ALLOWED_MEDIA_TYPES.includes(type), {
    message: `Chỉ chấp nhận: ${ALLOWED_MEDIA_TYPES.join(', ')}`
  }),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  duration: z.number().int().positive().optional()
})

export const deleteMediaSchema = z.object({
  id: z.string().uuid('ID không hợp lệ')
})

export const deleteManyMediaSchema = z.object({
  ids: z.array(z.string().uuid('ID không hợp lệ')).min(1, 'Cần ít nhất 1 ID').max(20, 'Tối đa 20 file mỗi lần xóa')
})

export const presignSchema = z.object({
  folder: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9_-]+$/, 'Folder chỉ được chứa chữ thường, số, dấu - và _')
    .default('general')
})

export type UploadMediaDto = z.infer<typeof uploadMediaSchema>
export type ConfirmUploadDto = z.infer<typeof confirmUploadSchema>
export type DeleteMediaDto = z.infer<typeof deleteMediaSchema>
export type DeleteManyMediaDto = z.infer<typeof deleteManyMediaSchema>
export type PresignDto = z.infer<typeof presignSchema>
