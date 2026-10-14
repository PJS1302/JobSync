const mongoose = require('mongoose');
const Application = require('../models/Application');
const Student = require('../models/Student');
const placementServiceClient = require('../clients/placementServiceClient');

/**
 * Create a new application for a student applying to a placement drive.
 * @param {Object} data - Application data ({ studentId, driveId, companyId, role, status })
 * @returns {Promise<Object>}
 */
const createApplication = async (data) => {
  const { studentId, driveId } = data;

  if (!studentId) {
    const error = new Error('Student ID is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    const error = new Error('Invalid student ID format.');
    error.statusCode = 400;
    throw error;
  }

  if (!driveId || typeof driveId !== 'string' || !driveId.trim()) {
    const error = new Error('Drive ID is required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedDriveId = driveId.trim();

  // 1. Verify that student exists in Student Service DB
  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error('Student not found.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Prevent duplicate application for the same drive
  const existing = await Application.findOne({
    studentId,
    driveId: normalizedDriveId,
  });
  if (existing) {
    const error = new Error('Student has already applied to this drive.');
    error.statusCode = 409;
    throw error;
  }

  // 3. Status validation if explicitly provided
  if (data.status && !Application.STATUSES.includes(data.status)) {
    const error = new Error(`Invalid status: ${data.status}. Allowed values: ${Application.STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  // 4. Optionally enrich role & companyId via Placement Service client without touching its DB directly
  let companyId = data.companyId || '';
  let role = data.role || '';
  if (!companyId || !role) {
    const drive = await placementServiceClient.getDriveById(normalizedDriveId);
    if (drive) {
      companyId = companyId || drive.companyId || '';
      role = role || drive.role || '';
    }
  }

  const application = await Application.create({
    studentId,
    driveId: normalizedDriveId,
    companyId,
    role,
    status: data.status || 'APPLIED',
    appliedAt: data.appliedAt || Date.now(),
  });

  return application;
};

/**
 * Retrieve all applications for a specific student.
 * @param {string} studentId
 * @returns {Promise<Array>}
 */
const getApplicationsByStudent = async (studentId) => {
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

  return Application.find({ studentId }).sort({ appliedAt: -1 });
};

/**
 * Retrieve a single application by its ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getApplicationById = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid application ID format.');
    error.statusCode = 400;
    throw error;
  }

  return Application.findById(id);
};

/**
 * Update the status of an existing application.
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object|null>}
 */
const updateApplicationStatus = async (id, status) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid application ID format.');
    error.statusCode = 400;
    throw error;
  }

  if (!status || !Application.STATUSES.includes(status)) {
    const error = new Error(
      `Invalid status: ${status}. Allowed values: ${Application.STATUSES.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  return Application.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: 'after', runValidators: true }
  );
};

module.exports = {
  createApplication,
  getApplicationsByStudent,
  getApplicationById,
  updateApplicationStatus,
};
