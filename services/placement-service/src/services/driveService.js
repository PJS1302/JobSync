const mongoose = require('mongoose');
const PlacementDrive = require('../models/PlacementDrive');
const Company = require('../models/Company');

/**
 * Create a new placement drive.
 * Validates company existence before creating.
 * @param {object} data
 * @returns {Promise<object>} Saved placement drive document
 */
const createDrive = async (data) => {
  if (!mongoose.Types.ObjectId.isValid(data.companyId)) {
    const err = new Error('Invalid companyId format');
    err.statusCode = 400;
    throw err;
  }

  const company = await Company.findById(data.companyId);
  if (!company) {
    const err = new Error('Company not found');
    err.statusCode = 404;
    throw err;
  }

  const drive = new PlacementDrive(data);
  return await drive.save();
};

/**
 * Return all placement drives, optionally filtered by status or companyId.
 * @param {object} [filter={}]
 * @returns {Promise<Array>}
 */
const getAllDrives = async (filter = {}) => {
  const query = {};
  if (filter.status) {
    query.status = filter.status;
  }
  if (filter.companyId) {
    query.companyId = filter.companyId;
  }
  return await PlacementDrive.find(query).sort({ createdAt: -1 });
};

/**
 * Return a single placement drive by its MongoDB _id.
 * @param {string} id
 * @returns {Promise<object>}
 */
const getDriveById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findById(id);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }
  return drive;
};

/**
 * Update an existing placement drive by id.
 * Validates company existence if companyId is being updated.
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>} Updated placement drive document
 */
const updateDrive = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  if (data.companyId) {
    if (!mongoose.Types.ObjectId.isValid(data.companyId)) {
      const err = new Error('Invalid companyId format');
      err.statusCode = 400;
      throw err;
    }
    const company = await Company.findById(data.companyId);
    if (!company) {
      const err = new Error('Company not found');
      err.statusCode = 404;
      throw err;
    }
  }

  const drive = await PlacementDrive.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
    context: 'query',
  });

  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }
  return drive;
};

/**
 * Delete a placement drive by id.
 * @param {string} id
 * @returns {Promise<void>}
 */
const deleteDrive = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findByIdAndDelete(id);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }
};

module.exports = {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
};
