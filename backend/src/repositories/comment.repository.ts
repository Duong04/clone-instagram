import { prisma } from '~/config/database'
import { CreateCommentDTO } from '~/dto/comment/comment.dto'
import { ContentType, Prisma } from '~/generated/prisma/client'

type TX = Prisma.TransactionClient

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

  async create(tx: TX, data: CreateCommentDTO) {
    return tx.comment.create({
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

  async find(id: string, tx: TX = prisma) {
    return tx.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        created_at: true,
        like_count: true,
        target_id: true,
        target_type: true,
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

  async delete(tx: TX, id: string) {
    await tx.comment.deleteMany({
      where: { parent_id: id }
    })
    return tx.comment.delete({
      where: { id }
    })
  }

  async updateCommentCount(tx: TX, targetId: string, targetType: ContentType, offset: number) {
    const data = { comment_count: { increment: offset } }
    if (targetType === ContentType.post) {
      return tx.post.update({ where: { id: targetId }, data })
    }
    if (targetType === ContentType.reel) {
      return tx.reel.update({ where: { id: targetId }, data })
    }
  }
}

export default new CommentRepository()
