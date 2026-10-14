const fs = require('fs');
const path = require('path');
const multer = require('multer');
const environment = require('../config/environment');
const { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } = require('../utils/constants');

// Resolve target upload directory
const uploadDir = path.resolve(__dirname, '../../', environment.uploadPath, 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const studentId = req.student?.id || 'candidate';
    const timestamp = Date.now();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${studentId}_${timestamp}_${sanitizedBase}${ext}`);
  },
});

// File filter for allowed extensions
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only PDF and DOC/DOCX files are supported.');
    error.status = 400;
    cb(error, false);
  }
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter,
});

module.exports = {
  uploadResume,
};
