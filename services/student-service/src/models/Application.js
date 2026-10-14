const mongoose = require('mongoose');

const APPLICATION_STATUSES = [
  'APPLIED',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
  'WITHDRAWN',
];

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    driveId: {
      type: String,
      required: [true, 'Drive ID is required'],
      trim: true,
      index: true,
    },
    companyId: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUSES,
        message: 'Invalid status: {VALUE}. Allowed values: ' + APPLICATION_STATUSES.join(', '),
      },
      default: 'APPLIED',
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring a student cannot apply to the same drive twice
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
Application.STATUSES = APPLICATION_STATUSES;

module.exports = Application;
