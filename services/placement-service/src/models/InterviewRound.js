const mongoose = require('mongoose');

const interviewRoundSchema = new mongoose.Schema(
  {
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PlacementDrive',
      required: [true, 'driveId is required'],
      index: true,
    },
    applicationId: {
      type: String,
      required: [true, 'applicationId is required'],
      trim: true,
      index: true,
    },
    studentId: {
      type: String,
      trim: true,
      index: true,
    },
    roundName: {
      type: String,
      required: [true, 'roundName is required'],
      trim: true,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
      trim: true,
      default: '',
    },
    mode: {
      type: String,
      trim: true,
      default: 'ONLINE',
    },
    locationOrLink: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
        message: 'Status must be SCHEDULED, COMPLETED, or CANCELLED',
      },
      default: 'SCHEDULED',
    },
    decision: {
      type: String,
      enum: {
        values: ['PENDING', 'SHORTLISTED', 'SELECTED', 'REJECTED'],
        message: 'Decision must be PENDING, SHORTLISTED, SELECTED, or REJECTED',
      },
      default: 'PENDING',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

const InterviewRound = mongoose.model('InterviewRound', interviewRoundSchema);

module.exports = InterviewRound;
