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
    const profile = {
      ...base,
      name: user.name,
      email: user.email,
      department: user.department || base.department || 'Computer Science & Engineering',
      graduationYear: user.graduationYear || base.graduationYear || 2026,
      cgpa: user.cgpa || base.cgpa || 8.5,
      skills: user.skills || base.skills || ['React', 'Node.js', 'JavaScript', 'SQL', 'MongoDB'],
      backlogs: 0
    };
    localStorage.setItem('jobsync_student_profile', JSON.stringify(profile));

    // If student user, ensure they are registered in the placement officer portal (admin applicants)
    if (user.role !== 'admin') {
      try {
        const adminAppsRaw = localStorage.getItem('jobsync_admin_applicants');
        let adminApps = adminAppsRaw ? JSON.parse(adminAppsRaw) : [];
        const hasApplicant = adminApps.some(
          (a) => a.student?.email?.toLowerCase() === user.email?.toLowerCase()
        );
        if (!hasApplicant) {
          adminApps.unshift({
            id: `app-reg-${Date.now()}`,
            student: {
              name: user.name,
              email: user.email,
              rollNo: user.rollNo || '22CS104'
            },
            department: user.department || 'Computer Science & Engineering',
            cgpa: user.cgpa || 8.5,
            skills: profile.skills,
            aiMatchScore: 92,
            applicationStatus: 'Applied',
            driveId: 'drv-01',
            driveCompany: 'CloudScale Dynamics',
            driveRole: 'Associate Software Engineer',
            appliedAt: new Date().toISOString().split('T')[0]
          });
          localStorage.setItem('jobsync_admin_applicants', JSON.stringify(adminApps));
        }

        // Also ensure student applications list is initialized
        const studentAppsRaw = localStorage.getItem('jobsync_student_applications');
        let studentApps = studentAppsRaw ? JSON.parse(studentAppsRaw) : [];
        const hasStudentApp = studentApps.some((a) => a.company === 'CloudScale Dynamics');
        if (!hasStudentApp) {
          studentApps.unshift({
            id: `app-${Date.now()}`,
            driveId: 'drv-01',
            company: 'CloudScale Dynamics',
            role: 'Associate Software Engineer',
            package: '₹18 - 22 LPA',
            location: 'Bengaluru / Hybrid',
            appliedDate: new Date().toISOString().split('T')[0],
            status: 'applied',
            currentStage: 'Applied',
            timeline: [
              { step: 'Applied', status: 'current', date: 'Just now', notes: 'Application logged with placement cell' },
              { step: 'Shortlisted', status: 'upcoming', date: null, notes: 'Awaiting recruiter profile review' },
              { step: 'Interview', status: 'upcoming', date: null, notes: 'Technical assessment round' },
              { step: 'Selected', status: 'upcoming', date: null, notes: 'Final offer' }
            ]
          });
          localStorage.setItem('jobsync_student_applications', JSON.stringify(studentApps));
        }
      } catch (e) {
        console.error('Failed to sync registered student to applicant list:', e);
      }
    }
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
