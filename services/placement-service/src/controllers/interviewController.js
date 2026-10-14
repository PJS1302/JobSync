const interviewService = require('../services/interviewService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/** Required fields for creating an interview round. */
const REQUIRED_FIELDS = ['driveId', 'applicationId', 'roundName'];

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
 * POST /api/interviews
 * Schedule/create an interview round.
 */
const createInterviewRound = async (req, res, next) => {
  try {
    const validationError = validateRequired(req.body);
    if (validationError) {
      return sendError(res, validationError, 400);
    }

    const interview = await interviewService.createInterviewRound(req.body);
    return sendSuccess(res, { interview }, 201);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/interviews/drive/:driveId
 * Retrieve all interview rounds for a placement drive.
 */
const getInterviewsByDrive = async (req, res, next) => {
  try {
    const interviews = await interviewService.getInterviewsByDrive(
      req.params.driveId,
      req.query
    );
    return sendSuccess(res, { interviews });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/interviews/:id
 * Update interview round details, status, or candidate selection decision.
 */
const updateInterviewRound = async (req, res, next) => {
  try {
    const result = await interviewService.updateInterviewRound(req.params.id, req.body);
    return sendSuccess(res, {
      interview: result.interview,
      selection: result.selection,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/interviews/:id
 * Retrieve a single interview round by ID.
 */
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await interviewService.getInterviewById(req.params.id);
    return sendSuccess(res, { interview });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/interviews/select
 * Explicit candidate selection endpoint for placement officers.
 */
const recordSelection = async (req, res, next) => {
  try {
    const { driveId, applicationId, studentId, decision, remarks } = req.body;
    if (!applicationId) {
      return sendError(res, 'applicationId is required', 400);
    }
    if (!decision) {
      return sendError(res, 'decision is required (SHORTLISTED, SELECTED, or REJECTED)', 400);
    }

    const result = await interviewService.executeCandidateSelection({
      driveId,
      applicationId,
      studentId,
      decision,
      remarks,
    });

    return sendSuccess(res, {
      message: `Candidate ${decision.toLowerCase()} successfully`,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createInterviewRound,
  getInterviewsByDrive,
  updateInterviewRound,
  getInterviewById,
  recordSelection,
};
