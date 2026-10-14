const mongoose = require('mongoose');
const Student = require('../models/Student');

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
 * Retrieve a student profile by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const getStudentById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid student ID format.');
    error.statusCode = 400;
    throw error;
  }

  return Student.findById(id);
};

/**
 * Update an existing student profile.
 * @param {string} id
 * @param {Object} updateData
 * @returns {Promise<Object|null>}
 */
const updateStudent = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error('Invalid student ID format.');
    error.statusCode = 400;
    throw error;
  }

  if (updateData.email) {
    const normalizedEmail = updateData.email.trim().toLowerCase();
    const existing = await Student.findOne({
      email: normalizedEmail,
      _id: { $ne: id },
    });
    if (existing) {
      const error = new Error('A student with this email already exists.');
      error.statusCode = 409;
      throw error;
    }
  }

  return Student.findByIdAndUpdate(id, updateData, {
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
    const error = new Error('Invalid student ID format.');
    error.statusCode = 400;
    throw error;
  }

  return Student.findByIdAndDelete(id);
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
