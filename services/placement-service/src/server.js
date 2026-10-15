const app = require('./app');
const environment = require('./config/environment');
const { connectDB, disconnectDB } = require('./config/database');

const start = async () => {
  // Connect to MongoDB only when a URI is configured
  if (environment.mongodbUri) {
    try {
      await connectDB();
    } catch (err) {
      console.warn('[Placement Service] MongoDB connection warning:', err.message);
      console.log('[Placement Service] Server starting in resilient mode. Retrying database connection in background...');
      setTimeout(() => connectDB().catch(() => {}), 5000);
    }
  } else {
    console.warn(
      '[Placement Service] MONGODB_URI not set — running without database connection.'
    );
  }

  const server = app.listen(environment.port, () => {
    console.log(
      `[Placement Service] Listening on port ${environment.port} (${environment.nodeEnv})`
    );
  });

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`[Placement Service] ${signal} received — shutting down.`);
    server.close(async () => {
      if (environment.mongodbUri) {
        await disconnectDB();
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start();
