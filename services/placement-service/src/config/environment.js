const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5002,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jobsync_placement_db',
  studentServiceUrl: process.env.STUDENT_SERVICE_URL || 'http://localhost:5001',
};

module.exports = environment;
