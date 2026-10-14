const mongoose = require('mongoose');

const NOTIFICATION_TYPES = [
  'NEW_DRIVE',
  'APPLICATION_UPDATE',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'INTERVIEW_REMINDER',
  'SELECTION_RESULT',
  'DEADLINE_REMINDER',
  'SYSTEM',
];

const notificationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: {
        values: NOTIFICATION_TYPES,
        message: 'Invalid type: {VALUE}. Allowed values: ' + NOTIFICATION_TYPES.join(', '),
      },
      default: 'SYSTEM',
      index: true,
    },
    // Optional reference to related entity (driveId, applicationId, interviewId …)
    relatedId: {
      type: String,
      default: null,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for efficient unread queries per student
notificationSchema.index({ studentId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
Notification.TYPES = NOTIFICATION_TYPES;

module.exports = Notification;
