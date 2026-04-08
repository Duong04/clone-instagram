import { ContentType, Prisma } from '~/generated/prisma/client'
import commentRepository from '~/repositories/comment.repository'
import type { CreateCommentDTO } from '~/dto/comment/comment.dto'
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
    return commentRepository.create(data)
  }

  async update(data: Prisma.CommentUpdateInput, id: string) {
    return commentRepository.update(data, id)
  }

  async delete(id: string) {
    return commentRepository.update({ deleted_at: new Date() }, id)
  }
}

export default new CommentService()
