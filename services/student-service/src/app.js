const path = require('path');
const express = require('express');
const cors = require('cors');
const environment = require('./config/environment');
const { sendSuccess } = require('./utils/apiResponse');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import routes
const studentRoutes = require('./routes/studentRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Core middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload directory
const uploadDir = path.resolve(__dirname, '../', environment.uploadPath);
app.use('/uploads', express.static(uploadDir));

// Health check endpoints
const healthHandler = (req, res) => {
  return sendSuccess(res, {
    status: 'healthy',
    service: 'student-service',
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/v1/health', healthHandler);

// Mount API routes
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/resumes', resumeRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
