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

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' })
      return
    }

    const { type } = req.params
    let folder: string
    let files: Express.Multer.File[]
    let public_id: string | undefined = undefined
    let overwrite = false

    switch (type) {
      case 'avatar':
        folder = cloudinaryFolders.avatars
        files = getSingleFile(req) ? [getSingleFile(req)!] : []
        public_id = req.user.id
        overwrite = true
        if (files.length === 0) {
          res.status(400).json({ success: false, error: 'Avatar file is required' })
          return
        }
        break
      case 'cover':
        folder = cloudinaryFolders.covers
        files = getSingleFile(req) ? [getSingleFile(req)!] : []
        public_id = req.user.id
        overwrite = true
        if (files.length === 0) {
          res.status(400).json({ success: false, error: 'Cover image file is required' })
          return
        }
        break
      case 'post':
        folder = cloudinaryFolders.posts
        files = getManyFiles(req)
        if (files.length === 0) {
          res.status(400).json({ success: false, error: 'At least one image file is required' })
          return
        }
        if (files.length > 4) {
          res.status(400).json({ success: false, error: 'You can upload up to 4 images' })
          return
        }
        break
      default:
        res.status(400).json({ success: false, error: 'Invalid upload type' })
        return
    }

    const uploaded = await Promise.all(
      files.map((f) =>
        uploadImageBuffer(f.buffer, {
          folder,
          ...(public_id ? { public_id } : {}),
          ...(overwrite ? { overwrite } : {}),
        })
      )
    )

    res.status(201).json({ success: true, data: type === 'post' ? uploaded : uploaded[0] })
  } catch (error) {
    next(error)
  }
}

export const uploadController = {
  uploadImage,
}
