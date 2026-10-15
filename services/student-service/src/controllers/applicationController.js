const applicationService = require('../services/applicationService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Handle student application submission.
 * POST /api/applications
 */
const createApplication = async (req, res, next) => {
  try {
    const application = await applicationService.createApplication(req.body);
    return sendSuccess(res, application, 201);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching all applications for a student.
 * GET /api/applications/student/:studentId
 */
const getApplicationsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const applications = await applicationService.getApplicationsByStudent(studentId);
    return sendSuccess(res, applications, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching a single application by ID.
 * GET /api/applications/:id
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await applicationService.getApplicationById(id);

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    return sendSuccess(res, application, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle updating an application's status.
 * PUT /api/applications/:id/status
 */
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await applicationService.updateApplicationStatus(id, status);

    if (!application) {
      return sendError(res, 'Application not found', 404);
    }

    return sendSuccess(res, application, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching all applications (e.g. for placement office and stats).
 * GET /api/applications
 */
const getAllApplications = async (req, res, next) => {
  try {
    const applications = await applicationService.getAllApplications(req.query);
    return sendSuccess(res, applications, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationsByStudent,
  getApplicationById,
  updateApplicationStatus,
};
