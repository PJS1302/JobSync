const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema(
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
      required: [true, 'studentId is required'],
      trim: true,
      index: true,
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
    timestamps: true, // creates createdAt and updatedAt
  }
);

// Compound unique index so an application is not screened multiple times for the same drive
screeningSchema.index({ driveId: 1, applicationId: 1 }, { unique: true });

const Screening = mongoose.model('Screening', screeningSchema);

module.exports = Screening;
