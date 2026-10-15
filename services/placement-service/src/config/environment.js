const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5002,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://dharaneesh0530_db_user:Dharaneesh!30@cluster0.hgkmalq.mongodb.net/jobsync_placement_db?retryWrites=true&w=majority',
  studentServiceUrl: process.env.STUDENT_SERVICE_URL || 'http://localhost:5001',
};

module.exports = environment;
