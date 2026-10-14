import React, { useState, useEffect } from 'react';
import NotificationList from '../../components/notifications/NotificationList';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NOTIFICATION_TYPES
} from '../../services/notificationService';

/**
 * Student Notifications Page Module
 * Displays full notifications list, unread counts, mark-read, and mark-all-read operations
 */
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', or specific notification type

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with Student Service notification engine');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    const res = await markNotificationAsRead(id);
    if (res.success && res.data) {
      setNotifications(res.data);
    }
  };

  const handleMarkAllRead = async () => {
    const res = await markAllNotificationsAsRead();
    if (res.success && res.data) {
      setNotifications(res.data);
    }
  };

  // Filter logic
  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !item.read;
    return item.type === filter;
  });

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading placement notifications & round alerts..." />
      </div>
    );
  }

  // 2. Error State
  if (error && notifications.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/60 border border-red-500/30 rounded-2xl max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-xl mb-4">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Failed to Load Notifications</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchNotifications}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Notifications & Alerts</h1>
            {unreadCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {unreadCount} Unread
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                All Read ✓
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status announcements from the Placement Cell, drive updates, and interview schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              id="btn-mark-all-read"
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
            >
              Mark All as Read
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={fetchNotifications}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-3 rounded-xl bg-slate-900/50 border border-slate-800">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
            filter === 'unread'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
          }`}
        >
          Unread ({unreadCount})
        </button>

        {Object.entries(NOTIFICATION_TYPES).map(([typeKey, config]) => (
          <button
            key={typeKey}
            type="button"
            onClick={() => setFilter(typeKey)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              filter === typeKey
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </button>
        ))}
      </div>

      {/* Notifications List Container */}
      <NotificationList
        notifications={filteredNotifications}
        onMarkRead={handleMarkRead}
      />
    </div>
  );
}
