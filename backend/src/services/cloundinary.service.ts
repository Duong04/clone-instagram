import { Readable } from 'stream'
import cloudinary from '~/config/cloundinary'
import type { CloudinaryResourceType, CloudinaryUploadResult, CloudinaryPresignResult } from '~/types/cloundinary.type'
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}

function getResourceType(mimetype: string): CloudinaryResourceType {
  return mimetype.startsWith('video/') ? 'video' : 'image'
}

export async function cloudinaryUpload(
  file: Express.Multer.File,
  folder: string = 'general'
): Promise<CloudinaryUploadResult> {
  const resourceType = getResourceType(file.mimetype)

  const finalFolder = process.env.CLOUDINARY_FOLDER + folder
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: finalFolder,
        resource_type: resourceType,
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Cloudinary does not return results.'))
        resolve(result)
      }
    )
    bufferToStream(file.buffer).pipe(stream)
  })

  return {
    public_id: result.public_id,
    url: result.secure_url,
    width: result.width ?? undefined,
    height: result.height ?? undefined,
    duration: result.duration ? Math.round(result.duration) : undefined
  }
}

export async function cloudinaryUploadMany(
  files: Express.Multer.File[],
  folder: string = 'general'
): Promise<CloudinaryUploadResult[]> {
  return Promise.all(files.map((file) => cloudinaryUpload(file, folder)))
}

export async function cloudinaryDelete(
  publicId: string,
  resourceType: CloudinaryResourceType = 'image'
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}

export function cloudinaryPresign(folder: string = 'general'): CloudinaryPresignResult {
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET!)
  const finalFolder = process.env.CLOUDINARY_FOLDER + folder

  return {
    timestamp,
    signature,
    api_key: process.env.CLOUDINARY_API_KEY!,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: finalFolder
  }
}
