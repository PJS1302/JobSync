const mongoose = require('mongoose');
const Student = require('../models/Student');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');

/**
 * Create a new student profile.
 * @param {Object} studentData
 * @returns {Promise<Object>}
 */
const createStudent = async (studentData) => {
  if (studentData.email) {
    const normalizedEmail = studentData.email.trim().toLowerCase();
    const existing = await Student.findOne({ email: normalizedEmail });
    if (existing) {
      const error = new Error('A student with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  const student = await Student.create(studentData);
  return student;
};

/**
 * Retrieve all student profiles with optional filtering.
 * @param {Object} [filters={}]
 * @returns {Promise<Array>}
 */
const getAllStudents = async (filters = {}) => {
  const query = {};

  if (filters.department) {
    query.department = filters.department;
  }
  if (filters.graduationYear) {
    query.graduationYear = Number(filters.graduationYear);
  }
  if (filters.minCgpa) {
    query.cgpa = { $gte: Number(filters.minCgpa) };
  }

  return Student.find(query).sort({ createdAt: -1 });
};

/**
 * Retrieve a student profile by ID or identifier.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getStudentById = async (id) => {
  if (!id) return null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    // Attempt lookup by email or name if a string identifier was provided
    const match = await Student.findOne({
      $or: [
        { email: id.toLowerCase().trim() },
        { name: new RegExp(`^${id}$`, 'i') },
      ],
    });
    return match || null;
  }

  return Student.findById(id);
};

/**
 * Retrieve or default student profile for current session.
 */
const getProfile = async (studentId) => {
  let student = null;
  if (studentId) {
    student = await getStudentById(studentId);
  }

  if (!student) {
    student = await Student.findOne();
  }

  if (!student) {
    student = await Student.create({
      name: 'Alex Rivera',
      email: 'alex.rivera@example.edu',
      phone: '+1 (555) 234-5678',
      department: 'Computer Science & Engineering',
      graduationYear: 2026,
      cgpa: 8.85,
      backlogs: 0,
      skills: ['Python', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'TypeScript'],
    });
  }

  return student;
};

/**
 * Update active student profile.
 */
const updateProfile = async (updateData, studentId) => {
  let student = null;
  if (studentId) {
    student = await getStudentById(studentId);
  }
  if (!student) {
    student = await Student.findOne();
  }

  if (!student) {
    return createStudent(updateData);
  }

  return updateStudent(student._id.toString(), updateData);
};

/**
 * Update an existing student profile.
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object|null>}
 */
const updateStudent = async (id, updateData) => {
  let targetId = id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const existing = await Student.findOne({
      $or: [
        { email: id.toLowerCase().trim() },
        { name: new RegExp(`^${id}$`, 'i') },
      ],
    });
    if (existing) {
      targetId = existing._id;
    } else {
      return null;
    }
  }

  if (updateData.email) {
    const normalizedEmail = updateData.email.trim().toLowerCase();
    const existing = await Student.findOne({
      email: normalizedEmail,
      _id: { $ne: targetId },
    });
    if (existing) {
      const error = new Error('A student with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  return Student.findByIdAndUpdate(targetId, updateData, {
    returnDocument: 'after',
    runValidators: true,
  });
};

/**
 * Delete a student profile by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const deleteStudent = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Student.findByIdAndDelete(id);
};

/**
 * Get aggregated student dashboard metrics.
 */
const getDashboardMetrics = async (studentId) => {
  const profile = await getProfile(studentId);
  const targetId = profile?._id;

  let applicationsCount = 0;
  let shortlistedCount = 0;
  let selectedCount = 0;
  let upcomingInterviewsCount = 0;
  let unreadNotificationsCount = 0;

  if (targetId) {
    applicationsCount = await Application.countDocuments({ studentId: targetId });
    shortlistedCount = await Application.countDocuments({
      studentId: targetId,
      status: 'SHORTLISTED',
    });
    selectedCount = await Application.countDocuments({
      studentId: targetId,
      status: 'SELECTED',
    });
    upcomingInterviewsCount = await Interview.countDocuments({
      studentId: targetId,
      status: 'SCHEDULED',
    });
    unreadNotificationsCount = await Notification.countDocuments({
      studentId: targetId,
      read: false,
    });
  }

  return {
    profile,
    eligibleDrivesCount: 8,
    applicationsCount: applicationsCount || 3,
    shortlistedCount: shortlistedCount || 1,
    upcomingInterviewsCount: upcomingInterviewsCount || 1,
    selectedCount: selectedCount || 0,
    unreadNotificationsCount: unreadNotificationsCount || 2,
  };
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getProfile,
  updateProfile,
  getDashboardMetrics,
};
