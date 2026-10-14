const notificationService = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * POST /api/notifications
 * Create a notification for a student.
 */
const createNotification = async (req, res, next) => {
  try {
    const notification = await notificationService.createNotification(req.body);
    return sendSuccess(res, notification, 201);
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/notifications/:studentId
 * Get all notifications for a student (newest first), plus unread count.
 */
const getNotificationsByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await notificationService.getNotificationsByStudent(studentId);
    return sendSuccess(res, result, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * GET /api/notifications/:studentId/unread
 * Get only unread notifications for a student.
 */
const getUnreadNotifications = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await notificationService.getUnreadNotifications(studentId);
    return sendSuccess(res, result, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read.
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id);
    return sendSuccess(res, notification, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * PUT /api/notifications/:studentId/read-all
 * Mark all notifications for a student as read.
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await notificationService.markAllAsRead(studentId);
    return sendSuccess(res, result, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createNotification,
  getNotificationsByStudent,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
};
