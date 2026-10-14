const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const environment = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  placementServiceUrl: process.env.PLACEMENT_SERVICE_URL || 'http://localhost:5002',
};

module.exports = environment;
