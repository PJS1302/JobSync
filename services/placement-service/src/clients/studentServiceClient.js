const environment = require('../config/environment');

/**
 * Build URL to fetch a student by ID from the Student Service.
 * @param {string} studentId
 * @returns {string}
 */
const buildStudentUrl = (studentId) => {
  const rawBaseUrl = process.env.STUDENT_SERVICE_URL || environment.studentServiceUrl || 'http://localhost:5001';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  if (baseUrl.endsWith('/students')) {
    return `${baseUrl}/${studentId}`;
  }
  if (baseUrl.endsWith('/api/v1') || baseUrl.endsWith('/api')) {
    return `${baseUrl}/students/${studentId}`;
  }
  return `${baseUrl}/api/students/${studentId}`;
};

/**
 * Retrieve student information from Student Service through REST.
 * Note: Does not access Student DB directly.
 *
 * @param {string} studentId - Unique identifier of the student
 * @returns {Promise<object>} Student data object
 */
const getStudentById = async (studentId) => {
  if (!studentId) {
    const err = new Error('studentId is required');
    err.statusCode = 400;
    throw err;
  }

  const url = buildStudentUrl(studentId);

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (networkErr) {
    const err = new Error(`Unable to connect to Student Service at ${url}: ${networkErr.message}`);
    err.statusCode = 503;
    throw err;
  }

  if (!response.ok) {
    if (response.status === 404) {
      const err = new Error('Student not found');
      err.statusCode = 404;
      throw err;
    }
    const err = new Error(`Student Service responded with status ${response.status}`);
    err.statusCode = response.status;
    throw err;
  }

  const payload = await response.json();

  // Extract student document from various possible wrapper shapes
  let student = payload;
  if (payload && payload.data) {
    student = payload.data.student || payload.data;
  } else if (payload && payload.student) {
    student = payload.student;
  }

  return student;
};

module.exports = {
  buildStudentUrl,
  getStudentById,
};
