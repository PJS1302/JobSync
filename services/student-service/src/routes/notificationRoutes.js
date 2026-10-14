const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

// Student notifications
router.get('/', authenticate, (req, res, next) => notificationController.getMyNotifications(req, res, next));
router.patch('/read-all', authenticate, (req, res, next) => notificationController.markAllAsRead(req, res, next));
router.patch('/:id/read', authenticate, (req, res, next) => notificationController.markAsRead(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => notificationController.deleteNotification(req, res, next));

// Dispatch notification (inter-service/system)
router.post('/', (req, res, next) => notificationController.createNotification(req, res, next));

module.exports = router;
