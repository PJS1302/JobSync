import { studentApiClient } from './api';

const PROFILE_STORAGE_KEY = 'jobsync_student_profile';
const APPLICATIONS_STORAGE_KEY = 'jobsync_student_applications';

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

const INITIAL_APPLICATIONS = [
  {
    id: 'app-01',
    driveId: 'drv-02',
    company: 'QuantumFin Tech',
    role: 'Full Stack Developer',
    package: '₹24 - 28 LPA',
    location: 'Hyderabad',
    appliedDate: '2026-10-10',
    status: 'interview',
    currentStage: 'Interview',
    timeline: [
      { step: 'Applied', status: 'completed', date: 'Oct 10, 2026', notes: 'Application submitted with profile snapshot' },
      { step: 'Shortlisted', status: 'completed', date: 'Oct 12, 2026', notes: 'Passed GPA & automated screening filter' },
      { step: 'Interview', status: 'current', date: 'Oct 16, 2026', notes: 'Round 2: Technical Interview (DSA & System Design)' },
      { step: 'Selected', status: 'upcoming', date: null, notes: 'Final offer decision pending post-interview' }
    ]
  },
  {
    id: 'app-02',
    driveId: 'drv-01',
    company: 'CloudScale Dynamics',
    role: 'Associate Software Engineer',
    package: '₹18 - 22 LPA',
    location: 'Bengaluru / Hybrid',
    appliedDate: '2026-10-12',
    status: 'shortlisted',
    currentStage: 'Shortlisted',
    timeline: [
      { step: 'Applied', status: 'completed', date: 'Oct 12, 2026', notes: 'Profile and resume submitted' },
      { step: 'Shortlisted', status: 'current', date: 'Oct 14, 2026', notes: 'Shortlisted for online coding assessment' },
      { step: 'Interview', status: 'upcoming', date: null, notes: 'Technical evaluation round' },
      { step: 'Selected', status: 'upcoming', date: null, notes: 'HR round & final offer' }
    ]
  },
  {
    id: 'app-03',
    driveId: 'drv-05',
    company: 'Starlight Media Tech',
    role: 'Platform Engineer',
    package: '₹15 - 18 LPA',
    location: 'Bengaluru',
    appliedDate: '2026-09-28',
    status: 'selected',
    currentStage: 'Selected',
    timeline: [
      { step: 'Applied', status: 'completed', date: 'Sep 28, 2026', notes: 'Initial drive application' },
      { step: 'Shortlisted', status: 'completed', date: 'Oct 02, 2026', notes: 'Aptitude & system coding test passed' },
      { step: 'Interview', status: 'completed', date: 'Oct 08, 2026', notes: 'Two rounds of technical & architectural review' },
      { step: 'Selected', status: 'completed', date: 'Oct 14, 2026', notes: 'Official placement offer released: ₹18.5 LPA' }
    ]
  },
  {
    id: 'app-04',
    driveId: 'drv-06',
    company: 'Apex Cloud Infrastructure',
    role: 'DevOps & Site Reliability Engineer',
    package: '₹16 - 20 LPA',
    location: 'Mumbai / Hybrid',
    appliedDate: '2026-10-05',
    status: 'applied',
    currentStage: 'Applied',
    timeline: [
      { step: 'Applied', status: 'current', date: 'Oct 05, 2026', notes: 'Application logged with placement cell' },
      { step: 'Shortlisted', status: 'upcoming', date: null, notes: 'Awaiting recruiter profile review' },
      { step: 'Interview', status: 'upcoming', date: null, notes: 'Awaiting round scheduling' },
      { step: 'Selected', status: 'upcoming', date: null, notes: 'Final selection' }
    ]
  }
];

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
  ]
};

/**
 * Fetch Student Profile
 */
export async function getStudentProfile(studentId) {
  const userStr = localStorage.getItem('jobsync_auth_user');
  let authUser = null;
  try {
    authUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    authUser = null;
  }

  const targetId = studentId || authUser?.studentId || authUser?.id || authUser?.email;
  const params = targetId ? { studentId: targetId } : {};

  try {
    const res = await studentApiClient.get('/api/v1/students/profile', { params });
    if (res.success && res.data) {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(res.data));
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // API not reachable
  }

  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
  let data = saved ? JSON.parse(saved) : null;
  if (!data) {
    data = {
      ...INITIAL_PROFILE,
      name: authUser?.name || INITIAL_PROFILE.name,
      email: authUser?.email || INITIAL_PROFILE.email,
      department: authUser?.department || INITIAL_PROFILE.department
    };
  } else if (authUser?.name && data.name === 'Alex Rivera' && authUser.name !== 'Alex Rivera') {
    data.name = authUser.name;
    data.email = authUser.email || data.email;
    data.department = authUser.department || data.department;
  }
  return { success: true, data, isLive: false };
}

