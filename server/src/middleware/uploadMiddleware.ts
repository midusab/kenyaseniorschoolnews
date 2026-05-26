import multer from 'multer';

// Use memory storage for quick binary streaming to Cloudinary
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max limit: 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only standard image attachments are supported.') as any, false);
    }
  }
});
