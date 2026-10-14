const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { sendError } = require('../utils/apiResponse');

// Ensure uploads directory exists
const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedExt = path.extname(file.originalname).toLowerCase();
    cb(null, `resume-${uniqueSuffix}${sanitizedExt}`);
  },
});

// File filter: Only allow PDF files
const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPdfMime && isPdfExt) {
    return cb(null, true);
  }

  const error = new Error('Invalid file type. Only PDF files are allowed.');
  error.statusCode = 400;
  return cb(error, false);
};

// 5MB file-size limit
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Express middleware that handles resume file upload.
 * Supports multipart field names: 'resume' or 'file'.
 */
const uploadResume = (req, res, next) => {
  const uploadHandler = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]);

  uploadHandler(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return sendError(res, 'File size exceeds limit of 5MB.', 400);
        }
        return sendError(res, `Upload error: ${err.message}`, 400);
      }
      return sendError(res, err.message || 'File upload error', err.statusCode || 400);
    }

    // Attach single file to req.file for controller convenience
    req.file = req.files && (req.files.resume?.[0] || req.files.file?.[0]);
    return next();
  });
};

module.exports = {
  uploadResume,
  MAX_FILE_SIZE,
  uploadDir,
};
