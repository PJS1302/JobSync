const app = require('./app');
const environment = require('./config/environment');
const { connectDB, disconnectDB } = require('./config/database');

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    const server = app.listen(environment.port, () => {
      console.log(`[Student Service] Running on port ${environment.port} in ${environment.nodeEnv} mode`);
      console.log(`[Student Service] Base URL: http://localhost:${environment.port}/api/v1`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`[Student Service] Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Student Service] Process terminated cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    return server;
  } catch (error) {
    console.error(`[Student Service] Failed to initialize server: ${error.message}`);
    process.exit(1);
  }
};

// Start if executed directly
if (require.main === module) {
  startServer();
}

module.exports = { startServer };
