const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://prejitjsanthosh_db_user:jobsync%4026@cluster0.wpbdsnt.mongodb.net/jobsync_student_db?retryWrites=true&w=majority',
  placementServiceUrl: process.env.PLACEMENT_SERVICE_URL || 'http://localhost:5002',
};

module.exports = environment;
