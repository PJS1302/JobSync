const express = require('express');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const placementRoutes = require('./routes/placementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');
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
app.use('/api/auth', authRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/v1/resume', resumeRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/v1/interviews', interviewRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/v1/placements', placementRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
