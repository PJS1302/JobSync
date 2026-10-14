const jwt = require('jsonwebtoken');
const environment = require('../config/environment');
const { sendError } = require('../utils/apiResponse');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // In dev mode or for inter-service communication, allow x-student-id if token is not provided
    if (!token && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') && req.headers['x-student-id']) {
      req.student = { id: req.headers['x-student-id'] };
      return next();
    }

    if (!token) {
      return sendError(res, 'Authentication token missing or invalid', 401);
    }

    const decoded = jwt.verify(token, environment.jwtSecret);
    req.student = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Authentication token has expired', 401);
    }
    return sendError(res, 'Invalid authentication token', 401);
  }
};

module.exports = {
  authenticate,
};
