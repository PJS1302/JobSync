const mongoose = require('mongoose');
const environment = require('./environment');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(environment.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Student Service] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Student Service] MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('[Student Service] MongoDB Connection Closed.');
  } catch (error) {
    console.error(`[Student Service] MongoDB Close Error: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};
