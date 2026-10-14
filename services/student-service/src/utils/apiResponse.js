/**
 * Send a standardized success JSON response
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} [statusCode=200]
 */
const sendSuccess = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

/**
 * Send a standardized error JSON response
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 */
const sendError = (res, message = 'Internal Server Error', statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
