const express = require('express');
const cors = require('cors');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ── Core middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Placement Service is running',
  });
});

// ── Future route mounts go here ───────────────────────────────────────────────
// e.g. app.use('/api/v1/companies', require('./routes/companyRoutes'));

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
