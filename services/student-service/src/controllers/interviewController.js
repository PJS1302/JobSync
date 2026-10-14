const interviewService = require('../services/interviewService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Handle creating an interview schedule record.
 * POST /api/interviews
 */
const createInterview = async (req, res, next) => {
  try {
    const interview = await interviewService.createInterview(req.body);
    return sendSuccess(res, interview, 201);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching all scheduled interviews for a student.
 * GET /api/interviews/student/:studentId
 */
const getInterviewsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const interviews = await interviewService.getInterviewsByStudent(studentId);
    return sendSuccess(res, interviews, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching an interview by ID.
 * GET /api/interviews/:id
 */
const getInterviewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const interview = await interviewService.getInterviewById(id);

    if (!interview) {
      return sendError(res, 'Interview not found', 404);
    }

    return sendSuccess(res, interview, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createInterview,
  getInterviewsByStudent,
  getInterviewById,
};
