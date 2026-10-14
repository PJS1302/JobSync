import { studentApiClient } from './api';

const INTERVIEWS_STORAGE_KEY = 'jobsync_student_interviews';

const INITIAL_INTERVIEWS = [
  {
    id: 'int-01',
    company: 'QuantumFin Tech',
    role: 'Full Stack Developer',
    round: 'Round 2: Technical Interview (DSA & System Design)',
    date: '2026-10-16',
    time: '10:00 AM IST',
    mode: 'Online (Video Conference)',
    locationOrLink: 'https://meet.google.com/jobsync-qf-tech',
    status: 'scheduled',
    interviewer: 'Lead Architect, Core Platform Team',
    instructions: 'Please be online 5 minutes before time with your IDE and GitHub repositories accessible.'
  },
  {
    id: 'int-02',
    company: 'Veritas Analytics',
    role: 'Junior Data Engineer',
    round: 'Round 3: Behavioral & HR Fitment',
    date: '2026-10-18',
    time: '02:30 PM IST',
    mode: 'On-Campus (In-Person)',
    locationOrLink: 'Placement Cell Boardroom - Room 302',
    status: 'scheduled',
    interviewer: 'Senior Talent Acquisition Partner',
    instructions: 'Carry 2 hard copies of your analyzed resume and academic marksheets.'
  },
  {
    id: 'int-03',
    company: 'Starlight Media Tech',
    role: 'Platform Engineer',
    round: 'Round 1: Core System Architecture & Coding',
    date: '2026-10-08',
    time: '11:30 AM IST',
    mode: 'Online (Google Meet)',
    locationOrLink: 'https://meet.google.com/jobsync-starlight-eval',
    status: 'completed',
    interviewer: 'Principal Software Engineer',
    instructions: 'Evaluation completed. Candidate cleared to offer release stage.'
  }
];

/**
 * Fetch student interview schedule from Student Service
 */
export async function getStudentInterviews() {
  try {
    const res = await studentApiClient.get('/api/v1/interviews');
    if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
      localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify(res.data));
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Offline
  }

  const saved = localStorage.getItem(INTERVIEWS_STORAGE_KEY);
  const data = saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  return { success: true, data, isLive: false };
}

export default {
  getStudentInterviews
};
