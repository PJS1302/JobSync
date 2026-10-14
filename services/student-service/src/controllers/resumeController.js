const resumeService = require('../services/resumeService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Handle resume file upload.
 * POST /api/resume/upload
 */
const uploadResume = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const resume = await resumeService.uploadResume(studentId, req.file);
    return sendSuccess(res, resume, 201);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching resume for a student.
 * GET /api/resume/:studentId
 */
const getResumeByStudentId = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const resume = await resumeService.getResumeByStudentId(studentId);
    return sendSuccess(res, resume, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  uploadResume,
  getResumeByStudentId,
};
