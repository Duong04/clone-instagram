import { prisma } from '~/config/database'

class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: { username: string; name: string; email: string; password: string }) {
    return prisma.user.create({ data })
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  }
}

export default new UserRepository()
