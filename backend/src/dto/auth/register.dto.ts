import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
})

export type RegisterDto = z.infer<typeof registerSchema>
