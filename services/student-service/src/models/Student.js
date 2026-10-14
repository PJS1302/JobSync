const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    batch: {
      type: Number,
      required: [true, 'Graduating batch year is required'],
    },
    degree: {
      type: String,
      default: 'B.Tech',
      trim: true,
    },
    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10'],
    },
    tenthPercentage: {
      type: Number,
      min: [0, 'Tenth percentage cannot be negative'],
      max: [100, 'Tenth percentage cannot exceed 100'],
      default: null,
    },
    twelfthPercentage: {
      type: Number,
      min: [0, 'Twelfth percentage cannot be negative'],
      max: [100, 'Twelfth percentage cannot exceed 100'],
      default: null,
    },
    activeBacklogs: {
      type: Number,
      default: 0,
      min: [0, 'Active backlogs cannot be negative'],
    },
    historyOfBacklogs: {
      type: Number,
      default: 0,
      min: [0, 'History of backlogs cannot be negative'],
    },
    skills: {
      type: [String],
      default: [],
    },
    isPlaced: {
      type: Boolean,
      default: false,
    },
    placementOffers: [
      {
        companyName: { type: String, required: true },
        role: { type: String, required: true },
        packageLpa: { type: Number },
        offerDate: { type: Date, default: Date.now },
      },
    ],
    activeResume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
studentSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper
studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
