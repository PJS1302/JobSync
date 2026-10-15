const crypto = require('crypto');
const User = require('../models/User');
const Student = require('../models/Student');

const generateToken = (userId, role) => {
  const payload = `${userId}:${role}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', 'jobsync_jwt_secret_key_2026').update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
};

/**
 * Register a new user and create student profile if role is 'student'
 */
const register = async ({
  name,
  email,
  password,
  role = 'student',
  department = 'Computer Science & Engineering',
  graduationYear = 2026,
  phone = '',
  cgpa = 8.5,
  skills = ['JavaScript', 'React', 'Node.js'],
}) => {
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists.');
    error.statusCode = 409;
    throw error;
  }

  let studentRecord = null;
  if (role === 'student') {
    let student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      student = await Student.create({
        name,
        email: email.toLowerCase(),
        phone,
        department,
        graduationYear: Number(graduationYear) || 2026,
        cgpa: Number(cgpa) || 8.5,
        backlogs: 0,
        skills: Array.isArray(skills) ? skills : ['JavaScript', 'React'],
      });
    }
    studentRecord = student;
  }

  const newUser = new User({
    name,
    email: email.toLowerCase(),
    role: role === 'admin' ? 'admin' : 'student',
    department,
    graduationYear: graduationYear ? Number(graduationYear) : undefined,
    studentId: studentRecord?._id,
  });
  newUser.setPassword(password);
  await newUser.save();

  const token = generateToken(newUser._id.toString(), newUser.role);

  return {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      graduationYear: newUser.graduationYear,
      studentId: newUser.studentId,
    },
  };
};

/**
 * Log in an existing user with email and password
 */
const login = async ({ email, password, role }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = await User.findOne({ email: cleanEmail });

  // Pre-seed demo users automatically if logging in with demo credentials
  if (!user) {
    if (cleanEmail === 'alex.rivera@example.edu' && password === 'password123') {
      const registered = await register({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.edu',
        password: 'password123',
        role: 'student',
        department: 'Computer Science & Engineering',
        graduationYear: 2026,
        phone: '+1 (555) 234-5678',
        cgpa: 8.85,
        skills: ['Python', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'TypeScript'],
      });
      return registered;
    } else if (cleanEmail === 'admin@jobsync.edu' && password === 'admin123') {
      const registered = await register({
        name: 'Dr. K. Raman',
        email: 'admin@jobsync.edu',
        password: 'admin123',
        role: 'admin',
        department: 'Placement Cell',
      });
      return registered;
    }

    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isValid = user.validatePassword(password);
  if (!isValid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // If role filter specified and mismatch
  if (role && user.role !== role) {
    const error = new Error(
      `This account is registered as a ${user.role === 'admin' ? 'Placement Officer' : 'Student'}. Please switch portal tabs.`
    );
    error.statusCode = 403;
    throw error;
  }

  const token = generateToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      graduationYear: user.graduationYear,
      studentId: user.studentId,
    },
  };
};

/**
 * Get current authenticated user details
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash -salt');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
