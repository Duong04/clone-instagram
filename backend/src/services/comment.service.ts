import { ContentType, Prisma } from '~/generated/prisma/client'
import commentRepository from '~/repositories/comment.repository'
import type { CreateCommentDTO } from '~/dto/comment/comment.dto'
import { prisma } from '~/config/database'

class CommentService {
  async allByFeed(targetId: string, targetType: ContentType, limit: number = 10, cursor?: string) {
    return commentRepository.allByFeed(targetId, targetType, limit, cursor)
  }

  async find(id: string) {
    return commentRepository.find(id)
  }

  async findReplies(parentId: string, limit: number = 10, cursor?: string) {
    return commentRepository.findReplies(parentId, limit, cursor)
  }

  async create(data: CreateCommentDTO) {
    return await prisma.$transaction(async (tx) => {
      const comment = await commentRepository.create(tx, data)
      if (comment) {
        await commentRepository.updateCommentCount(tx, data.target_id, data.target_type, 1)
      }
      return comment
    })
  }

  async update(data: Prisma.CommentUpdateInput, id: string) {
    return commentRepository.update(data, id)
  }

  async delete(id: string) {
    await prisma.$transaction(async (tx) => {
      const comment = await commentRepository.find(id, tx)
      if (comment) {
        const total = 1 + comment._count.replies
        await commentRepository.updateCommentCount(tx, comment.target_id, comment.target_type, -total)
        await commentRepository.delete(tx, id)
      }
    })
  }
}

export default new CommentService()
