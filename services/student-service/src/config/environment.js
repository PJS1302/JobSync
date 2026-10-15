const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://dharaneesh0530_db_user:Dharaneesh!30@cluster0.hgkmalq.mongodb.net/jobsync_student_db?retryWrites=true&w=majority',
  placementServiceUrl: process.env.PLACEMENT_SERVICE_URL || 'http://localhost:5002',
  geminiApiKey: process.env.GEMINI_API_KEY || 'AIzaSyD9uivN4RsTIu3MdW_sCTfPlN1-sjuxcBE',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-flash-latest',
};

module.exports = environment;
