const driveService = require('../services/driveService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/** Required fields for creating a placement drive. */
const REQUIRED_FIELDS = ['companyId', 'role'];

/**
 * Validate that all required fields are present and non-empty.
 * @param {object} body
 * @returns {string|null} Error message, or null if valid
 */
const validateRequired = (body) => {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim() === '') {
      return `${field} is required`;
    }
  }
  return null;
};

/**
 * POST /api/drives
 */
const createDrive = async (req, res, next) => {
  try {
    const validationError = validateRequired(req.body);
    if (validationError) {
      return sendError(res, validationError, 400);
    }

    const drive = await driveService.createDrive(req.body);
    return sendSuccess(res, { drive }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/drives
 */
const getAllDrives = async (req, res, next) => {
  try {
    const { status, companyId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (companyId) filter.companyId = companyId;

    const drives = await driveService.getAllDrives(filter);
    return sendSuccess(res, { drives });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/drives/:id
 */
const getDriveById = async (req, res, next) => {
  try {
    const drive = await driveService.getDriveById(req.params.id);
    return sendSuccess(res, { drive });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/drives/:id
 */
const updateDrive = async (req, res, next) => {
  try {
    const drive = await driveService.updateDrive(req.params.id, req.body);
    return sendSuccess(res, { drive });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/drives/:id
 */
const deleteDrive = async (req, res, next) => {
  try {
    await driveService.deleteDrive(req.params.id);
    return sendSuccess(res, { message: 'Placement drive deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
};
