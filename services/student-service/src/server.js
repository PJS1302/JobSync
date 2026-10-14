const app = require('./app');
const environment = require('./config/environment');
const { connectDB, disconnectDB } = require('./config/database');

const start = async () => {
  // Connect to MongoDB only when a URI is configured
  if (environment.mongodbUri) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[Student Service] Failed to connect to MongoDB:', err.message);
      process.exit(1);
    }
  } else {
    console.warn('[Student Service] MONGODB_URI not set — running without database connection.');
  }

  const server = app.listen(environment.port, () => {
    console.log(
      `[Student Service] Listening on port ${environment.port} (${environment.nodeEnv})`
    );
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`[Student Service] ${signal} received — shutting down.`);
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
