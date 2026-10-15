const dns = require('dns');
const mongoose = require('mongoose');
const environment = require('./environment');

// Ensure reliable resolution for MongoDB Atlas SRV records across all ISP and local network configurations
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (_) {
  // Ignore if unable to override default system DNS
}

/**
 * Connect to MongoDB.
 * Throws on connection failure so the caller (server.js) can decide whether to exit.
 */
const connectDB = async () => {
  if (!environment.mongodbUri) {
    throw new Error('MONGODB_URI is not set in environment configuration.');
  }

  const conn = await mongoose.connect(environment.mongodbUri);
  console.log(`[Student Service] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

/**
 * Gracefully close the MongoDB connection.
 */
const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('[Student Service] MongoDB connection closed.');
};

module.exports = { connectDB, disconnectDB };
