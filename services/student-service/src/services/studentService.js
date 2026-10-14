const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const environment = require('../config/environment');

class StudentService {
  /**
   * Generate JWT authentication token
   */
  generateToken(student) {
    return jwt.sign(
      {
        id: student._id.toString(),
        email: student.email,
        rollNumber: student.rollNumber,
      },
      environment.jwtSecret,
      { expiresIn: environment.jwtExpiresIn }
    );
  }

  /**
   * Register a new student
   */
  async registerStudent(studentData) {
    const { email, rollNumber } = studentData;

    // Check email uniqueness
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      const error = new Error('A student with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    // Check roll number uniqueness
    const existingRoll = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingRoll) {
      const error = new Error('A student with this roll number already exists.');
      error.statusCode = 409;
      throw error;
    }

    const student = await Student.create(studentData);
    const token = this.generateToken(student);

    const safeStudent = student.toObject();
    delete safeStudent.password;

    return {
      student: safeStudent,
      token,
    };
  }

  /**
   * Authenticate student with email and password
   */
  async loginStudent(email, password) {
    const student = await Student.findOne({ email: email.toLowerCase() }).select('+password');
    if (!student) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(student);
    const safeStudent = student.toObject();
    delete safeStudent.password;

    return {
      student: safeStudent,
      token,
    };
  }

  /**
   * Get student profile by ID
   */
  async getStudentById(studentId) {
    const student = await Student.findById(studentId).populate('activeResume');
    if (!student) {
      const error = new Error('Student profile not found.');
      error.statusCode = 404;
      throw error;
    }
    return student;
  }

  /**
   * Update student profile
   */
  async updateStudentProfile(studentId, updateData) {
    // Prevent updating protected fields directly via profile update
    const disallowedFields = ['_id', 'password', 'email', 'rollNumber', 'placementOffers', 'isPlaced'];
    disallowedFields.forEach((field) => delete updateData[field]);

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    ).populate('activeResume');

    if (!student) {
      const error = new Error('Student profile not found.');
      error.statusCode = 404;
      throw error;
    }

    return student;
  }

  /**
   * Query and filter students (for placement coordinator or placement service eligibility screening)
   */
  async getAllStudents({
    department,
    minCgpa,
    maxBacklogs,
    isPlaced,
    batch,
    search,
    limit = 20,
    page = 1,
  } = {}) {
    const query = {};

    if (department) {
      query.department = new RegExp(`^${department}$`, 'i');
    }

    if (minCgpa !== undefined && minCgpa !== '') {
      query.cgpa = { $gte: parseFloat(minCgpa) };
    }

    if (maxBacklogs !== undefined && maxBacklogs !== '') {
      query.activeBacklogs = { $lte: parseInt(maxBacklogs, 10) };
    }

    if (isPlaced !== undefined && isPlaced !== '') {
      query.isPlaced = isPlaced === 'true' || isPlaced === true;
    }

    if (batch) {
      query.batch = parseInt(batch, 10);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { rollNumber: searchRegex }, { email: searchRegex }];
    }

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const [students, total] = await Promise.all([
      Student.find(query)
        .sort({ cgpa: -1, createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .populate('activeResume')
        .lean(),
      Student.countDocuments(query),
    ]);

    return {
      students,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Record placement offer for a student
   */
  async recordPlacementOffer(studentId, offerData) {
    const student = await Student.findById(studentId);
    if (!student) {
      const error = new Error('Student not found.');
      error.statusCode = 404;
      throw error;
    }

    student.placementOffers.push(offerData);
    student.isPlaced = true;
    await student.save();

    return student;
  }
}

module.exports = new StudentService();
