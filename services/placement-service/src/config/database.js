const dns = require('dns');
const mongoose = require('mongoose');
const environment = require('./environment');

// Prioritize Cloudflare DNS (1.1.1.1, 1.0.0.1) as 8.8.8.8 is often blocked on local/campus networks
try {
  dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8']);
} catch (_) {
  // Ignore if unable to override default system DNS
}

const DIRECT_REPLICA_FALLBACK =
  'mongodb://prejitjsanthosh_db_user:jobsync%4026@ac-d6n30zt-shard-00-00.wpbdsnt.mongodb.net:27017,ac-d6n30zt-shard-00-01.wpbdsnt.mongodb.net:27017,ac-d6n30zt-shard-00-02.wpbdsnt.mongodb.net:27017/jobsync_placement_db?ssl=true&replicaSet=atlas-d6n30zt-shard-0&authSource=admin&retryWrites=true&w=majority';

/**
 * Connect to MongoDB with automatic fallback.
 */
const connectDB = async () => {
  if (!environment.mongodbUri) {
    throw new Error('MONGODB_URI is not defined in environment configuration.');
  }

  try {
    const conn = await mongoose.connect(environment.mongodbUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `[Placement Service] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );
    return conn;
  } catch (primaryErr) {
    console.warn(
      `[Placement Service] Primary connection failed (${primaryErr.message}). Attempting direct replica set fallback...`
    );
    try {
      const conn = await mongoose.connect(DIRECT_REPLICA_FALLBACK, {
        serverSelectionTimeoutMS: 10000,
      });
      console.log(
        `[Placement Service] MongoDB connected via direct replica set: ${conn.connection.host}/${conn.connection.name}`
      );
      return conn;
    } catch (fallbackErr) {
      console.error(`[Placement Service] Direct fallback failed: ${fallbackErr.message}`);
      throw primaryErr;
    }
  }
};

/**
 * Gracefully close the MongoDB connection.
 */
const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('[Placement Service] MongoDB connection closed.');
};

module.exports = { connectDB, disconnectDB };
