const applicationService = require('../services/applicationService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { validateRequiredFields } = require('../utils/validators');

class ApplicationController {
  /**
   * Submit an application to a placement drive
   * POST /api/v1/applications
   */
  async apply(req, res, next) {
    try {
      const requiredFields = ['driveId', 'companyName', 'role'];
      const missing = validateRequiredFields(req.body, requiredFields);
      if (missing.length > 0) {
        return sendError(res, `Missing required fields: ${missing.join(', ')}`, 400);
      }

      const studentId = req.student.id;
      const { driveId, companyName, role, resumeId } = req.body;

      const application = await applicationService.applyToDrive(studentId, {
        driveId,
        companyName,
        role,
        resumeId,
      });

      return sendSuccess(res, application, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all applications for currently authenticated student
   * GET /api/v1/applications/my-applications
   */
  async getMyApplications(req, res, next) {
    try {
      const studentId = req.student.id;
      const result = await applicationService.getStudentApplications(studentId, req.query);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single application by ID
   * GET /api/v1/applications/:id
   */
  async getApplicationById(req, res, next) {
    try {
      const application = await applicationService.getApplicationById(req.params.id);
      return sendSuccess(res, application, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update status of an application (by placement coordinator or placement service callback)
   * PATCH /api/v1/applications/:id/status
   */
  async updateStatus(req, res, next) {
    try {
      const { status, remarks } = req.body;
      if (!status) {
        return sendError(res, 'Field "status" is required', 400);
      }

      const application = await applicationService.updateApplicationStatus(req.params.id, {
        status,
        remarks,
      });

      return sendSuccess(res, application, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all applications for a drive (for Placement Service)
   * GET /api/v1/applications/drive/:driveId
   */
  async getApplicationsByDrive(req, res, next) {
    try {
      const result = await applicationService.getApplicationsByDrive(req.params.driveId, req.query);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ApplicationController();
