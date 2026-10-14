const { sendError } = require('../utils/apiResponse');

/**
 * 404 – route not found.
 */
const notFound = (req, res) => {
  return sendError(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
};

/**
 * Centralized Express error handler.
 * Must have exactly four parameters so Express recognises it as an error middleware.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[Placement Service]', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return sendError(res, `Validation error: ${messages.join(', ')}`, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {}).join(', ');
    return sendError(res, `Duplicate value for field: ${field}`, 409);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendError(res, `Invalid ID format for field: ${err.path}`, 400);
  }

  const status = err.statusCode || err.status || 500;
  return sendError(res, err.message || 'Internal Server Error', status);
};

module.exports = { notFound, errorHandler };
