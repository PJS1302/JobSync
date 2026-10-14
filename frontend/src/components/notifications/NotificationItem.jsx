import React from 'react';
import { Link } from 'react-router-dom';
import { NOTIFICATION_TYPES } from '../../services/notificationService';

/**
 * NotificationItem Component
 * Renders individual notification card with type badge, read status, and mark-as-read action
 */
export default function NotificationItem({ notification, onMarkRead }) {
  if (!notification) return null;

  const typeConfig = NOTIFICATION_TYPES[notification.type] || {
    label: notification.type || 'Notification',
    badgeClass: 'bg-slate-700/30 text-slate-300 border-slate-600/30',
    icon: '🔔'
  };

  return (
    <div
      id={`notif-item-${notification.id}`}
      className={`p-4 rounded-xl border transition-all ${
        notification.read
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75'
          : 'bg-slate-900/80 border-blue-500/30 shadow-md shadow-blue-500/5'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base">{typeConfig.icon}</span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${typeConfig.badgeClass}`}
          >
            {typeConfig.label}
          </span>
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" title="Unread" />
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-slate-500">{notification.timestamp}</span>
          {!notification.read && onMarkRead && (
            <button
              type="button"
              onClick={() => onMarkRead(notification.id)}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20"
              title="Mark as read"
            >
              Mark Read
            </button>
          )}
        </div>
      </div>

      <h4 className="text-sm font-bold text-white mb-1">{notification.title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed">{notification.message}</p>

      {notification.link && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60">
          <Link
            to={notification.link}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
          >
            View Related Page →
          </Link>
        </div>
      )}
    </div>
  );
}
