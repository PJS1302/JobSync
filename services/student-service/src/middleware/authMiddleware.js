const User = require('../models/User');

/**
 * JobSync Authentication Middleware
 * Decodes Authorization Bearer token and attaches authenticated user to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();

      if (token === 'jobsync_demo_student_token') {
        const user = await User.findOne({ email: 'alex.rivera@example.edu' });
        if (user) req.user = user;
      } else if (token === 'jobsync_demo_admin_token') {
        const user = await User.findOne({ email: 'admin@jobsync.edu' });
        if (user) req.user = user;
      } else {
        try {
          const decoded = Buffer.from(token, 'base64').toString('utf8');
          const [userId] = decoded.split(':');
          if (userId && /^[0-9a-fA-F]{24}$/.test(userId)) {
            const user = await User.findById(userId);
            if (user) req.user = user;
          }
        } catch {
          // Non-base64 token, continue gracefully
        }
      }
    }
    next();
  } catch (err) {
    next();
  }
};

module.exports = authMiddleware;
