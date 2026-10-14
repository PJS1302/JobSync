const APPLICATION_STATUS = Object.freeze({
  APPLIED: 'APPLIED',
  IN_REVIEW: 'IN_REVIEW',
  SHORTLISTED: 'SHORTLISTED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
});

const NOTIFICATION_TYPE = Object.freeze({
  APPLICATION_UPDATE: 'APPLICATION_UPDATE',
  INTERVIEW_ALERT: 'INTERVIEW_ALERT',
  DRIVE_ALERT: 'DRIVE_ALERT',
  GENERAL: 'GENERAL',
});

const ALLOWED_MIME_TYPES = Object.freeze([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

module.exports = {
  APPLICATION_STATUS,
  NOTIFICATION_TYPE,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
};
