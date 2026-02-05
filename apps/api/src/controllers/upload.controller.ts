import type { Request, Response, NextFunction } from 'express'
import { cloudinaryFolders } from '../config/cloudinary.js'
import { uploadImageBuffer } from '../services/upload.service.js'

const getSingleFile = (req: Request): Express.Multer.File | undefined => {
  const anyReq = req as unknown as { file?: Express.Multer.File }
  return anyReq.file
}

const getManyFiles = (req: Request): Express.Multer.File[] => {
  const anyReq = req as unknown as {
    files?: Express.Multer.File[] | Record<string, Express.Multer.File[]>
  }
  const files = anyReq.files
  if (!files) return []
  if (Array.isArray(files)) return files
  return Object.values(files).flat()
}

const uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    const file = getSingleFile(req)
    if (!file) {
      res.status(400).json({ success: false, error: 'Avatar file is required' })
      return
    }

    const uploaded = await uploadImageBuffer(file.buffer, {
      folder: cloudinaryFolders.avatars,
      public_id: req.user.id,
      overwrite: true,
    })

    res.status(201).json({ success: true, data: uploaded })
  } catch (error) {
    next(error)
  }
}

const uploadPostMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    const files = getManyFiles(req)
    if (files.length === 0) {
      res.status(400).json({ success: false, error: 'At least one image file is required' })
      return
    }

    if (files.length > 4) {
      res.status(400).json({ success: false, error: 'You can upload up to 4 images' })
      return
    }

    const uploaded = await Promise.all(
      files.map((f) =>
        uploadImageBuffer(f.buffer, {
          folder: cloudinaryFolders.posts,
        })
      )
    )

    res.status(201).json({ success: true, data: uploaded })
  } catch (error) {
    next(error)
  }
}

export const uploadController = {
  uploadAvatar,
  uploadPostMedia,
}
