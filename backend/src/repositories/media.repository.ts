import { prisma } from '~/config/database'
import type { Prisma } from '~/generated/prisma/client'

class MediaRepository {
  async create(data: Prisma.MediaCreateInput) {
    return prisma.media.create({ data })
  }

  async createMany(data: Prisma.MediaCreateManyInput[]): Promise<number> {
    const result = await prisma.media.createMany({ data })
    return result.count
  }

  async findById(id: string) {
    return prisma.media.findUnique({
      where: { id }
    })
  }

  async delete(id: string) {
    return prisma.media.delete({
      where: { id }
    })
  }
}

export default new MediaRepository()
