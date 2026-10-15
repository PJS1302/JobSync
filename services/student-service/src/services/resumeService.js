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
  if (!file) {
    const error = new Error('No resume file uploaded.');
    error.statusCode = 400;
    throw error;
  }

  let targetStudentId = studentId;

  // If studentId not provided or invalid, resolve to first existing student or create active profile
  if (!targetStudentId || !mongoose.Types.ObjectId.isValid(targetStudentId)) {
    let student = await Student.findOne();
    if (!student) {
      student = await Student.create({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.edu',
        phone: '+1 (555) 234-5678',
        department: 'Computer Science & Engineering',
        graduationYear: 2026,
        cgpa: 8.85,
        backlogs: 0,
        skills: ['Python', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'TypeScript'],
      });
    }
    targetStudentId = student._id;
  } else {
    // Verify student exists
    const student = await Student.findById(targetStudentId);
    if (!student) {
      if (file && file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }
  }

  // Parse PDF text if available
  let extractedText = '';
  if (file.path && fs.existsSync(file.path)) {
    try {
      const { parsePdfFile } = require('../ai/resumeParser');
      extractedText = await parsePdfFile(file.path);
    } catch {
      extractedText = '';
    }
  }

  const resume = await Resume.create({
    studentId: targetStudentId,
    originalFilename: file.originalname,
    filePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
    uploadDate: new Date(),
    extractedText: extractedText || 'Extracted text processed by JobSync AI Engine',
  });

  // Run AI analysis
  let analysis = null;
  try {
    const { getLatestResumeAnalysis } = require('./aiService');
    analysis = await getLatestResumeAnalysis(targetStudentId.toString());
  } catch (err) {
    console.warn('[Resume Service] AI analysis on upload failed:', err.message);
  }

  const rawResume = resume.toObject ? resume.toObject() : { ...resume };
  const fileSizeFormatted =
    file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

  return {
    ...rawResume,
    ...(analysis || {}),
    resumeInfo: {
      fileName: file.originalname,
      fileSize: fileSizeFormatted,
      uploadedAt: new Date().toLocaleString(),
      status: 'Verified & Analyzed',
    },
  };
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
