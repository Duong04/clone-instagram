import { prisma } from '~/config/database'
import { CreateCommentDTO } from '~/dto/comment/comment.dto'
import { ContentType, Prisma } from '~/generated/prisma/client'

const userSelect = {
  id: true,
  username: true,
  name: true,
  avatar: { select: { url: true } }
}

class CommentRepository {
  async allByFeed(targetId: string, targetType: ContentType, limit: number = 10, cursor?: string) {
    const data = await prisma.comment.findMany({
      where: {
        target_id: targetId,
        target_type: targetType,
        parent_id: null
      },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        content: true,
        created_at: true,
        like_count: true,
        user: { select: userSelect },

        _count: {
          select: { replies: true }
        },
        replies: {
          take: 2,
          orderBy: { created_at: 'asc' },
          select: {
            id: true,
            content: true,
            user: { select: userSelect }
          }
        }
      }
    })

    const hasNextPage = data.length > limit
    const comments = hasNextPage ? data.slice(0, limit) : data

    const nextCursor = hasNextPage ? comments[comments.length - 1].id : null

    return {
      data: comments,
      meta: {
        nextCursor,
        hasNextPage,
        limit
      }
    }
  }

  async create(data: CreateCommentDTO) {
    return prisma.comment.create({
      data: {
        content: data.content,
        target_id: data.target_id,
        target_type: data.target_type,
        user: { connect: { id: data.user_id } },
        ...(data.parent_id && {
          parent: { connect: { id: data.parent_id } }
        })
      },
      select: {
        id: true,
        content: true,
        created_at: true,
        like_count: true,
        user: { select: userSelect }
      }
    })
  }

  async update(data: Prisma.CommentUpdateInput, id: string) {
    return prisma.comment.update({
      where: { id },
      data,
      select: {
        id: true,
        content: true,
        created_at: true,
        like_count: true,
        user: { select: userSelect }
      }
    })
  }

  async find(id: string) {
    return prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        created_at: true,
        like_count: true,

        user: { select: userSelect },

        parent: {
          select: {
            id: true,
            content: true,
            created_at: true,
            like_count: true,
            user: { select: userSelect }
          }
        },
        replies: {
          take: 3,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            content: true,
            created_at: true,
            like_count: true,
            user: { select: userSelect }
          }
        },

        _count: {
          select: {
            replies: true
          }
        }
      }
    })
  }

  async findReplies(parentId: string, limit: number, cursor?: string) {
    const data = await prisma.comment.findMany({
      where: { parent_id: parentId },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        content: true,
        created_at: true,
        like_count: true,
        user: { select: userSelect }
      }
    })

    const hasNextPage = data.length > limit
    const replies = hasNextPage ? data.slice(0, limit) : data
    const nextCursor = hasNextPage ? replies[replies.length - 1].id : null

    return {
      data: replies,
      meta: { nextCursor, hasNextPage, limit }
    }
  }

  async delete(id: string) {
    return prisma.comment.delete({
      where: { id }
    })
  }
}

export default new CommentRepository()
