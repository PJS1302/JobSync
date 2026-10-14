import axios from 'axios';

/**
 * JobSync API Client Foundation using Axios
 */

const STUDENT_SERVICE_BASE_URL =
  import.meta.env.VITE_STUDENT_SERVICE_URL || 'http://localhost:5001';

const PLACEMENT_SERVICE_BASE_URL =
  import.meta.env.VITE_PLACEMENT_SERVICE_URL || 'http://localhost:5002';

// Create Student Service Axios Instance
export const studentApiClient = axios.create({
  baseURL: STUDENT_SERVICE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Create Placement Service Axios Instance
export const placementApiClient = axios.create({
  baseURL: PLACEMENT_SERVICE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Interceptor helper to normalize API responses to standard JobSync format
function attachInterceptors(clientInstance) {
  clientInstance.interceptors.request.use(
    (config) => {
      // Future authentication token attachment hook
      const token = localStorage.getItem('jobsync_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  clientInstance.interceptors.response.use(
    (response) => {
      // Standardize response format: { success: true, data: ... }
      if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        return response.data;
      }
      return {
        success: true,
        data: response.data
      };
    },
    (error) => {
      // Standardize error format: { success: false, message: ... }
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred';

      return Promise.resolve({
        success: false,
        message
      });
    }
  );
}

attachInterceptors(studentApiClient);
attachInterceptors(placementApiClient);

// Default API client pointing to Student Service
export default studentApiClient;
