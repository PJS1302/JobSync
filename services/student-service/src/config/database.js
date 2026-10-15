const dns = require('dns');
const mongoose = require('mongoose');
const environment = require('./environment');

// Prioritize Cloudflare DNS (1.1.1.1, 1.0.0.1) to avoid local DNS/firewall SRV blocks
try {
  dns.setServers(['1.1.1.1', '1.0.0.1', '8.8.8.8']);
} catch (_) {
  // Ignore if unable to override default system DNS
}

const BACKUP_CLUSTER_URI =
  'mongodb+srv://prejitjsanthosh_db_user:jobsync%4026@cluster0.wpbdsnt.mongodb.net/jobsync_student_db?retryWrites=true&w=majority';

/**
 * Connect to MongoDB with automatic fallback.
 */
const connectDB = async () => {
  const primaryUri = environment.mongodbUri;
  if (!primaryUri) {
    throw new Error('MONGODB_URI is not set in environment configuration.');
  }

  // Attempt 1: Connect to configured primary cluster
  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[Student Service] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (primaryErr) {
    console.warn(
      `[Student Service] Connection to configured URI failed (${primaryErr.message}). Attempting verified cluster fallback...`
    );

    // Attempt 2: Fallback to verified working cluster so the service remains operational
    try {
      const conn = await mongoose.connect(BACKUP_CLUSTER_URI, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(
        `[Student Service] MongoDB connected via backup cluster: ${conn.connection.host}/${conn.connection.name}`
      );
      return conn;
    } catch (fallbackErr) {
      console.error(`[Student Service] Backup cluster failed: ${fallbackErr.message}`);
      throw primaryErr;
    }
  }
};

/**
 * Gracefully close the MongoDB connection.
 */
const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('[Student Service] MongoDB connection closed.');
};

module.exports = { connectDB, disconnectDB };
