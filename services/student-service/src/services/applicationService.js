const Application = require('../models/Application');
const Student = require('../models/Student');
const Resume = require('../models/Resume');
const notificationService = require('./notificationService');
const { APPLICATION_STATUS, NOTIFICATION_TYPE } = require('../utils/constants');

class ApplicationService {
  /**
   * Submit an application to a placement drive
   */
  async applyToDrive(studentId, { driveId, companyName, role, resumeId }) {
    const student = await Student.findById(studentId);
    if (!student) {
      const error = new Error('Student profile not found.');
      error.statusCode = 404;
      throw error;
    }

    // Check if duplicate application exists
    const existing = await Application.findOne({ student: studentId, driveId });
    if (existing) {
      const error = new Error('You have already submitted an application for this placement drive.');
      error.statusCode = 409;
      throw error;
    }

    // Determine resume to link
    let targetResumeId = resumeId || student.activeResume;
    if (targetResumeId) {
      const resumeExists = await Resume.findOne({ _id: targetResumeId, student: studentId });
      if (!resumeExists) {
        targetResumeId = null;
      }
    }

    const application = await Application.create({
      student: studentId,
      driveId,
      companyName,
      role,
      resume: targetResumeId,
      status: APPLICATION_STATUS.APPLIED,
      appliedAt: new Date(),
    });

    // Automatically trigger an In-App Notification
    try {
      await notificationService.createNotification({
        recipient: studentId,
        title: 'Application Submitted',
        message: `You have successfully applied for the ${role} position at ${companyName}.`,
        type: NOTIFICATION_TYPE.APPLICATION_UPDATE,
        relatedEntity: {
          entityType: 'Application',
          entityId: application._id.toString(),
        },
      });
    } catch (notifErr) {
      console.warn(`[Student Service] Notification creation failed: ${notifErr.message}`);
    }

    return application;
  }

  /**
   * Get all applications for a specific student
   */
  async getStudentApplications(studentId, { status, limit = 20, page = 1 } = {}) {
    const query = { student: studentId };
    if (status && Object.values(APPLICATION_STATUS).includes(status)) {
      query.status = status;
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate('resume', 'fileName isDefault createdAt')
        .lean(),
      Application.countDocuments(query),
    ]);

    return {
      applications,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Get a single application by ID
   */
  async getApplicationById(applicationId, studentId = null) {
    const query = { _id: applicationId };
    if (studentId) {
      query.student = studentId;
    }

    const application = await Application.findOne(query)
      .populate('student', 'name email rollNumber department cgpa skills')
      .populate('resume');

    if (!application) {
      const error = new Error('Application not found.');
      error.statusCode = 404;
      throw error;
    }

    return application;
  }

  /**
   * Update application status and dispatch notification to student
   */
  async updateApplicationStatus(applicationId, { status, remarks }) {
    if (!Object.values(APPLICATION_STATUS).includes(status)) {
      const error = new Error(`Invalid status: ${status}. Allowed: ${Object.values(APPLICATION_STATUS).join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const updateFields = { status };
    if (remarks !== undefined) {
      updateFields.remarks = remarks;
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { $set: updateFields },
      { returnDocument: 'after' }
    ).populate('student', 'name email rollNumber');

    if (!application) {
      const error = new Error('Application not found.');
      error.statusCode = 404;
      throw error;
    }

    // Automatically trigger In-App Notification about the status update
    try {
      const remarksText = remarks ? ` Remarks: "${remarks}"` : '';
      await notificationService.createNotification({
        recipient: application.student._id,
        title: 'Application Status Updated',
        message: `Your application for ${application.role} at ${application.companyName} has moved to ${status}.${remarksText}`,
        type: NOTIFICATION_TYPE.APPLICATION_UPDATE,
        relatedEntity: {
          entityType: 'Application',
          entityId: application._id.toString(),
        },
      });
    } catch (notifErr) {
      console.warn(`[Student Service] Notification creation failed: ${notifErr.message}`);
    }

    return application;
  }

  /**
   * Get applications for a placement drive (for placement service inter-service queries)
   */
  async getApplicationsByDrive(driveId, { status, limit = 50, page = 1 } = {}) {
    const query = { driveId };
    if (status && Object.values(APPLICATION_STATUS).includes(status)) {
      query.status = status;
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate('student', 'name email rollNumber department cgpa activeBacklogs skills isPlaced')
        .populate('resume', 'fileName filePath isDefault')
        .lean(),
      Application.countDocuments(query),
    ]);

    return {
      applications,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }
}

module.exports = new ApplicationService();
