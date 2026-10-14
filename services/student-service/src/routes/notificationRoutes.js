const express = require('express');
const {
  createNotification,
  getNotificationsByStudent,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

// POST   /api/notifications                         – create a notification
router.post('/', createNotification);

// PUT    /api/notifications/:id/read                – mark single as read
// NOTE: must be declared BEFORE /:studentId to avoid route shadowing
router.put('/:id/read', markAsRead);

// PUT    /api/notifications/:studentId/read-all     – mark all as read
router.put('/:studentId/read-all', markAllAsRead);

// GET    /api/notifications/:studentId/unread       – unread notifications only
// NOTE: must be declared BEFORE /:studentId to avoid shadowing
router.get('/:studentId/unread', getUnreadNotifications);

// GET    /api/notifications/:studentId              – all notifications + unread count
router.get('/:studentId', getNotificationsByStudent);

module.exports = router;
