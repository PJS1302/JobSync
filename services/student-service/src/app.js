const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
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
    message: 'Student Service is running',
  });
});

// ── Route mounts ──────────────────────────────────────────────────────────────
app.use('/api/students', studentRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/v1/resume', resumeRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/v1/resumes', resumeRoutes);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
