import { studentApiClient } from './api';

const PROFILE_STORAGE_KEY = 'jobsync_student_profile';
const DASHBOARD_STORAGE_KEY = 'jobsync_student_dashboard';

const INITIAL_PROFILE = {
  name: 'Alex Rivera',
  email: 'alex.rivera@campus.edu',
  phone: '+1 (555) 234-5678',
  department: 'Computer Science & Engineering',
  graduationYear: 2027,
  cgpa: 8.72,
  backlogs: 0,
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'System Design', 'Python', 'REST APIs', 'Docker']
};

const INITIAL_DASHBOARD = {
  stats: {
    eligibleDrives: 14,
    applications: 5,
    shortlisted: 3,
    upcomingInterviews: 2,
    selected: 1,
    unreadNotifications: 2
  },
  recentApplications: [
    {
      id: 'app-01',
      company: 'QuantumFin Tech',
      role: 'Full Stack Developer',
      appliedDate: '2026-10-10',
      status: 'shortlisted',
      stage: 'Round 2: Technical Interview'
    },
    {
      id: 'app-02',
      company: 'CloudScale Dynamics',
      role: 'Associate Software Engineer',
      appliedDate: '2026-10-12',
      status: 'under_review',
      stage: 'Online Screening'
    },
    {
      id: 'app-03',
      company: 'Starlight Media Tech',
      role: 'Platform Engineer',
      appliedDate: '2026-10-01',
      status: 'selected',
      stage: 'Offer Letter Released'
    }
  ],
  upcomingInterviews: [
    {
      id: 'int-01',
      company: 'QuantumFin Tech',
      round: 'Technical Interview (System Design & DSA)',
      date: 'Tomorrow, 10:00 AM',
      mode: 'Google Meet'
    },
    {
      id: 'int-02',
      company: 'Veritas Analytics',
      round: 'HR & Cultural Fitment',
      date: 'Oct 18, 2026, 02:30 PM',
      mode: 'Campus Room 302'
    }
  ],
  eligibleDrives: [
    {
      id: 'drv-01',
      company: 'CloudScale Dynamics',
      role: 'Associate Software Engineer',
      ctc: '₹18 - 22 LPA',
      location: 'Bengaluru / Hybrid',
      minCgpa: 8.0,
      deadline: 'Oct 22, 2026'
    },
    {
      id: 'drv-02',
      company: 'QuantumFin Tech',
      role: 'Full Stack Developer',
      ctc: '₹24 - 28 LPA',
      location: 'Hyderabad',
      minCgpa: 8.5,
      deadline: 'Oct 20, 2026'
    }
  ]
};

/**
 * Fetch Student Profile
 * Attempts live Student Service API first, falling back to persisted local profile
 */
export async function getStudentProfile() {
  try {
    const res = await studentApiClient.get('/api/v1/students/profile');
    if (res.success && res.data) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(res.data));
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // API not reachable or endpoint under construction
  }

  // Load from local storage or defaults
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  const data = saved ? JSON.parse(saved) : INITIAL_PROFILE;
  return { success: true, data, isLive: false };
}

/**
 * Update Student Profile
 * Calls live Student Service PUT /api/v1/students/profile if available, and updates local cache
 */
export async function updateStudentProfile(profileData) {
  // Always update local storage first so user changes persist immediately
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));

  let isLive = false;
  try {
    const res = await studentApiClient.put('/api/v1/students/profile', profileData);
    if (res.success) {
      isLive = true;
    }
  } catch (error) {
    // Backend service not reachable
  }

  return { success: true, data: profileData, isLive };
}

/**
 * Fetch Student Dashboard Data
 * Returns the 6 core metrics:
 * 1. Eligible Drives
 * 2. Applications
 * 3. Shortlisted
 * 4. Upcoming Interviews
 * 5. Selected
 * 6. Unread Notifications
 */
export async function getStudentDashboard() {
  try {
    const res = await studentApiClient.get('/api/v1/students/dashboard');
    if (res.success && res.data) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Fall back to local dashboard snapshot
  }

  const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
  const profile = savedProfile ? JSON.parse(savedProfile) : INITIAL_PROFILE;

  return {
    success: true,
    data: {
      profile,
      ...INITIAL_DASHBOARD
    },
    isLive: false
  };
}

export default {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard
};
