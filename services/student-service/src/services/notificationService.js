const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

/**
 * Create a notification for a student.
 * @param {Object} data - { studentId, title, message, type, relatedId }
 * @returns {Promise<Object>}
 */
const createNotification = async (data) => {
  const { studentId, title, message } = data;

  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const err = new Error('Valid student ID is required.');
    err.statusCode = 400;
    throw err;
  }

  if (!title || !message) {
    const err = new Error('title and message are required.');
    err.statusCode = 400;
    throw err;
  }

  if (data.type && !Notification.TYPES.includes(data.type)) {
    const err = new Error(
      `Invalid type: ${data.type}. Allowed values: ${Notification.TYPES.join(', ')}`
    );
    err.statusCode = 400;
    throw err;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error('Student not found.');
    err.statusCode = 404;
    throw err;
  }

  return Notification.create({
    studentId,
    title: title.trim(),
    message: message.trim(),
    type: data.type || 'SYSTEM',
    relatedId: data.relatedId || null,
    isRead: false,
  });
};

/**
 * Get all notifications for a student, newest first.
 * @param {string} studentId
 * @returns {Promise<Object>} { notifications, unreadCount }
 */
const getNotificationsByStudent = async (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const err = new Error('Invalid student ID format.');
    err.statusCode = 400;
    throw err;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error('Student not found.');
    err.statusCode = 404;
    throw err;
  }

  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ studentId }).sort({ createdAt: -1 }),
    Notification.countDocuments({ studentId, isRead: false }),
  ]);

  return { notifications, unreadCount };
};

/**
 * Get only unread notifications for a student.
 * @param {string} studentId
 * @returns {Promise<Object>} { notifications, unreadCount }
 */
const getUnreadNotifications = async (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const err = new Error('Invalid student ID format.');
    err.statusCode = 400;
    throw err;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error('Student not found.');
    err.statusCode = 404;
    throw err;
  }

  const notifications = await Notification.find({ studentId, isRead: false }).sort({
    createdAt: -1,
  });

  return { notifications, unreadCount: notifications.length };
};

/**
 * Mark a single notification as read.
 * @param {string} id  - notification _id
 * @returns {Promise<Object>} updated notification
 */
const markAsRead = async (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid notification ID format.');
    err.statusCode = 400;
    throw err;
  }

  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { returnDocument: 'after' }
  );

  if (!notification) {
    const err = new Error('Notification not found.');
    err.statusCode = 404;
    throw err;
  }

  return notification;
};

/**
 * Mark all notifications for a student as read.
 * @param {string} studentId
 * @returns {Promise<Object>} { modifiedCount }
 */
const markAllAsRead = async (studentId) => {
  if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
    const err = new Error('Invalid student ID format.');
    err.statusCode = 400;
    throw err;
  }

  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error('Student not found.');
    err.statusCode = 404;
    throw err;
  }

  const result = await Notification.updateMany(
    { studentId, isRead: false },
    { $set: { isRead: true } }
  );

  return { modifiedCount: result.modifiedCount };
};

module.exports = {
  createNotification,
  getNotificationsByStudent,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
};
