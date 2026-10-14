const mongoose = require('mongoose');
const environment = require('./environment');

/**
 * Connect to MongoDB (jobsync_placement_db).
 * Throws on connection failure so server.js can decide whether to exit.
 */
const connectDB = async () => {
  if (!environment.mongodbUri) {
    throw new Error('MONGODB_URI is not defined in environment configuration.');
  }

  const conn = await mongoose.connect(environment.mongodbUri);
  console.log(
    `[Placement Service] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
  );
  return conn;
};

/**
 * Gracefully close the MongoDB connection.
 */
const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('[Placement Service] MongoDB connection closed.');
};

module.exports = { connectDB, disconnectDB };
