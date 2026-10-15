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

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/v1/companies', require('./routes/companyRoutes'));
app.use('/api/drives', require('./routes/driveRoutes'));
app.use('/api/v1/drives', require('./routes/driveRoutes'));
app.use('/api/eligibility', require('./routes/eligibilityRoutes'));
app.use('/api/v1/eligibility', require('./routes/eligibilityRoutes'));
app.use('/api/screening', require('./routes/screeningRoutes'));
app.use('/api/v1/screening', require('./routes/screeningRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/v1/interviews', require('./routes/interviewRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
