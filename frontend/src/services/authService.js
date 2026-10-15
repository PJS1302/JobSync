import { studentApiClient } from './api';

const AUTH_STORAGE_KEY = 'jobsync_auth_user';
const TOKEN_STORAGE_KEY = 'jobsync_token';

const DEMO_ACCOUNTS = {
  'alex.rivera@example.edu': {
    id: 'student-demo-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@example.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.85,
    token: 'jobsync_demo_student_token'
  },
  'admin@jobsync.edu': {
    id: 'admin-demo-1',
    name: 'Dr. K. Raman',
    email: 'admin@jobsync.edu',
    role: 'admin',
    department: 'Placement Cell',
    token: 'jobsync_demo_admin_token'
  }
};

const syncStudentProfile = (user) => {
  if (user) {
    const existing = localStorage.getItem('jobsync_student_profile');
    let base = {};
    try {
      base = existing ? JSON.parse(existing) : {};
    } catch {
      base = {};
    }
    localStorage.setItem(
      'jobsync_student_profile',
      JSON.stringify({
        ...base,
        name: user.name,
        email: user.email,
        department: user.department || base.department || 'Computer Science & Engineering',
        graduationYear: user.graduationYear || base.graduationYear || 2026,
        cgpa: user.cgpa || base.cgpa || 8.5,
        skills: user.skills || base.skills || ['React', 'Node.js', 'JavaScript'],
        backlogs: 0
      })
    );
  }
};

/**
 * Log in a user (student or placement officer)
 */
export async function login({ email, password, role }) {
  try {
    const res = await studentApiClient.post('/api/v1/auth/login', {
      email,
      password,
      role
    });

    if (res.success && res.data) {
      const { user, token } = res.data;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      syncStudentProfile(user);
      return { success: true, user, token };
    }

    if (res.message) {
      throw new Error(res.message);
    }
  } catch (error) {
    const cleanEmail = email?.toLowerCase().trim();

    // Graceful offline fallback for demo accounts
    if (DEMO_ACCOUNTS[cleanEmail] && (password === 'password123' || password === 'admin123')) {
      const demoUser = DEMO_ACCOUNTS[cleanEmail];
      localStorage.setItem(TOKEN_STORAGE_KEY, demoUser.token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
      syncStudentProfile(demoUser);
      return { success: true, user: demoUser, token: demoUser.token };
    }

    throw new Error(error.response?.data?.message || error.message || 'Login failed. Please check credentials.');
  }
}

/**
 * Register a new user
 */
export async function register(userData) {
  try {
    const res = await studentApiClient.post('/api/v1/auth/register', userData);

    if (res.success && res.data) {
      const { user, token } = res.data;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      syncStudentProfile(user);
      return { success: true, user, token };
    }

    if (res.message) {
      throw new Error(res.message);
    }
  } catch (error) {
    // If backend offline, create local session
    if (error.message?.includes('Network Error') || error.code === 'ERR_NETWORK') {
      const localUser = {
        id: 'local-' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'student',
        department: userData.department || 'Computer Science & Engineering',
        graduationYear: userData.graduationYear || 2026
      };
      const token = 'jobsync_local_token_' + Date.now();
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
      syncStudentProfile(localUser);
      return { success: true, user: localUser, token };
    }

    throw new Error(error.response?.data?.message || error.message || 'Registration failed.');
  }
}

/**
 * Log out user and clear stored tokens
 */
export function logout() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem('jobsync_student_profile');
}

/**
 * Retrieve saved user session from localStorage
 */
export function getSavedSession() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!token || !userJson) return null;

  try {
    const user = JSON.parse(userJson);
    return { token, user };
  } catch {
    return null;
  }
}

export default {
  login,
  register,
  logout,
  getSavedSession
};
