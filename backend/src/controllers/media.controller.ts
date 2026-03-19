import { Request, Response, NextFunction } from 'express'
import mediaService from '~/services/media.service'
import { uploadMediaSchema, deleteMediaSchema, deleteManyMediaSchema } from '~/dto/media'
import { sendError, sendSuccess } from '~/utils/response'

class MediaController {
  async uploadOne(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file

      if (!file) {
        return sendError({
          res,
          message: 'No files were uploaded.',
          statusCode: 400
        })
      }

      uploadMediaSchema.parse({
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer
      })

      const media = await mediaService.uploadOne(file, req.body.folder)
      return sendSuccess({ res, data: media, statusCode: 201 })
    } catch (error) {
      next(error)
    }
  }

  async uploadMany(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[]

      if (!files || files.length === 0) {
        return sendError({
          res,
          message: 'No files were uploaded.',
          statusCode: 400
        })
      }

      files.forEach((file) =>
        uploadMediaSchema.parse({
          mimetype: file.mimetype,
          size: file.size,
          buffer: file.buffer
        })
      )

      const mediaList = await mediaService.uploadMany(files, req.body.folder)

      return sendSuccess({ res, data: mediaList, statusCode: 201 })
    } catch (error) {
      next(error)
    }
  }

  async deleteOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = deleteMediaSchema.parse({ id: req.params.id })

      await mediaService.deleteOne(id)

      return sendSuccess({ res, message: 'Delete media successfully.' })
    } catch (error) {
      next(error)
    }
  }

  async deleteMany(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = deleteManyMediaSchema.parse(req.body)

      await mediaService.deleteMany(ids)

      return sendSuccess({ res, message: `Deleted ${ids.length} media` })
    } catch (error) {
      next(error)
    }
  }
}

export default new MediaController()
