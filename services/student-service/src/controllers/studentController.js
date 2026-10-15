const studentService = require('../services/studentService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Handle student creation.
 * POST /api/students
 */
const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    return sendSuccess(res, student, 201);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching all students.
 * GET /api/students
 */
const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents(req.query);
    return sendSuccess(res, students, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching a single student by ID.
 * GET /api/students/:id
 */
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.getStudentById(id);

    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    return sendSuccess(res, student, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle updating an existing student profile.
 * PUT /api/students/:id
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.updateStudent(id, req.body);

    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    return sendSuccess(res, student, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle deleting a student profile.
 * DELETE /api/students/:id
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await studentService.deleteStudent(id);

    if (!student) {
      return sendError(res, 'Student not found', 404);
    }

    return sendSuccess(res, { message: 'Student deleted successfully', id: student._id }, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching active student profile.
 * GET /api/v1/students/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const student = await studentService.getProfile(req.query?.studentId, req.user);
    return sendSuccess(res, student, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle updating active student profile.
 * PUT /api/v1/students/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const student = await studentService.updateProfile(req.body, req.query?.studentId, req.user);
    return sendSuccess(res, student, 200);
  } catch (err) {
    return next(err);
  }
};

/**
 * Handle fetching student dashboard metrics.
 * GET /api/v1/students/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const metrics = await studentService.getDashboardMetrics(req.query?.studentId, req.user);
    return sendSuccess(res, metrics, 200);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getProfile,
  updateProfile,
  getDashboard,
};

