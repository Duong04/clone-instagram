export type CloudinaryResourceType = 'image' | 'video'

export interface CloudinaryUploadResult {
  public_id: string
  url: string
  width?: number
  height?: number
  duration?: number
}

export interface CloudinaryPresignResult {
  timestamp: number
  signature: string
  api_key: string
  cloud_name: string
  folder: string
}
