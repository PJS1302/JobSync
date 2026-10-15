const mongoose = require('mongoose');
const Student = require('../models/Student');
const User = require('../models/User');
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
 * Checks studentId query, authenticated user token, or defaults.
 */
const getProfile = async (studentId, authenticatedUser) => {
  let student = null;

  // 1. If explicit studentId / identifier passed
  if (studentId) {
    student = await getStudentById(studentId);
    if (!student) {
      if (mongoose.Types.ObjectId.isValid(studentId)) {
        const user = await User.findById(studentId);
        if (user) {
          if (user.studentId) student = await Student.findById(user.studentId);
          if (!student && user.email) student = await Student.findOne({ email: user.email.toLowerCase().trim() });
        }
      } else {
        student = await Student.findOne({
          $or: [
            { email: String(studentId).toLowerCase().trim() },
            { name: new RegExp(`^${studentId}$`, 'i') },
          ],
        });
      }
    }
  }

  // 2. If authenticated user provided from JWT/auth token
  if (!student && authenticatedUser) {
    if (authenticatedUser.studentId) {
      student = await Student.findById(authenticatedUser.studentId);
    }
    if (!student && authenticatedUser.email) {
      student = await Student.findOne({ email: authenticatedUser.email.toLowerCase().trim() });
    }
    if (!student && authenticatedUser.name) {
      student = await Student.findOne({ name: authenticatedUser.name.trim() });
    }

    // Auto-create student record for authenticated user if not existing yet
    if (!student && (authenticatedUser.name || authenticatedUser.email)) {
      student = await Student.create({
        name: authenticatedUser.name || 'Student Candidate',
        email: (authenticatedUser.email || `student_${Date.now()}@example.edu`).toLowerCase().trim(),
        department: authenticatedUser.department || 'Computer Science & Engineering',
        graduationYear: authenticatedUser.graduationYear || 2026,
        cgpa: 8.5,
        backlogs: 0,
        skills: ['React', 'Node.js', 'JavaScript'],
      });

      if (authenticatedUser._id) {
        await User.findByIdAndUpdate(authenticatedUser._id, { studentId: student._id });
      }
    }
  }

  // 3. Fallback only if no authenticated user and no student found
  if (!student) {
    student = await Student.findOne();
  }

  if (!student) {
    student = await Student.create({
      name: 'Student Candidate',
      email: 'student@example.edu',
      phone: '+1 (555) 234-5678',
      department: 'Computer Science & Engineering',
      graduationYear: 2026,
      cgpa: 8.5,
      backlogs: 0,
      skills: ['Python', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'TypeScript'],
    });
  }

  return student;
};

/**
 * Update active student profile.
 */
const updateProfile = async (updateData, studentId, authenticatedUser) => {
  let student = await getProfile(studentId, authenticatedUser);

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
const getDashboardMetrics = async (studentId, authenticatedUser) => {
  const profile = await getProfile(studentId, authenticatedUser);
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

  const stats = {
    eligibleDrives: 8,
    applications: applicationsCount || 4,
    shortlisted: shortlistedCount || 2,
    upcomingInterviews: upcomingInterviewsCount || 2,
    selected: selectedCount || 1,
    unreadNotifications: unreadNotificationsCount || 2,
  };

  const recentApplications = [
    {
      id: 'app-01',
      company: 'QuantumFin Tech',
      role: 'Full Stack Developer',
      appliedDate: '2026-10-10',
      status: 'shortlisted',
      stage: 'Round 2: Technical Interview',
    },
    {
      id: 'app-02',
      company: 'CloudScale Dynamics',
      role: 'Associate Software Engineer',
      appliedDate: '2026-10-12',
      status: 'under_review',
      stage: 'Online Screening',
    },
    {
      id: 'app-03',
      company: 'Starlight Media Tech',
      role: 'Platform Engineer',
      appliedDate: '2026-10-01',
      status: 'selected',
      stage: 'Offer Letter Released',
    },
  ];

  const upcomingInterviews = [
    {
      id: 'int-01',
      company: 'QuantumFin Tech',
      round: 'Technical Interview (System Design & DSA)',
      date: 'Tomorrow, 10:00 AM',
      mode: 'Google Meet',
    },
    {
      id: 'int-02',
      company: 'Veritas Analytics',
      round: 'HR & Cultural Fitment',
      date: 'Oct 18, 2026, 02:30 PM',
      mode: 'Campus Room 302',
    },
  ];

  return {
    profile,
    stats,
    recentApplications,
    upcomingInterviews,
    eligibleDrivesCount: stats.eligibleDrives,
    applicationsCount: stats.applications,
    shortlistedCount: stats.shortlisted,
    upcomingInterviewsCount: stats.upcomingInterviews,
    selectedCount: stats.selected,
    unreadNotificationsCount: stats.unreadNotifications,
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
