const notificationService = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { validateRequiredFields } = require('../utils/validators');

class NotificationController {
  /**
   * Get all notifications for authenticated student
   * GET /api/v1/notifications
   */
  async getMyNotifications(req, res, next) {
    try {
      const studentId = req.student.id;
      const result = await notificationService.getStudentNotifications(studentId, req.query);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark a single notification as read
   * PATCH /api/v1/notifications/:id/read
   */
  async markAsRead(req, res, next) {
    try {
      const studentId = req.student.id;
      const notification = await notificationService.markAsRead(req.params.id, studentId);
      if (!notification) {
        return sendError(res, 'Notification not found', 404);
      }
      return sendSuccess(res, notification, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mark all unread notifications as read
   * PATCH /api/v1/notifications/read-all
   */
  async markAllAsRead(req, res, next) {
    try {
      const studentId = req.student.id;
      const result = await notificationService.markAllAsRead(studentId);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Dispatch a notification (for Placement Service or Admin)
   * POST /api/v1/notifications
   */
  async createNotification(req, res, next) {
    try {
      const requiredFields = ['recipient', 'title', 'message'];
      const missing = validateRequiredFields(req.body, requiredFields);
      if (missing.length > 0) {
        return sendError(res, `Missing required fields: ${missing.join(', ')}`, 400);
      }

      const notification = await notificationService.createNotification(req.body);
      return sendSuccess(res, notification, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a notification
   * DELETE /api/v1/notifications/:id
   */
  async deleteNotification(req, res, next) {
    try {
      const studentId = req.student.id;
      const result = await notificationService.deleteNotification(req.params.id, studentId);
      if (!result) {
        return sendError(res, 'Notification not found', 404);
      }
      return sendSuccess(res, { message: 'Notification deleted successfully' }, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
