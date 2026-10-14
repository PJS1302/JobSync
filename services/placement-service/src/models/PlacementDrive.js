const mongoose = require('mongoose');

const eligibilitySchema = new mongoose.Schema(
  {
    minimumCGPA: {
      type: Number,
      min: [0, 'minimumCGPA cannot be negative'],
      max: [10, 'minimumCGPA cannot exceed 10'],
      default: 0,
    },
    maximumBacklogs: {
      type: Number,
      min: [0, 'maximumBacklogs cannot be negative'],
      default: 0,
    },
    eligibleDepartments: {
      type: [String],
      default: [],
    },
    graduationYear: {
      type: Number,
    },
  },
  { _id: false }
);

const placementDriveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'companyId is required'],
    },
    role: {
      type: String,
      required: [true, 'role is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    package: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: eligibilitySchema,
      default: () => ({}),
    },
    applicationDeadline: {
      type: Date,
    },
    driveDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED'],
        message: 'Status must be DRAFT, PUBLISHED, CLOSED, or CANCELLED',
      },
      default: 'DRAFT',
    },
  },
  {
    timestamps: true, // creates createdAt and updatedAt
  }
);

const PlacementDrive = mongoose.model('PlacementDrive', placementDriveSchema);

module.exports = PlacementDrive;
