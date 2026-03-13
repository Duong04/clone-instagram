import type { User } from '~/generated/prisma/client.js'

export type RegisterInput = {
  username: string
  name: string
  email: string
  password: string
}

export type { User }
