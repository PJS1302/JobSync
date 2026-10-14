const screeningService = require('../services/screeningService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/** Required fields for creating a screening record. */
const REQUIRED_FIELDS = ['driveId', 'applicationId', 'studentId'];

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
 * POST /api/screening
 * Create a new candidate screening record.
 */
const createScreening = async (req, res, next) => {
  try {
    const validationError = validateRequired(req.body);
    if (validationError) {
      return sendError(res, validationError, 400);
    }

    const screening = await screeningService.createScreening(req.body);
    return sendSuccess(res, { screening }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/screening/drive/:driveId
 * Retrieve candidates for a specific drive with student details enriched.
 */
const getScreeningsByDrive = async (req, res, next) => {
  try {
    const candidates = await screeningService.getScreeningsByDrive(
      req.params.driveId,
      req.query
    );
    return sendSuccess(res, { candidates, screenings: candidates });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/screening/:id
 * Update a screening decision or remarks.
 * AI score is advisory. Placement officer makes the final screening decision.
 */
const updateScreening = async (req, res, next) => {
  try {
    const screening = await screeningService.updateScreening(req.params.id, req.body);
    return sendSuccess(res, { screening });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/screening/:id
 * Retrieve a single screening record.
 */
const getScreeningById = async (req, res, next) => {
  try {
    const screening = await screeningService.getScreeningById(req.params.id);
    return sendSuccess(res, { screening });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createScreening,
  getScreeningsByDrive,
  updateScreening,
  getScreeningById,
};
