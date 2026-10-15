const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, result, 201);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, 200);
  } catch (err) {
    return next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token required', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    const [userId] = decoded.split(':');
    const user = await authService.getCurrentUser(userId);
    return sendSuccess(res, { user }, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
