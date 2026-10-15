import { studentApiClient } from './api';
import { INITIAL_INTERVIEWS, INTERVIEWS_STORAGE_KEY } from './interviewService';

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
 * Synchronized with live API, applications state, interviews, and drives
 */
export async function getStudentDashboard(studentId) {
  const userStr = localStorage.getItem('jobsync_auth_user');
  let authUser = null;
  try {
    authUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    authUser = null;
  }

  // 1. Gather active applications from storage
  let localApps = [];
  try {
    const rawApps = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    localApps = rawApps ? JSON.parse(rawApps) : INITIAL_APPLICATIONS;
  } catch {
    localApps = INITIAL_APPLICATIONS;
  }
  if (!Array.isArray(localApps) || localApps.length === 0) {
    localApps = INITIAL_APPLICATIONS;
  }

  // 2. Gather interviews from storage
  let localInterviews = [];
  try {
    const rawInts = localStorage.getItem(INTERVIEWS_STORAGE_KEY);
    localInterviews = rawInts ? JSON.parse(rawInts) : INITIAL_INTERVIEWS;
  } catch {
    localInterviews = INITIAL_INTERVIEWS;
  }
  if (!Array.isArray(localInterviews) || localInterviews.length === 0) {
    localInterviews = INITIAL_INTERVIEWS;
  }

  // 3. Gather placement drives count
  let localDrives = [];
  try {
    const rawDrives = localStorage.getItem('jobsync_admin_drives');
    localDrives = rawDrives ? JSON.parse(rawDrives) : null;
  } catch {
    localDrives = null;
  }

  const eligibleDrivesCount = localDrives?.length || 8;
  const applicationsCount = localApps.length;
  const shortlistedCount = localApps.filter((a) =>
    ['shortlisted', 'interview'].includes((a.status || '').toLowerCase())
  ).length;
  const selectedCount = localApps.filter((a) =>
    (a.status || '').toLowerCase() === 'selected'
  ).length;
  const upcomingInterviewsCount = localInterviews.filter((i) =>
    (i.status || '').toLowerCase() === 'scheduled'
  ).length;

  const dynamicStats = {
    eligibleDrives: eligibleDrivesCount,
    applications: applicationsCount,
    shortlisted: shortlistedCount,
    upcomingInterviews: upcomingInterviewsCount,
    selected: selectedCount,
    unreadNotifications: 2
  };

  const dynamicRecentApps = localApps.slice(0, 3).map((app) => ({
    id: app.id,
    company: app.company,
    role: app.role,
    appliedDate: app.appliedDate || '2026-10-10',
    status: app.status || 'applied',
    stage: app.currentStage || app.stage || 'In Review'
  }));

  const dynamicUpcomingInterviews = localInterviews
    .filter((i) => (i.status || '').toLowerCase() === 'scheduled')
    .slice(0, 2)
    .map((intv) => ({
      id: intv.id,
      company: intv.company,
      round: intv.round,
      date: intv.date ? (intv.time ? `${intv.date} @ ${intv.time}` : intv.date) : 'Tomorrow @ 10:00 AM',
      mode: intv.mode || 'Online'
    }));

  const targetId = studentId || authUser?.studentId || authUser?.id || authUser?.email;
  const params = targetId ? { studentId: targetId } : {};

  let liveData = null;
  let isLive = false;

  try {
    const res = await studentApiClient.get('/api/v1/students/dashboard', { params });
    if (res.success && res.data) {
      liveData = res.data;
      isLive = true;
    }
  } catch (error) {
    // Student service offline or fallback
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
  }

  // Merge profile details ensuring logged-in candidate identity
  const mergedProfile = {
    ...profile,
    ...(liveData?.profile || {}),
    name: authUser?.name || liveData?.profile?.name || profile?.name || 'Dharaneesh',
    department: authUser?.department || liveData?.profile?.department || profile?.department || 'Computer Science & Engineering',
    cgpa: authUser?.cgpa || liveData?.profile?.cgpa || profile?.cgpa || '7.5'
  };

  // Merge stats ensuring no 0-dropout
  const backendStats = liveData?.stats || {
    eligibleDrives: liveData?.eligibleDrivesCount,
    applications: liveData?.applicationsCount,
    shortlisted: liveData?.shortlistedCount,
    upcomingInterviews: liveData?.upcomingInterviewsCount,
    selected: liveData?.selectedCount,
    unreadNotifications: liveData?.unreadNotificationsCount
  };

  const mergedStats = {
    eligibleDrives: backendStats?.eligibleDrives || dynamicStats.eligibleDrives,
    applications: Math.max(backendStats?.applications || 0, dynamicStats.applications),
    shortlisted: Math.max(backendStats?.shortlisted || 0, dynamicStats.shortlisted),
    upcomingInterviews: Math.max(backendStats?.upcomingInterviews || 0, dynamicStats.upcomingInterviews),
    selected: Math.max(backendStats?.selected || 0, dynamicStats.selected),
    unreadNotifications: backendStats?.unreadNotifications || dynamicStats.unreadNotifications
  };

  const mergedRecentApps = (liveData?.recentApplications && liveData.recentApplications.length > 0)
    ? liveData.recentApplications
    : dynamicRecentApps;

  const mergedInterviews = (liveData?.upcomingInterviews && liveData.upcomingInterviews.length > 0)
    ? liveData.upcomingInterviews
    : dynamicUpcomingInterviews;

  return {
    success: true,
    data: {
      profile: mergedProfile,
      stats: mergedStats,
      recentApplications: mergedRecentApps,
      upcomingInterviews: mergedInterviews
    },
    isLive
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