/**
 * Update Student Profile
 */
export async function updateStudentProfile(profileData, studentId) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));

  const userStr = localStorage.getItem('jobsync_auth_user');
  let authUser = null;
  try {
    authUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    authUser = null;
  }

  const targetId = studentId || authUser?.studentId || authUser?.id;
  const params = targetId ? { studentId: targetId } : {};

  let isLive = false;
  try {
    const res = await studentApiClient.put('/api/v1/students/profile', profileData, { params });
    if (res.success) {
      isLive = true;
    }
  } catch (error) {
    // Backend offline
  }

  return { success: true, data: profileData, isLive };
}

/**
 * Fetch Student Dashboard Data
 */
export async function getStudentDashboard(studentId) {
  const userStr = localStorage.getItem('jobsync_auth_user');
  let authUser = null;
  try {
    authUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    authUser = null;
  }

  const targetId = studentId || authUser?.studentId || authUser?.id || authUser?.email;
  const params = targetId ? { studentId: targetId } : {};

  try {
    const res = await studentApiClient.get('/api/v1/students/dashboard', { params });
    if (res.success && res.data) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Backend offline
  }

  const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
  let profile = savedProfile ? JSON.parse(savedProfile) : null;
  if (!profile) {
    profile = {
      ...INITIAL_PROFILE,
      name: authUser?.name || INITIAL_PROFILE.name,
      email: authUser?.email || INITIAL_PROFILE.email,
      department: authUser?.department || INITIAL_PROFILE.department
    };
  } else if (authUser?.name && profile.name === 'Alex Rivera' && authUser.name !== 'Alex Rivera') {
    profile.name = authUser.name;
    profile.email = authUser.email || profile.email;
    profile.department = authUser.department || profile.department;
  }

  return {
    success: true,
    data: {
      profile,
      ...INITIAL_DASHBOARD
    },
    isLive: false
  };
}

/**
 * Fetch all student applications
 */
export async function getStudentApplications() {
  try {
    const res = await studentApiClient.get('/api/v1/applications');
    if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Backend offline
  }

  const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const data = saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  return { success: true, data, isLive: false };
}

/**
 * Fetch single application by ID
 */
export async function getApplicationById(appId) {
  try {
    const res = await studentApiClient.get(`/api/v1/applications/${appId}`);
    if (res.success && res.data) {
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Backend offline
  }

  const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const applications = saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  const app = applications.find((a) => a.id === appId);

  if (app) {
    return { success: true, data: app, isLive: false };
  }

  return { success: false, message: 'Application not found' };
}

/**
 * Apply to a Placement Drive
 */
export async function applyToPlacementDrive(drive) {
  let isLive = false;
  try {
    const res = await studentApiClient.post('/api/v1/applications', { driveId: drive.id });
    if (res.success) {
      isLive = true;
    }
  } catch (error) {
    // Backend offline
  }

  // Create application entry in local state
  const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
  const applications = saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;

  const existing = applications.find((a) => a.driveId === drive.id);
  if (existing) {
    return { success: true, data: existing, alreadyApplied: true, isLive };
  }

  const newApp = {
    id: `app-${Date.now()}`,
    driveId: drive.id,
    company: drive.company,
    role: drive.role,
    package: drive.package,
    location: drive.location,
    appliedDate: new Date().toISOString().split('T')[0],
    status: 'applied',
    currentStage: 'Applied',
    timeline: [
      { step: 'Applied', status: 'current', date: 'Just now', notes: 'Application logged with placement cell' },
      { step: 'Shortlisted', status: 'upcoming', date: null, notes: 'Awaiting GPA and eligibility verification' },
      { step: 'Interview', status: 'upcoming', date: null, notes: 'Interview rounds configuration' },
      { step: 'Selected', status: 'upcoming', date: null, notes: 'Final selection announcement' }
    ]
  };

  const updated = [newApp, ...applications];
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updated));

  return { success: true, data: newApp, alreadyApplied: false, isLive };
}

export default {
  getStudentProfile,
  updateStudentProfile,
  getStudentDashboard,
  getStudentApplications,
  getApplicationById,
  applyToPlacementDrive
};
