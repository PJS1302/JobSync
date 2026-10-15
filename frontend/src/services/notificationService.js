import { studentApiClient } from './api';

const NOTIFICATIONS_STORAGE_KEY = 'jobsync_student_notifications';

export const NOTIFICATION_TYPES = {
  NEW_DRIVE: {
    label: 'New Placement Drive',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: '🚀'
  },
  APPLICATION_UPDATE: {
    label: 'Application Update',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: '📄'
  },
  SHORTLISTED: {
    label: 'Shortlisted for Round',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    icon: '⭐'
  },
  INTERVIEW_SCHEDULED: {
    label: 'Interview Scheduled',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: '📅'
  },
  INTERVIEW_REMINDER: {
    label: 'Interview Reminder',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: '⏰'
  },
  SELECTION_RESULT: {
    label: 'Selection Result',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: '🏆'
  },
  DEADLINE_REMINDER: {
    label: 'Deadline Reminder',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    icon: '⏳'
  }
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-01',
    type: 'INTERVIEW_SCHEDULED',
    title: 'Round 2 Technical Interview Confirmed',
    message: 'QuantumFin Tech has scheduled your technical interview for tomorrow at 10:00 AM via Google Meet.',
    timestamp: '2026-10-14 20:30',
    read: false,
    link: '/interviews'
  },
  {
    id: 'notif-02',
    type: 'SHORTLISTED',
    title: 'Shortlisted for CloudScale Dynamics',
    message: 'Your profile cleared screening criteria for Associate Software Engineer. Online test links will be sent soon.',
    timestamp: '2026-10-14 16:15',
    read: false,
    link: '/applications'
  },
  {
    id: 'notif-03',
    type: 'NEW_DRIVE',
    title: 'New Drive Announcement: Acuity Systems',
    message: 'Acuity Systems is now accepting applications for Frontend Engineer (React) - CTC ₹12 to 15 LPA.',
    timestamp: '2026-10-14 11:00',
    read: false,
    link: '/drives'
  },
  {
    id: 'notif-04',
    type: 'INTERVIEW_REMINDER',
    title: 'Upcoming Interview in 18 Hours',
    message: 'Reminder: Prepare system design and coding setup for QuantumFin Tech technical interview.',
    timestamp: '2026-10-13 18:00',
    read: true,
    link: '/interviews'
  },
  {
    id: 'notif-05',
    type: 'SELECTION_RESULT',
    title: 'Final Selection Offer: Starlight Media Tech',
    message: 'Congratulations! Official placement offer letter released for Platform Engineer role.',
    timestamp: '2026-10-12 14:00',
    read: true,
    link: '/applications'
  },
  {
    id: 'notif-06',
    type: 'DEADLINE_REMINDER',
    title: 'Drive Deadline Approaching',
    message: 'Applications for QuantumFin Tech close in 48 hours. Submit your application before registration ends.',
    timestamp: '2026-10-11 09:30',
    read: true,
    link: '/drives'
  },
  {
    id: 'notif-07',
    type: 'APPLICATION_UPDATE',
    title: 'Application Status Updated',
    message: 'Your application for CloudScale Dynamics has advanced to the screening evaluation stage.',
    timestamp: '2026-10-10 15:45',
    read: true,
    link: '/applications'
  }
];

/**
 * Fetch student notifications from Student Service
 */
export async function getNotifications() {
  try {
    const res = await studentApiClient.get('/api/v1/notifications');
    if (res.success && res.data && Array.isArray(res.data)) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(res.data));
      return { success: true, data: res.data, isLive: true };
    }
  } catch (error) {
    // Service offline
  }

  const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  const data = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  return { success: true, data, isLive: false };
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id) {
  let isLive = false;
  try {
    const res = await studentApiClient.patch(`/api/v1/notifications/${id}/read`);
    if (res.success) {
      isLive = true;
    }
  } catch (error) {
    // Offline
  }

  const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  const currentList = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  const updated = currentList.map((n) => (n.id === id ? { ...n, read: true } : n));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));

  return { success: true, data: updated, isLive };
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  let isLive = false;
  try {
    const res = await studentApiClient.patch('/api/v1/notifications/read-all');
    if (res.success) {
      isLive = true;
    }
  } catch (error) {
    // Offline
  }

  const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  const currentList = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  const updated = currentList.map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));

  return { success: true, data: updated, isLive };
}

/**
 * Add a new notification for the student (e.g. when shortlisted by placement officer)
 */
export function addNotification(notification) {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const currentList = saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      ...notification
    };
    const updated = [newNotif, ...currentList];
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    return newNotif;
  } catch (err) {
    console.error('Failed to save notification:', err);
    return null;
  }
}

export { NOTIFICATIONS_STORAGE_KEY, INITIAL_NOTIFICATIONS };

export default {
  NOTIFICATION_TYPES,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addNotification,
  NOTIFICATIONS_STORAGE_KEY,
  INITIAL_NOTIFICATIONS
};
