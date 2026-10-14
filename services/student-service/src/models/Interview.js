const mongoose = require('mongoose');

const INTERVIEW_MODES = ['ONLINE', 'OFFLINE', 'HYBRID'];
const INTERVIEW_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'];

const interviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },
    driveId: {
      type: String,
      required: [true, 'Drive ID is required'],
      trim: true,
      index: true,
    },
    roundName: {
      type: String,
      required: [true, 'Round name is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    time: {
      type: String,
      required: [true, 'Interview time is required'],
      trim: true,
    },
    mode: {
      type: String,
      enum: {
        values: INTERVIEW_MODES,
        message: 'Invalid mode: {VALUE}. Allowed values: ' + INTERVIEW_MODES.join(', '),
      },
      default: 'ONLINE',
    },
    locationOrLink: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: INTERVIEW_STATUSES,
        message: 'Invalid status: {VALUE}. Allowed values: ' + INTERVIEW_STATUSES.join(', '),
      },
      default: 'SCHEDULED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model('Interview', interviewSchema);
Interview.MODES = INTERVIEW_MODES;
Interview.STATUSES = INTERVIEW_STATUSES;

module.exports = Interview;
