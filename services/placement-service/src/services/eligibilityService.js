const mongoose = require('mongoose');
const PlacementDrive = require('../models/PlacementDrive');
const studentServiceClient = require('../clients/studentServiceClient');

/**
 * Standard failure reasons for rule-based eligibility checks.
 */
const REASONS = {
  CGPA_BELOW_MINIMUM: 'CGPA below required minimum',
  BACKLOGS_EXCEED_MAXIMUM: 'Backlogs exceed maximum allowed',
  DEPARTMENT_NOT_ELIGIBLE: 'Department not eligible',
  GRADUATION_YEAR_MISMATCH: 'Graduation year does not match required year',
};

/**
 * Pure rule-based eligibility engine.
 * No AI. No database access.
 *
 * Rules:
 *   1. CGPA >= minimumCGPA
 *   2. backlogs <= maximumBacklogs
 *   3. department ∈ eligibleDepartments
 *   4. graduationYear == requiredYear
 *
 * @param {object} student - Student details { cgpa, backlogs, department, graduationYear }
 * @param {object} rules - Eligibility criteria { minimumCGPA, maximumBacklogs, eligibleDepartments, graduationYear }
 * @returns {{ eligible: boolean, reasons: string[] }}
 */
const checkEligibility = (student, rules = {}) => {
  const reasons = [];

  if (!student) {
    return {
      eligible: false,
      reasons: ['Student data not provided'],
    };
  }

  // 1. CGPA >= minimumCGPA
  const minimumCGPA =
    rules.minimumCGPA !== undefined && rules.minimumCGPA !== null
      ? Number(rules.minimumCGPA)
      : undefined;

  if (minimumCGPA !== undefined && minimumCGPA > 0) {
    const studentCGPA =
      student.cgpa !== undefined
        ? Number(student.cgpa)
        : student.CGPA !== undefined
          ? Number(student.CGPA)
          : null;

    if (studentCGPA === null || isNaN(studentCGPA) || studentCGPA < minimumCGPA) {
      reasons.push(REASONS.CGPA_BELOW_MINIMUM);
    }
  }

  // 2. backlogs <= maximumBacklogs
  const maximumBacklogs =
    rules.maximumBacklogs !== undefined && rules.maximumBacklogs !== null
      ? Number(rules.maximumBacklogs)
      : undefined;

  if (maximumBacklogs !== undefined) {
    const studentBacklogs =
      student.backlogs !== undefined
        ? Number(student.backlogs)
        : student.backlogCount !== undefined
          ? Number(student.backlogCount)
          : 0;

    if (isNaN(studentBacklogs) || studentBacklogs > maximumBacklogs) {
      reasons.push(REASONS.BACKLOGS_EXCEED_MAXIMUM);
    }
  }

  // 3. department ∈ eligibleDepartments
  if (Array.isArray(rules.eligibleDepartments) && rules.eligibleDepartments.length > 0) {
    const rawDept = student.department || student.branch || '';
    const studentDept = String(rawDept).trim().toUpperCase();
    const eligibleDepts = rules.eligibleDepartments.map((d) => String(d).trim().toUpperCase());

    if (!studentDept || !eligibleDepts.includes(studentDept)) {
      reasons.push(REASONS.DEPARTMENT_NOT_ELIGIBLE);
    }
  }

  // 4. graduationYear == requiredYear
  const requiredYear =
    rules.graduationYear !== undefined && rules.graduationYear !== null
      ? Number(rules.graduationYear)
      : rules.requiredYear !== undefined && rules.requiredYear !== null
        ? Number(rules.requiredYear)
        : undefined;

  if (requiredYear !== undefined) {
    const studentGradYear =
      student.graduationYear !== undefined
        ? Number(student.graduationYear)
        : student.batch !== undefined
          ? Number(student.batch)
          : null;

    if (studentGradYear === null || isNaN(studentGradYear) || studentGradYear !== requiredYear) {
      reasons.push(REASONS.GRADUATION_YEAR_MISMATCH);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
};

/**
 * Check eligibility of a student for a specific placement drive.
 * Retrieves student profile over REST from Student Service,
 * and fetches the drive's eligibility configuration from Placement DB.
 *
 * @param {string} studentId
 * @param {string} driveId
 * @returns {Promise<{ eligible: boolean, reasons: string[] }>}
 */
const checkStudentEligibility = async (studentId, driveId) => {
  if (!mongoose.Types.ObjectId.isValid(driveId)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findById(driveId);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }

  const student = await studentServiceClient.getStudentById(studentId);
  return checkEligibility(student, drive.eligibility || {});
};

/**
 * Check eligibility of supplied student data directly against a placement drive.
 * @param {object} student
 * @param {string} driveId
 * @returns {Promise<{ eligible: boolean, reasons: string[] }>}
 */
const checkStudentDataAgainstDrive = async (student, driveId) => {
  if (!mongoose.Types.ObjectId.isValid(driveId)) {
    const err = new Error('Invalid drive ID format');
    err.statusCode = 400;
    throw err;
  }

  const drive = await PlacementDrive.findById(driveId);
  if (!drive) {
    const err = new Error('Placement drive not found');
    err.statusCode = 404;
    throw err;
  }

  return checkEligibility(student, drive.eligibility || {});
};

module.exports = {
  REASONS,
  checkEligibility,
  checkStudentEligibility,
  checkStudentDataAgainstDrive,
};
