const fs = require('fs');
const Resume = require('../models/Resume');
const Student = require('../models/Student');
const notificationService = require('./notificationService');
const { NOTIFICATION_TYPE } = require('../utils/constants');

class ResumeService {
  /**
   * Upload and register a new resume
   */
  async uploadResume(studentId, file, { isDefault = true, summary = '' } = {}) {
    const student = await Student.findById(studentId);
    if (!student) {
      // Clean up uploaded file if student does not exist
      if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      const error = new Error('Student profile not found.');
      error.statusCode = 404;
      throw error;
    }

    const shouldBeDefault = isDefault === true || isDefault === 'true' || !student.activeResume;

    if (shouldBeDefault) {
      await Resume.updateMany({ student: studentId }, { isDefault: false });
    }

    const resume = await Resume.create({
      student: studentId,
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      isDefault: shouldBeDefault,
      summary: summary || '',
    });

    if (shouldBeDefault) {
      student.activeResume = resume._id;
      await student.save();
    }

    // Trigger in-app notification
    try {
      await notificationService.createNotification({
        recipient: studentId,
        title: 'Resume Uploaded',
        message: `Your resume "${file.originalname}" was uploaded successfully and set as your ${shouldBeDefault ? 'default' : 'secondary'} resume.`,
        type: NOTIFICATION_TYPE.GENERAL,
        relatedEntity: {
          entityType: 'Resume',
          entityId: resume._id.toString(),
        },
      });
    } catch (notifErr) {
      console.warn(`[Student Service] Notification creation failed: ${notifErr.message}`);
    }

    return resume;
  }

  /**
   * Get all resumes for a student
   */
  async getStudentResumes(studentId) {
    return Resume.find({ student: studentId }).sort({ isDefault: -1, createdAt: -1 });
  }

  /**
   * Get the active/default resume for a student
   */
  async getActiveResume(studentId) {
    let resume = await Resume.findOne({ student: studentId, isDefault: true });
    if (!resume) {
      resume = await Resume.findOne({ student: studentId }).sort({ createdAt: -1 });
    }
    return resume;
  }

  /**
   * Get resume by ID
   */
  async getResumeById(resumeId, studentId = null) {
    const query = { _id: resumeId };
    if (studentId) {
      query.student = studentId;
    }
    const resume = await Resume.findOne(query);
    if (!resume) {
      const error = new Error('Resume not found.');
      error.statusCode = 404;
      throw error;
    }
    return resume;
  }

  /**
   * Set a specific resume as default
   */
  async setDefaultResume(resumeId, studentId) {
    const resume = await Resume.findOne({ _id: resumeId, student: studentId });
    if (!resume) {
      const error = new Error('Resume not found.');
      error.statusCode = 404;
      throw error;
    }

    await Resume.updateMany({ student: studentId }, { isDefault: false });
    resume.isDefault = true;
    await resume.save();

    await Student.findByIdAndUpdate(studentId, { activeResume: resume._id });
    return resume;
  }

  /**
   * Delete a resume
   */
  async deleteResume(resumeId, studentId) {
    const resume = await Resume.findOne({ _id: resumeId, student: studentId });
    if (!resume) {
      const error = new Error('Resume not found.');
      error.statusCode = 404;
      throw error;
    }

    // Remove file from disk
    if (fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (err) {
        console.warn(`[Student Service] Could not delete resume file: ${err.message}`);
      }
    }

    await Resume.findByIdAndDelete(resumeId);

    // If deleted resume was active, pick the newest remaining resume
    const student = await Student.findById(studentId);
    if (student && student.activeResume && student.activeResume.toString() === resumeId.toString()) {
      const nextResume = await Resume.findOne({ student: studentId }).sort({ createdAt: -1 });
      if (nextResume) {
        nextResume.isDefault = true;
        await nextResume.save();
        student.activeResume = nextResume._id;
      } else {
        student.activeResume = null;
      }
      await student.save();
    }

    return { message: 'Resume deleted successfully' };
  }
}

module.exports = new ResumeService();
