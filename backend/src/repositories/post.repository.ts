import { prisma } from '~/config/database'
import { Prisma } from '~/generated/prisma/client'
import { POST_INCLUDE } from '~/constants/post.constant'

class PostRepository {
  async all(limit: number = 10, cursor?: string) {
    const data = await prisma.post.findMany({
      where: { deleted_at: null },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { created_at: 'desc' },
      include: POST_INCLUDE
    })

    let nextCursor: typeof cursor | undefined = undefined
    let hasNextPage = false

    if (data.length > limit) {
      hasNextPage = true
      const nextItem = data.pop()
      nextCursor = nextItem?.id
    }

    return {
      data,
      meta: {
        nextCursor,
        hasNextPage,
        limit
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
