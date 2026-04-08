import commentService from '~/services/comment.service'
import { Request, Response, NextFunction } from 'express'
import { sendSuccess, sendError } from '~/utils/response'
import { getCommentsQuerySchema, createCommentBodySchema, updateCommentBodySchema } from '~/dto/comment/comment.dto'

class CommentController {
  async allByFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, cursor, targetType } = getCommentsQuerySchema.parse(req.query)
      const { targetId } = req.params as { targetId: string }
      const result = await commentService.allByFeed(targetId, targetType, limit, cursor)

      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta
      })
    } catch (error) {
      next(error)
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string }
      const result = await commentService.find(id)
      return sendSuccess({ res, data: result })
    } catch (error) {
      next(error)
    }
  }

  async findReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string }
      const { limit, cursor } = getCommentsQuerySchema.parse(req.query)
      const result = await commentService.findReplies(id, limit, cursor)
      return sendSuccess({ res, data: result.data, meta: result.meta })
    } catch (error) {
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError({ res, message: 'Unauthorized', statusCode: 401 })
      }
      const userId = req.user.id

      const { content, target_id, target_type, parent_id } = createCommentBodySchema.parse(req.body)

      const result = await commentService.create({
        content,
        target_id,
        target_type,
        parent_id,
        user_id: userId
      })
      return sendSuccess({ res, data: result, message: 'Comment created successfully', statusCode: 201 })
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string }
      const { content } = updateCommentBodySchema.parse(req.body)
      const result = await commentService.update({ content }, id)
      return sendSuccess({ res, data: result, message: 'Comment updated successfully' })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string }
      await commentService.delete(id)
      return sendSuccess({ res, message: 'Comment deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}

export default new CommentController()
