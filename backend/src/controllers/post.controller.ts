import { Request, Response, NextFunction } from 'express'
import postService from '~/services/post.service'
import { getAllPostSchema, getPostSchema, createPostSchema, updatePostSchema } from '~/dto/post'
import { sendSuccess, sendError } from '~/utils/response'

class PostController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = getAllPostSchema.parse(req.query)

      const result = await postService.getAll(page, limit)

      return sendSuccess({
        res,
        data: result.data,
        meta: result.meta
      })
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = getPostSchema.parse(req.params)

      const post = await postService.getById(id)

      return sendSuccess({
        res,
        data: post
      })
    } catch (error) {
      next(error)
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError({ res, message: 'Unauthorized', statusCode: 401 })
      }

      const dto = createPostSchema.parse(req.body)
      const post = await postService.create(req.user.id, dto)

      return sendSuccess({
        res,
        data: post,
        statusCode: 201
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError({ res, message: 'Unauthorized', statusCode: 401 })
      }

      const { id } = getPostSchema.parse(req.params)
      const dto = updatePostSchema.parse(req.body)

      const post = await postService.update(id, dto, req.user.id)

      return sendSuccess({
        res,
        data: post,
        statusCode: 200
      })
    } catch (error) {
      next(error)
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError({ res, message: 'Unauthorized', statusCode: 401 })
      }
      const { id } = getPostSchema.parse(req.params)

      await postService.remove(id, req.user.id)

      return sendSuccess({
        res,
        message: 'Post deleted successfully.'
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new PostController()
