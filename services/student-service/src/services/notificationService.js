const Notification = require('../models/Notification');

class NotificationService {
  /**
   * Create an in-app notification for a student
   */
  async createNotification({ recipient, title, message, type, relatedEntity }) {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedEntity,
    });
    return notification;
  }

  /**
   * Retrieve notifications for a student
   */
  async getStudentNotifications(studentId, { isRead, limit = 20, page = 1 } = {}) {
    const query = { recipient: studentId };

    if (typeof isRead === 'boolean') {
      query.isRead = isRead;
    } else if (isRead === 'true') {
      query.isRead = true;
    } else if (isRead === 'false') {
      query.isRead = false;
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Notification.countDocuments(query),
    ]);

    const unreadCount = await Notification.countDocuments({
      recipient: studentId,
      isRead: false,
    });

    return {
      notifications,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
      unreadCount,
    };
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId, studentId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: studentId },
      { isRead: true, readAt: new Date() },
      { returnDocument: 'after' }
    );
    return notification;
  }

  /**
   * Mark all unread notifications for a student as read
   */
  async markAllAsRead(studentId) {
    const result = await Notification.updateMany(
      { recipient: studentId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return {
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId, studentId) {
    const deleted = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: studentId,
    });
    return deleted;
  }
}

module.exports = new NotificationService();
