const fs = require('fs');
const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const Student = require('../models/Student');

/**
 * Handle resume upload and persistence for a student.
 * @param {string} studentId
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>}
 */
const uploadResume = async (studentId, file) => {
  if (!studentId) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    const error = new Error('Student ID is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    const error = new Error('Invalid student ID format.');
    error.statusCode = 400;
    throw error;
  }

  if (!file) {
    const error = new Error('No resume file uploaded.');
    error.statusCode = 400;
    throw error;
  }

  // Verify student exists
  const student = await Student.findById(studentId);
  if (!student) {
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  const resume = await Resume.create({
    studentId,
    originalFilename: file.originalname,
    filePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
    uploadDate: new Date(),
    extractedText: 'Extracted text placeholder (pending AI processing)',
  });

  return resume;
};

/**
 * Retrieve the latest resume for a student.
 * @param {string} studentId
 * @returns {Promise<Object>}
 */
const getResumeByStudentId = async (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const error = new Error('Invalid student ID format.');
    error.statusCode = 400;
    throw error;
  }

  // Verify student exists
  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  const resume = await Resume.findOne({ studentId }).sort({
    uploadDate: -1,
    createdAt: -1,
  });

  if (!resume) {
    const error = new Error('Resume not found for this student.');
    error.statusCode = 404;
    throw error;
  }

  return resume;
};

module.exports = {
  uploadResume,
  getResumeByStudentId,
};
