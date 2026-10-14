const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student ID is required'],
      index: true,
    },
    originalFilename: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      default: 'application/pdf',
      trim: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    extractedText: {
      type: String,
      default: 'Extracted text placeholder (pending AI processing)',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for alias compatibility
resumeSchema.virtual('fileName').get(function () {
  return this.originalFilename;
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
