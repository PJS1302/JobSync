const multer = require('multer');
const { sendError } = require('../utils/apiResponse');

const notFound = (req, res, next) => {
  return sendError(res, `Resource not found: ${req.originalUrl}`, 404);
};

const errorHandler = (err, req, res, next) => {
  console.error('[Student Service Error]:', err);

  // Multer specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, 'File size exceeds maximum allowed limit (5MB)', 400);
    }
    return sendError(res, `Upload error: ${err.message}`, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, `Validation error: ${messages.join(', ')}`, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || {});
    return sendError(res, `Duplicate field value entered for: ${fields.join(', ')}`, 409);
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid ID format for field ${err.path}`, 400);
  }

  // Explicit status on error object
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

module.exports = {
  notFound,
  errorHandler,
};
