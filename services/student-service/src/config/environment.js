const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobsync_student_db',
  jwtSecret: process.env.JWT_SECRET || 'jobsync_dev_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  placementServiceUrl: process.env.PLACEMENT_SERVICE_URL || 'http://localhost:5002/api/v1',
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
};

module.exports = environment;
