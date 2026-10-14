const studentService = require('../services/studentService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { validateRequiredFields, isValidEmail } = require('../utils/validators');

class StudentController {
  /**
   * Register a new student
   * POST /api/v1/students/register
   */
  async register(req, res, next) {
    try {
      const requiredFields = ['name', 'email', 'password', 'rollNumber', 'department', 'batch', 'cgpa'];
      const missing = validateRequiredFields(req.body, requiredFields);
      if (missing.length > 0) {
        return sendError(res, `Missing required fields: ${missing.join(', ')}`, 400);
      }

      if (!isValidEmail(req.body.email)) {
        return sendError(res, 'Invalid email address format', 400);
      }

      if (req.body.password.length < 6) {
        return sendError(res, 'Password must be at least 6 characters long', 400);
      }

      const result = await studentService.registerStudent(req.body);
      return sendSuccess(res, result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login student
   * POST /api/v1/students/login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return sendError(res, 'Please provide both email and password', 400);
      }

      const result = await studentService.loginStudent(email, password);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current authenticated student profile
   * GET /api/v1/students/me
   */
  async getMe(req, res, next) {
    try {
      const student = await studentService.getStudentById(req.student.id);
      return sendSuccess(res, student, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current authenticated student profile
   * PUT /api/v1/students/me
   */
  async updateMe(req, res, next) {
    try {
      const student = await studentService.updateStudentProfile(req.student.id, req.body);
      return sendSuccess(res, student, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student by ID (for admin/placement service)
   * GET /api/v1/students/:id
   */
  async getStudentById(req, res, next) {
    try {
      const student = await studentService.getStudentById(req.params.id);
      return sendSuccess(res, student, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List and filter students
   * GET /api/v1/students
   */
  async getAllStudents(req, res, next) {
    try {
      const result = await studentService.getAllStudents(req.query);
      return sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Record placement offer for student
   * POST /api/v1/students/:id/offers
   */
  async addPlacementOffer(req, res, next) {
    try {
      const { companyName, role, packageLpa } = req.body;
      if (!companyName || !role) {
        return sendError(res, 'Company name and job role are required for placement offer', 400);
      }

      const student = await studentService.recordPlacementOffer(req.params.id, {
        companyName,
        role,
        packageLpa,
        offerDate: req.body.offerDate || new Date(),
      });

      return sendSuccess(res, student, 200);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
