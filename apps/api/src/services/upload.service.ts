import type { UploadApiOptions, UploadApiResponse } from 'cloudinary'
import { cloudinary } from '../config/cloudinary.js'

export type UploadedImage = {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
}

export const uploadImageBuffer = async (
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadedImage> => {
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', ...options },
      (error, uploadResult) => {
        if (error) {
          reject(error)
          return
        }
        if (!uploadResult) {
          reject(new Error('Cloudinary upload failed'))
          return
        }
        resolve(uploadResult)
      }
    )

    stream.end(buffer)
  })

  if (!result.secure_url || !result.public_id) {
    throw new Error('Cloudinary upload returned an invalid response')
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  }
}
