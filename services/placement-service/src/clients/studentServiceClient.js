const environment = require('../config/environment');

/**
 * Get sanitized base URL for the Student Service.
 * @returns {string}
 */
const getBaseUrl = () => {
  const rawBaseUrl = process.env.STUDENT_SERVICE_URL || environment.studentServiceUrl || 'http://localhost:5001';
  return rawBaseUrl.replace(/\/+$/, '');
};

/**
 * Build endpoint URL for Student Service REST APIs.
 * Supports base URLs with or without /api or /api/v1.
 *
 * @param {string} endpoint - Path, e.g. '/students/123', '/applications/456/status'
 * @returns {string} Complete URL
 */
const buildUrl = (endpoint) => {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (baseUrl.endsWith('/api/v1') || baseUrl.endsWith('/api')) {
    return `${baseUrl}${cleanEndpoint}`;
  }
  return `${baseUrl}/api${cleanEndpoint}`;
};

/**
 * Build URL to fetch a student by ID from the Student Service.
 * @param {string} studentId
 * @returns {string}
 */
const buildStudentUrl = (studentId) => {
  const baseUrl = getBaseUrl();
  if (baseUrl.endsWith('/students')) {
    return `${baseUrl}/${studentId}`;
  }
  return buildUrl(`/students/${studentId}`);
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

  let student = payload;
  if (payload && payload.data) {
    student = payload.data.student || payload.data;
  } else if (payload && payload.student) {
    student = payload.student;
  }

  return student;
};

/**
 * Update application status through Student Service REST API.
 *
 * @param {string} applicationId - Unique identifier of the application
 * @param {string} status - New status (e.g. 'SHORTLISTED', 'SELECTED', 'REJECTED')
 * @param {object} [extraData={}] - Optional metadata
 * @returns {Promise<object>}
 */
const updateApplicationStatus = async (applicationId, status, extraData = {}) => {
  if (!applicationId) {
    const err = new Error('applicationId is required');
    err.statusCode = 400;
    throw err;
  }

  const url = buildUrl(`/applications/${applicationId}/status`);
  const body = { status, applicationId, ...extraData };

  let response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    const err = new Error(`Unable to connect to Student Service at ${url}: ${networkErr.message}`);
    err.statusCode = 503;
    throw err;
  }

  // Fallback to /applications/:id if /status path returns 404
  if (response.status === 404) {
    const fallbackUrl = buildUrl(`/applications/${applicationId}`);
    try {
      const fallbackResponse = await fetch(fallbackUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (fallbackResponse.ok) {
        return await fallbackResponse.json();
      }
    } catch (_) {
      // Ignore fallback network error and handle primary response status below
    }
  }

  if (!response.ok) {
    const err = new Error(`Student Service update application failed with status ${response.status}`);
    err.statusCode = response.status;
    throw err;
  }

  return await response.json();
};

/**
 * Create or update placement record through Student Service REST API.
 *
 * @param {object} placementData - { studentId, driveId, companyId, role, package, applicationId, status }
 * @returns {Promise<object>}
 */
const createOrUpdatePlacement = async (placementData) => {
  const url = buildUrl('/placements');

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(placementData),
    });
  } catch (networkErr) {
    const err = new Error(`Unable to connect to Student Service at ${url}: ${networkErr.message}`);
    err.statusCode = 503;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Student Service placement creation failed with status ${response.status}`);
    err.statusCode = response.status;
    throw err;
  }

  return await response.json();
};

/**
 * Create selection notification through Student Service REST API.
 *
 * @param {object} notificationData - { studentId, title, message, type, driveId, applicationId }
 * @returns {Promise<object>}
 */
const createNotification = async (notificationData) => {
  const url = buildUrl('/notifications');

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(notificationData),
    });
  } catch (networkErr) {
    const err = new Error(`Unable to connect to Student Service at ${url}: ${networkErr.message}`);
    err.statusCode = 503;
    throw err;
  }

  if (!response.ok) {
    const err = new Error(`Student Service notification creation failed with status ${response.status}`);
    err.statusCode = response.status;
    throw err;
  }

  return await response.json();
};

module.exports = {
  getBaseUrl,
  buildUrl,
  buildStudentUrl,
  getStudentById,
  updateApplicationStatus,
  createOrUpdatePlacement,
  createNotification,
};
