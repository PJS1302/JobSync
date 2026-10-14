const mongoose = require('mongoose');
const Interview = require('../models/Interview');
const Student = require('../models/Student');

/**
 * Record a scheduled interview for a student.
 * (Interview scheduling is managed by Placement Service, but records are stored/synced for the student).
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const createInterview = async (data) => {
  const { studentId, driveId, roundName, date, time } = data;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const error = new Error('Valid student ID is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!driveId || !roundName || !date || !time) {
    const error = new Error('driveId, roundName, date, and time are required.');
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

  if (data.mode && !Interview.MODES.includes(data.mode)) {
    const error = new Error(`Invalid mode: ${data.mode}. Allowed values: ${Interview.MODES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (data.status && !Interview.STATUSES.includes(data.status)) {
    const error = new Error(`Invalid status: ${data.status}. Allowed values: ${Interview.STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  return Interview.create({
    studentId,
    applicationId: data.applicationId || null,
    driveId,
    roundName,
    date: new Date(date),
    time,
    mode: data.mode || 'ONLINE',
    locationOrLink: data.locationOrLink || '',
    status: data.status || 'SCHEDULED',
  });
};

/**
 * Retrieve all scheduled interviews for a student.
 * @param {string} studentId
 * @returns {Promise<Array>}
 */
const getInterviewsByStudent = async (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const error = new Error('Invalid student ID format.');
    error.statusCode = 400;
    throw error;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  return Interview.find({ studentId }).sort({ date: 1, time: 1 });
};

/**
 * Retrieve an interview by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getInterviewById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid interview ID format.');
    error.statusCode = 400;
    throw error;
  }

  return Interview.findById(id);
};

module.exports = {
  createInterview,
  getInterviewsByStudent,
  getInterviewById,
};
