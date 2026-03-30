import { prisma } from '~/config/database'
import { Prisma } from '~/generated/prisma/client'
import { POST_INCLUDE } from '~/constants/post.constant'

class PostRepository {
  async all(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: POST_INCLUDE
      }),
      prisma.post.count({
        where: { deleted_at: null }
      })
    ])

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    }
  }

  async create(data: Prisma.PostCreateInput) {
    return prisma.post.create({ data, include: POST_INCLUDE })
  }

  async find(id: string) {
    return prisma.post.findUnique({
      where: { id, deleted_at: null },
      include: POST_INCLUDE
    })
  }

  async findByUser(userId: string) {
    return prisma.post.findMany({
      where: { user_id: userId, deleted_at: null }
    })
  }

  async findFirstByUser(id: string, userId: string) {
    return prisma.post.findFirst({
      where: { id, user_id: userId, deleted_at: null }
    })
  }

  async update(data: Prisma.PostUpdateInput, id: string) {
    return prisma.post.update({
      where: { id, deleted_at: null },
      data
    })
  }

  async softDelete(id: string) {
    return prisma.post.update({
      where: { id },
      data: { deleted_at: new Date() }
    })
  }

  async delete(id: string) {
    return prisma.post.delete({
      where: { id }
    })
  }
}

export default new PostRepository()
