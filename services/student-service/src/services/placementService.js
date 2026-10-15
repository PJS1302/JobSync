const mongoose = require('mongoose');
const Placement = require('../models/Placement');
const Student = require('../models/Student');

/**
 * Record a placement result for a student.
 * (Student Service stores the student's placement result; does not implement selection logic).
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const createPlacement = async (data) => {
  const { studentId, companyName, role, package: pkg } = data;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const error = new Error('Valid student ID is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!companyName || !role || pkg === undefined || pkg === null) {
    const error = new Error('companyName, role, and package are required.');
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

  if (data.status && !Placement.STATUSES.includes(data.status)) {
    const error = new Error(
      `Invalid status: ${data.status}. Allowed values: ${Placement.STATUSES.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  return Placement.create({
    studentId,
    companyId: data.companyId || '',
    companyName: data.companyName.trim(),
    role: data.role.trim(),
    package: data.package,
    placementYear: data.placementYear || new Date().getFullYear(),
    status: data.status || 'OFFERED',
  });
};

/**
 * Retrieve all placement records for a student.
 * @param {string} studentId
 * @returns {Promise<Array>}
 */
const getPlacementsByStudent = async (studentId) => {
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

  return Placement.find({ studentId }).sort({ placementYear: -1, createdAt: -1 });
};

/**
 * Retrieve a placement record by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getPlacementById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid placement ID format.');
    error.statusCode = 400;
    throw error;
  }

  return Placement.findById(id);
};

/**
 * Retrieve all placement records.
 * @returns {Promise<Array>}
 */
const getAllPlacements = async () => {
  return Placement.find().sort({ createdAt: -1 });
};

module.exports = {
  createPlacement,
  getAllPlacements,
  getPlacementsByStudent,
  getPlacementById,
};
