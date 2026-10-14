const mongoose = require('mongoose');
const Screening = require('../models/Screening');
const PlacementDrive = require('../models/PlacementDrive');
const studentServiceClient = require('../clients/studentServiceClient');

/**
 * Create a new candidate screening record.
 * Validates placement drive existence.
 *
 * @param {object} data - { driveId, applicationId, studentId, matchScore, decision, remarks }
 * @returns {Promise<object>} Created screening document
 */
const createScreening = async (data) => {
  if (!mongoose.Types.ObjectId.isValid(data.driveId)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findById(data.driveId);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }

  const existing = await Screening.findOne({
    driveId: data.driveId,
    applicationId: data.applicationId,
  });
  if (existing) {
    const err = new Error('Screening record already exists for this application');
    err.statusCode = 409;
    throw err;
  }

  const screening = new Screening(data);
  return await screening.save();
};

/**
 * Retrieve all screening records for a given drive, enriched with candidate
 * profile information fetched from Student Service REST APIs.
 *
 * @param {string} driveId
 * @param {object} [filter={}]
 * @returns {Promise<Array>} List of enriched candidate screening records
 */
const getScreeningsByDrive = async (driveId, filter = {}) => {
  if (!mongoose.Types.ObjectId.isValid(driveId)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findById(driveId);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }

  const query = { driveId };
  if (filter.decision) {
    query.decision = filter.decision;
  }

  const records = await Screening.find(query).sort({ createdAt: -1 });

  // Enrich each screening record with student details from Student Service REST API
  const enrichedCandidates = await Promise.all(
    records.map(async (record) => {
      let student = null;
      try {
        student = await studentServiceClient.getStudentById(record.studentId);
      } catch (e) {
        // Graceful handling if student service is unreachable or student not found
      }

      const raw = record.toObject ? record.toObject() : { ...record };
      return {
        ...raw,
        studentId: record.studentId,
        studentName: student?.name || student?.studentName || '',
        department: student?.department || student?.branch || '',
        cgpa: student?.cgpa ?? student?.CGPA ?? null,
        skills: student?.skills || [],
        applicationId: record.applicationId,
        applicationStatus: record.decision,
        aiMatchScore: record.matchScore,
      };
    })
  );

  return enrichedCandidates;
};

/**
 * Update an existing screening record (e.g. final decision, remarks, matchScore).
 * AI score is advisory; placement officer makes the final screening decision.
 *
 * @param {string} id - Screening record _id
 * @param {object} data - { decision, remarks, matchScore }
 * @returns {Promise<object>} Updated screening document
 */
const updateScreening = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid screening ID format');
    err.statusCode = 400;
    throw err;
  }

  const screening = await Screening.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
    context: 'query',
  });

  if (!screening) {
    const err = new Error('Screening record not found');
    err.statusCode = 404;
    throw err;
  }

  return screening;
};

/**
 * Return a single screening record by id.
 * @param {string} id
 * @returns {Promise<object>}
 */
const getScreeningById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid screening ID format');
    err.statusCode = 400;
    throw err;
  }

  const screening = await Screening.findById(id);
  if (!screening) {
    const err = new Error('Screening record not found');
    err.statusCode = 404;
    throw err;
  }

  let student = null;
  try {
    student = await studentServiceClient.getStudentById(screening.studentId);
  } catch (e) {
    // Ignore error
  }

  const raw = screening.toObject ? screening.toObject() : { ...screening };
  return {
    ...raw,
    studentId: screening.studentId,
    studentName: student?.name || student?.studentName || '',
    department: student?.department || student?.branch || '',
    cgpa: student?.cgpa ?? student?.CGPA ?? null,
    skills: student?.skills || [],
    applicationId: screening.applicationId,
    applicationStatus: screening.decision,
    aiMatchScore: screening.matchScore,
  };
};

module.exports = {
  createScreening,
  getScreeningsByDrive,
  updateScreening,
  getScreeningById,
};
