import { prisma } from '~/config/database'
import type { Prisma } from '~/generated/prisma/client'

class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        avatar: true
      }
    })
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    })
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: {
        avatar: true
      }
    })
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        avatar: true
      }
    })
  }
}

export default new UserRepository()
