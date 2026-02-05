import multer from 'multer'

type StatusError = Error & { statusCode?: number }

const badRequest = (message: string): StatusError => {
  const err = new Error(message) as StatusError
  err.statusCode = 400
  return err
}

const allowedImageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const imageFileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!allowedImageMimeTypes.has(file.mimetype)) {
    cb(badRequest('Only image files are allowed (jpeg, png, webp, gif)'))
    return
  }
  cb(null, true)
}

const memoryStorage = multer.memoryStorage()

export const avatarUpload = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
})

export const postMediaUpload = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 4,
  },
})
