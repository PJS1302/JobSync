const fs = require('fs');
const path = require('path');
const resumeService = require('../services/resumeService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

class ResumeController {
  /**
   * Upload resume
   * POST /api/v1/resumes/upload
   */
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return sendError(res, 'Please provide a resume file (PDF or DOC/DOCX) under field "resume"', 400);
      }

      const studentId = req.student.id;
      const { isDefault, summary } = req.body;

      const resume = await resumeService.uploadResume(studentId, req.file, {
        isDefault,
        summary,
      });

      return sendSuccess(res, resume, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all resumes for current student
   * GET /api/v1/resumes/my-resumes
   */
  async getMyResumes(req, res, next) {
    try {
      const resumes = await resumeService.getStudentResumes(req.student.id);
      return sendSuccess(res, resumes, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active resume for current student
   * GET /api/v1/resumes/active
   */
  async getActiveResume(req, res, next) {
    try {
      const resume = await resumeService.getActiveResume(req.student.id);
      if (!resume) {
        return sendError(res, 'No active resume found for this student', 404);
      }
      return sendSuccess(res, resume, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get resume metadata by ID
   * GET /api/v1/resumes/:id
   */
  async getResumeById(req, res, next) {
    try {
      const resume = await resumeService.getResumeById(req.params.id);
      return sendSuccess(res, resume, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Download physical resume file
   * GET /api/v1/resumes/:id/download
   */
  async download(req, res, next) {
    try {
      const resume = await resumeService.getResumeById(req.params.id);
      if (!fs.existsSync(resume.filePath)) {
        return sendError(res, 'File not found on storage server', 404);
      }

      res.setHeader('Content-Type', resume.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(resume.fileName)}"`);
      return res.sendFile(path.resolve(resume.filePath));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set a resume as active/default
   * PATCH /api/v1/resumes/:id/default
   */
  async setDefault(req, res, next) {
    try {
      const resume = await resumeService.setDefaultResume(req.params.id, req.student.id);
      return sendSuccess(res, resume, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a resume
   * DELETE /api/v1/resumes/:id
   */
  async delete(req, res, next) {
    try {
      const result = await resumeService.deleteResume(req.params.id, req.student.id);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResumeController();
