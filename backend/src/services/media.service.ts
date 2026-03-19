import mediaRepository from '~/repositories/media.repository'
import { Media } from '~/generated/prisma/client'
import { cloudinaryUpload, cloudinaryUploadMany, cloudinaryDelete } from './cloundinary.service'

class MediaService {
  async uploadOne(file: Express.Multer.File, folder: string = 'general'): Promise<Media> {
    const uploaded = await cloudinaryUpload(file, folder)

    const media = await mediaRepository.create({
      url: uploaded.url,
      public_id: uploaded.public_id,
      media_type: file.mimetype,
      width: uploaded.width ?? null,
      height: uploaded.height ?? null,
      duration: uploaded.duration ?? null
    })

    return media
  }

  async uploadMany(files: Express.Multer.File[], folder: string = 'general'): Promise<Media[]> {
    const uploaded = await cloudinaryUploadMany(files, folder)

    const mediaList = await Promise.all(
      uploaded.map((item, index) =>
        mediaRepository.create({
          url: item.url,
          public_id: item.public_id,
          media_type: files[index].mimetype,
          width: item.width ?? null,
          height: item.height ?? null,
          duration: item.duration ?? null
        })
      )
    )

    return mediaList
  }

  async deleteOne(id: string): Promise<void> {
    const media = await mediaRepository.findById(id)

    if (!media) {
      throw new Error(`Media ${id} không tồn tại`)
    }

    const resourceType = media.media_type.startsWith('video/') ? 'video' : 'image'

    await cloudinaryDelete(media.public_id, resourceType)
    await mediaRepository.delete(id)
  }

  async deleteMany(ids: string[]): Promise<void> {
    await Promise.all(ids.map((id) => this.deleteOne(id)))
  }
}

export default new MediaService()
