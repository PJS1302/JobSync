/**
 * Base API client for JobSync Student Microservice
 */

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_STUDENT_SERVICE_URL) ||
  'http://localhost:5001/api/v1';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    config.signal = controller.signal;

    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `Request failed with status ${response.status}`
      };
    }

    return {
      success: true,
      data: data?.data ?? data
    };
  } catch (error) {
    return {
      success: false,
      message: error.name === 'AbortError' ? 'Network request timed out' : error.message || 'Network error'
    };
  }
}

export default {
  apiRequest
};
