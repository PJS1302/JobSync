const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    passwordHash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: Number,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
    .toString('hex');
  return this.passwordHash === hash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
