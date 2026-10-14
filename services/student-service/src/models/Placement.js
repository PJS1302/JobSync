const mongoose = require('mongoose');

const PLACEMENT_STATUSES = ['OFFERED', 'ACCEPTED', 'REJECTED', 'PENDING'];

const placementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    companyId: {
      type: String,
      trim: true,
      default: '',
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    package: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Package is required'],
    },
    placementYear: {
      type: Number,
      required: [true, 'Placement year is required'],
      default: () => new Date().getFullYear(),
    },
    status: {
      type: String,
      enum: {
        values: PLACEMENT_STATUSES,
        message: 'Invalid status: {VALUE}. Allowed values: ' + PLACEMENT_STATUSES.join(', '),
      },
      default: 'OFFERED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Placement = mongoose.model('Placement', placementSchema);
Placement.STATUSES = PLACEMENT_STATUSES;

module.exports = Placement;
